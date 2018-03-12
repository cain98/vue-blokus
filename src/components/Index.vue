<template>
  <div>
    <div class="container" :class="{ active: activePiece !== false}">

      <!-- Click Overlay -->
      <div class="click-overlay" v-if="activePiece" @click="unselect()">
      </div>

      <!-- Board -->
      <div class="board" :style="{ top: `${gridCords.y * GRID_SIZE}px`, left: `${gridCords.x * GRID_SIZE}px` }">
        <div v-for="row in rows" v-bind:key="row" class="row">
          <div v-for="col in cols" class="grid" v-bind:key="col">
          </div>
        </div>
      </div>

      <!-- Blocks -->
      <block
        v-for="block in blocks.RED"
        :team="block.team"
        :ref="block.id + block.team"
        :block="block"
        :GRID_SIZE="GRID_SIZE"
        :onClick="selectPiece"
        v-bind:key="block.id + block.team" />
      <block
        v-for="block in blocks.BLUE"
        :team="block.team"
        :ref="block.id + block.team"
        :block="block"
        :GRID_SIZE="GRID_SIZE"
        :onClick="selectPiece"
        v-bind:key="block.id + block.team" />
      <block
        v-for="block in blocks.GREEN"
        :team="block.team"
        :ref="block.id + block.team"
        :block="block"
        :GRID_SIZE="GRID_SIZE"
        :onClick="selectPiece"
        v-bind:key="block.id + block.team" />
      <block
        v-for="block in blocks.YELLOW"
        :ref="block.id + block.team"
        :team="block.team"
        :block="block"
        :GRID_SIZE="GRID_SIZE"
        :onClick="selectPiece"
        v-bind:key="block.id + block.team" />
    </div>
  </div>
</template>

<script>
import BLOCKS from '../blocks'
import cursorPosition from '../utilities/cursorPosition'

import block from './block'
import config from '../config'
const TEAMS = {
  RED: 'RED',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW'
}
export default {
  name: 'Index',
  components: {
    block
  },
  data () {
    return {
      GRID_SIZE: config.GRID_SIZE,
      blocks: {
        [TEAMS.RED]: BLOCKS(TEAMS.RED),
        [TEAMS.BLUE]: BLOCKS(TEAMS.BLUE),
        [TEAMS.GREEN]: BLOCKS(TEAMS.GREEN),
        [TEAMS.YELLOW]: BLOCKS(TEAMS.YELLOW)
      },
      rows: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      cols: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      activePiece: false,
      board: [],
      gridCords: {x: 0, y: 0}
    }
  },
  mounted () {
    document.addEventListener('mousemove', () => {
      this.controller()
    }, false)
    this.gridCords = {
      x: Math.round(Math.round(Math.round(window.innerWidth / config.GRID_SIZE) / 2 - 10)),
      y: Math.round(Math.round(Math.round(window.innerHeight / config.GRID_SIZE) / 2 - 10))
    }
  },
  methods: {
    controller: function () {
      if (this.activePiece) {
        // Calculate grid positioning
        const mouse = this.mousePosition()
        const x = Math.round(mouse.x / config.GRID_SIZE) * config.GRID_SIZE
        const y = Math.round(mouse.y / config.GRID_SIZE) * config.GRID_SIZE
        const activeBlock = this.blocks[this.activePiece.team].find(x => x.id === this.activePiece.id)
        // Trigger ONLY on grid change
        if (x === activeBlock.x && y === activeBlock.y) {
          return
        }
        // Set selectedBlock axis
        activeBlock.x = x
        activeBlock.y = y
      }
    },
    mousePosition: function () {
      return cursorPosition()
    },
    getActiveElement: function () {
      return this.$refs[this.activePiece.id + this.activePiece.team][0].$el
    },
    dropBlock: function () {
      // const el = this.getActiveElement()
      // const blockGrid = this.getBlockGrid(el)
    },
    selectPiece: function (block) {
      if (block.id === this.activePiece.id) {
        this.unselect()
      } else {
        this.activePiece = block
      }
    },
    getBlockGrid: function (el) {
      el = el.getBoundingClientRect()
      return {
        left: (el.left + window.scrollX) / config.GRID_SIZE,
        right: (el.right) / config.GRID_SIZE,
        bottom: (el.bottom) / config.GRID_SIZE,
        top: (el.top + window.scrollY) / config.GRID_SIZE
      }
    },
    unselect: function () {
      this.dropBlock()
      this.activePiece = false
    }
  }
}
</script>

<style lang="scss" scoped >
$block-size: 20px;
.container {
  position: relative;
  min-height: 100%;
}
.grid {
  min-width: $block-size;
  min-height: $block-size;
  font-size: 7px;
  display: inline;
}

.dragging {
  position: absolute;
}

.board {
  outline: 1px solid grey;
  outline-offset: -1px;
  box-shadow: 0px 0px 21px -4px rgba(168, 168, 168, 0.75);
  background-size: 20px 20px;
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
