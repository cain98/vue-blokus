<template>
  <div>
    <div class="container" :class="{ active: activeBlock !== false}">
      <!-- Click Overlay -->
      <div class="click-overlay" v-if="activeBlock" @click="unselect()">
      </div>

      <!-- Board -->
      <div class="board" :style="{ top: `${3 * GRID_SIZE}px`, left: `${3 * GRID_SIZE}px` }">
        <div v-for="row in rows" v-bind:key="row" class="row">
          <div v-for="col in cols" class="grid" v-bind:key="col">
          </div>
        </div>
      </div>

      <!-- Blocks -->
      <block
        v-for="block in blocks"
        :team="block.team"
        :ref="block._id + block.team"
        :block="block"
        :GRID_SIZE="GRID_SIZE"
        :onClick="selectPiece"
        v-bind:key="block._id + block.team" />

    </div>
  </div>
</template>

<script>
import intersectionWith from 'lodash/intersectionWith'
import isEqual from 'lodash/isEqual'
import cursorPosition from '../utilities/cursorPosition'
// import roomService from '../services/room.service'
import block from './block'
import { GRID_SIZE } from '../../config'
const userId = window.localStorage.getItem('userId')

export default {
  name: 'Board',
  props: ['roomId'],
  components: {
    block
  },
  sockets: {
    blockMove: function (res) {
      console.log('SOCKET SERVER BLOCK MOVE', res)
      this.moveBlock(res.block)
    },
    blockEdit: function (res) {
      const blockToEdit = this.blocks.find(x => x._id === res.block._id)
      blockToEdit.grid = res.block.grid
      blockToEdit.pieces = res.block.pieces
    },
    playerJoined: function (res) {
      console.log('played joined board!', res)
      this.blocks = res.room.blocks
    },
    roomJoined: function (res) {
      this.blocks = res.room.blocks
    }
  },
  data () {
    return {
      GRID_SIZE: GRID_SIZE,
      blocks: [],
      rows: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      cols: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      activeBlock: false
    }
  },
  mounted () {
    document.addEventListener('mousemove', (e) => {
      this.mouseController(e)
    }, false)

    document.addEventListener('keydown', (event) => {
      if (!this.activeBlock) return
      if ((event.keyCode === 39 || event.keyCode === 37 || event.keyCode === 82)) {
        event.preventDefault()
        this.rotateBlock(this.activeBlock)
      } else if ((event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 70)) {
        event.preventDefault()
        this.flipBlock(this.activeBlock)
      }
    })
  },
  methods: {
    mouseController: function (e) {
      if (this.activeBlock) {
        // Calculate grid positioning
        const mouse = this.mousePosition(e)
        const x = Math.round(mouse.x / GRID_SIZE)
        const y = Math.round(mouse.y / GRID_SIZE)
        const activeBlock = this.blocks.find(x => x._id === this.activeBlock._id)
        // Trigger ONLY on grid change
        if (x === activeBlock.x && y === activeBlock.y) {
          return
        }
        // Set selectedBlock axis
        activeBlock.x = x
        activeBlock.y = y
        this.$socket.emit('block_move', {block: activeBlock, roomId: this.roomId, userId})
      }
    },
    moveBlock: function (block) {
      const blockToMove = this.blocks.find(x => x._id === block._id)
      if (blockToMove.x === block.x && blockToMove.y === block.y) {
        return
      }
      blockToMove.x = block.x
      blockToMove.y = block.y
    },
    mousePosition: function () {
      return cursorPosition()
    },
    getActiveElement: function () {
      return this.$refs[this.activeBlock._id + this.activeBlock.team][0].$el
    },
    selectPiece: function (block) {
      if (block._id === this.activeBlock._id) {
        this.unselect()
      } else if (!this.activeBlock) {
        this.activeBlock = block
        this.$socket.emit('block_select', {block})
      }
    },
    getBlockGrid: function (el) {
      el = el.getBoundingClientRect()
      return {
        left: this.divideByGrid(el.left + window.scrollX),
        right: this.divideByGrid(el.right),
        bottom: this.divideByGrid(el.bottom),
        top: this.divideByGrid(el.top + window.scrollY)
      }
    },
    divideByGrid: function (val) {
      return val / GRID_SIZE
    },
    unselect: function () {
      // find blocks around selected block
      const blocksAround = this.findNearbyBlocks(this.activeBlock)
      // is the placement valid
      if (this.isPlacementValid(this.activeBlock, blocksAround)) {
        this.activeBlock = false
      } else {
        this.$notify({
          title: 'Warning',
          message: `You can't place blocks on-top of each other`,
          type: 'warning'
        })
      }
    },
    findNearbyBlocks: function (block) {
      const areaRadius = 1
      const area = {
        c1: [block.x - areaRadius, block.y - areaRadius],
        c2: [block.x + block.grid.x + areaRadius, block.y + block.grid.y + areaRadius]
      }
      const blocksAround = this.blocks.filter(
        (b) =>
          (b.x + b.grid.x + areaRadius > area.c1[0] && b.x - areaRadius < area.c2[0]) &&
          (b.y + b.grid.y + areaRadius > area.c1[1] && b.y - areaRadius < area.c2[1]) &&
          b._id !== block._id)
      return blocksAround
    },
    isPlacementValid: function (selectedBlock, blocksAround) {
      const invalidPieces = []
      const pieces = selectedBlock.pieces.map(a =>
        ({ x: a.x + selectedBlock.x, y: selectedBlock.y - a.y + 1 }))

      blocksAround.forEach(block => {
        invalidPieces.push(
          ...intersectionWith(
            pieces,
            block.pieces.map(a =>
              ({ x: a.x + block.x, y: block.y - a.y + 1 })),
            isEqual
          ))
      })
      return invalidPieces.length === 0
    },
    rotateBlock: function (selectedBlock) {
      const rotateBlock = this.blocks.find(x => x._id === selectedBlock._id)
      rotateBlock.pieces = rotateBlock.pieces.map((p) => ({
        x: p.y,
        y: -p.x + rotateBlock.grid.x + 1
      }))
      rotateBlock.grid = { y: rotateBlock.grid.x, x: rotateBlock.grid.y }
      this.$socket.emit('block_edit', {block: this.activeBlock, roomId: this.roomId, userId})
    },
    flipBlock: function (selectedBlock) {
      const rotateBlock = this.blocks.find(x => x._id === selectedBlock._id)
      rotateBlock.pieces = rotateBlock.pieces.map((p) => ({
        x: -p.x + rotateBlock.grid.x + 1,
        y: p.y
      }))
      this.$socket.emit('block_edit', {block: this.activeBlock, roomId: this.roomId, userId})
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped >
$block-size: 20px;
.container {
    height: 2000px;
    width: 2000px;
    position: relative;
}
.grid {
  width: $block-size;
  height: $block-size;
  font-size: 7px;
  display: inline-block;
}

.dragging {
  position: absolute;
}

.board {
  outline: 1px solid grey;
  outline-offset: -1px;
  box-shadow: 0px 0px 21px -4px rgba(168, 168, 168, 1);
  background-size: $block-size $block-size;
  position: absolute;
  background-image: linear-gradient(to right, #e7e7e7 1px, transparent 1px), linear-gradient(to bottom, #e7e7e7 1px, transparent 1px);

  // Board colour corners
  .row:last-child .grid:last-child {
    background: rgba(255, 0, 0, 0.45);
  }
  .row:last-child .grid:first-child {
    background: rgba(255, 255, 0, 0.45);
  }
  .row:first-child .grid:first-child {
    background: rgba(0, 255, 0, 0.45);
  }
  .row:first-child .grid:last-child {
    background: rgba(0, 0, 255, 0.45);
  }
}

.dragging .piece, .block:hover {
  opacity: 1;
}

.click-overlay {
  width: 100%;
  position: fixed;
  height: 100%;
  z-index: 999;
  cursor: none;
}
.row {
  display: flex;
  align-items: center;
}
</style>
