<template>
  <div class="container" :class="{ active: activePiece !== false}">
    <div class="click-overlay" @click="unselect()">
    </div>
    <div class="board">
      <div v-for="row in rows" v-bind:key="row" class="row">
        <div v-for="col in cols" class="grid" v-bind:key="col">

        </div>
      </div>
    </div>
    <div class="selection">
      <div class="block"
      v-for="block in blocks"
      :ref="block.id"
      v-bind:key="block.id"
      @click="selectPiece(block)"
      v-bind:style="{ height: `${block.grid.y * 20}px`, width: `${block.grid.x * 20}px`, top: `${block.y - 20}px`, left: `${block.x - 20}px`}">
        <div
        class="piece"
        v-for="piece in block.pieces"
        v-bind:key="block.id + 'x' + piece.x + 'y' + piece.y"
        v-bind:style="{ left: `${(piece.x - 1) * 20}px`, top: `${(piece.y - 1) * 20}px` }"
        >
          {{piece.id}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blocks from '../blocks'
export default {
  name: 'Index',
  data () {
    return {
      rows: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      cols: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      activePiece: false,
      blocks: blocks,
      isInsideBoard: false
    }
  },
  mounted () {
    document.addEventListener('mousemove', () => {
      if (this.activePiece) {
        const mouse = this.mousePosition()
        const el = this.$refs[this.activePiece.id][0]
        var rect = el.getBoundingClientRect()
        console.log(rect.top, rect.right, rect.bottom, rect.left)
        if (rect.right <= 420 && rect.right >= 20 &&
          rect.bottom <= 420 && rect.bottom >= 20 &&
          rect.left <= 420 && rect.left >= 20 &&
          rect.top <= 420 && rect.top >= 20) {
          if (!this.isInsideBoard) {
            this.isInsideBoard = true
          }
        } else {
          if (this.isInsideBoard) {
            this.isInsideBoard = false
          }
        }
        console.log(this.isInsideBoard)

        const index = this.blocks.findIndex(x => x.id === this.activePiece.id)
        el.classList.add('dragging')
        const x = Math.round(mouse.x / 20) * 20
        const y = Math.round(mouse.y / 20) * 20
        this.blocks[index].x = x
        this.blocks[index].y = y
        // el.setAttribute('style', `top: ${y - 20}px; left: ${x - 20}px`)
      }
    }, false)
  },
  methods: {
    mousePosition: function () {
      var eventDoc
      var doc
      var body
      event = event || window.event // eslint-disable-line

      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document
        doc = eventDoc.documentElement
        body = eventDoc.body

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0)
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0)
      }

      return { x: event.pageX, y: event.pageY }
    },
    selectPiece: function (block) {
      if (block.id === this.activePiece.id) {
        this.activePiece = false
      } else {
        this.activePiece = block
      }
    },
    unselect: function () {
      this.activePiece = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  background-color: #fff;
background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px), linear-gradient(rgba(221, 221, 221, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 217, 217, 0.3) 1px, transparent 1px);
background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
}
.container {
  display: flex;
  padding: 20px;
}
.active {
  /* cursor: none; */
}
.active .block {
  /* cursor: none; */

}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.grid {
  min-width: 20px;
  min-height: 20px;
  font-size: 7px;
  display: inline;
}

.block {
  cursor: pointer;
  /* padding: 20px; */
  opacity: 0.35;
  position: relative;
}
.dragging {
  position: absolute;
  /* cursor: none; */

}

.board {
  outline: 1px solid grey;
  outline-offset: -1px;
}

.dragging .piece, .block:hover {
  opacity: 1;
}
.piece {
  min-width: 20px;
  min-height: 20px;
  background: red;
  color: white;
  font-size: 8px;
  max-width: 20px;
  position: absolute;
  outline: 2px solid rgba(0,0,0,0.4);
  outline-offset: -3px;
}
.selection {
  width: 100%;
display: flex;
}

.click-overlay {
  width: 100%;
    position: absolute;
    height: 100%;
}
.row {
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
</style>
