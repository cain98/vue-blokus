<template>
  <div>
    <div class="click-overlay" @click="unselect()">
    </div>
    <div class="container" :class="{ active: activePiece !== false}">
      <div class="board">
        <div v-for="row in rows" v-bind:key="row" class="row">
          <div v-for="col in cols" class="grid" v-bind:key="col">
          </div>
        </div>
      </div>

      <div class="selection">
        <block
          v-for="block in blocks"
          :ref="block.id"
          :block="block"
          :GRID_SIZE="GRID_SIZE"
          :onClick="selectPiece"
          v-bind:key="block.id" />
      </div>
    </div>
  </div>
</template>

<script>
import BLOCKS from '../blocks'
import cursorPosition from '../utilities/cursorPosition'

import block from './block'
const GRID_SIZE = 40
export default {
  name: 'Index',
  components: {
    block
  },
  data () {
    return {
      GRID_SIZE: GRID_SIZE,
      blocks: BLOCKS,
      rows: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      cols: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      activePiece: false,
      isInsideBoard: false,
      isHighlightValid: false
    }
  },
  mounted () {
    document.addEventListener('mousemove', () => {
      this.controller()
    }, false)
  },
  methods: {
    controller: function () {
      if (this.activePiece) {
        // Calculate grid positioning
        const mouse = this.mousePosition()
        const x = Math.round(mouse.x / GRID_SIZE) * GRID_SIZE
        const y = Math.round(mouse.y / GRID_SIZE) * GRID_SIZE
        const activeBlock = this.blocks.find(x => x.id === this.activePiece.id)

        // Trigger ONLY on grid change
        if (x === activeBlock.x && y === activeBlock.y) {
          return
        }

        // Find selected block
        const el = this.$refs[this.activePiece.id][0].$el
        el.classList.add('dragging')

        // Set selectedBlock axis
        activeBlock.x = x
        activeBlock.y = y
      }
    },
    mousePosition: function () {
      return cursorPosition()
    },
    getActiveElement: function () {
      return this.$refs[this.activePiece.id][0].$el
    },
    highlightPosition: function () {
      const el = this.getActiveElement()
      const rect = this.getOffset(el)
      const topRightGrid = {x: rect.left / GRID_SIZE, y: rect.top / GRID_SIZE}
      const topLeftGrid = {
        x: (rect.left + ((this.activePiece.grid.x - 1) * GRID_SIZE)) / GRID_SIZE,
        y: (rect.top + ((this.activePiece.grid.y - 1) * GRID_SIZE)) / GRID_SIZE
      }
      console.log(topRightGrid, topLeftGrid)
      if (el) {
        if (!this.isInsideBoard) {
          this.isInsideBoard = true
        }
      } else {
        if (this.isInsideBoard) {
          this.isInsideBoard = false
        }
      }
    },
    selectPiece: function (block) {
      if (block.id === this.activePiece.id) {
        this.unselect()
      } else {
        this.activePiece = block
      }
    },
    getOffset: function (el) {
      el = el.getBoundingClientRect()
      return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
      }
    },
    isPlacementValid: function () {
      const el = this.getActiveElement()
      const rect = this.getOffset(el)
      // console.log(rect.left / GRID_SIZE, rect.top / GRID_SIZE)
    },
    unselect: function () {
      this.highlightPosition()
      if (this.isInsideBoard) {
        this.isPlacementValid()
      } else {
        this.activePiece = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped >

  $block-size: 40px;
  .container {
    display: flex;
    padding: $block-size;
    position: relative;
  }
.grid {
  min-width: $block-size;
  min-height: $block-size;
  font-size: 7px;
  display: inline;
}

.dragging {
  position: absolute;
  /* cursor: none; */

}

.board {
  outline: 1px solid grey;
  outline-offset: -1px;
  box-shadow: 0px 0px 21px -4px rgba(168, 168, 168, 0.75)
}

.dragging .piece, .block:hover {
  opacity: 1;
}

.selection {
  margin-left: $block-size;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.click-overlay {
    width: 100%;
    position: fixed;
    height: 100%;
}
.row {
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
</style>
