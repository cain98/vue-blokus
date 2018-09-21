<template>
  <div
  class="block"
  :class="{ [team]: true }"
  @click="onClick(block)"
  v-bind:style="blockPosition">
    <!-- <div class="block-id">{{ block._id.slice(block._id.length - 3, block._id.length) }}</div> -->
    <div class="helper" v-bind:style="helperStyling"></div>
      <div
      class="piece"
      v-for="piece in block.pieces"
      v-bind:key="block.id + 'x' + piece.x + 'y' + piece.y"
      v-bind:style="{ left: `${(piece.x - 1) * GRID_SIZE}px`, bottom: `${(piece.y - 1) * GRID_SIZE}px` }"
      >
      </div>
  </div>
</template>

<script>
export default {
  name: 'block',
  props: ['block', 'GRID_SIZE', 'onClick', 'team'],
  computed: {
    blockPosition: function () {
      return {
        top: `${this.block.y * this.GRID_SIZE}px`,
        left: `${this.block.x * this.GRID_SIZE}px`
      }
    },
    helperStyling: function () {
      const { x, y } = this.block.grid
      return {
        width: `${(x + 2) * this.GRID_SIZE}px`,
        height: `${(y + 2) * this.GRID_SIZE}px`,
        left: `-${((x + 2) * this.GRID_SIZE) / 2 - ((x / 2) * this.GRID_SIZE)}px`,
        top: `-${((y + 1) * this.GRID_SIZE)}px`
      }
    }
  }
}
</script>

<style lang="scss">
  $block-size: 20px;
  .RED .piece {
    background: #F56C6C;
  }
  .BLUE .piece {
    background: #409EFF;
  }
  .YELLOW .piece {
    background: #E6A23C;
  }
  .GREEN .piece {
    background: #67C23A;
  }
  .helper {
    position: absolute;
    outline: 1px solid rgba(255,0,0,0.2);
    background-size: 20px 20px;
    background-image: linear-gradient(to right, #e7e7e7 1px, transparent 1px), linear-gradient(to bottom, #e7e7e7 1px, transparent 1px);
  }
  .block-id {
    position: absolute;
    font-size: 10px;
    z-index: 999;
    bottom: -20px;
    left: 0px;
  }
  .block {
    cursor: pointer;
    opacity:1;
    position: relative;
  }
  .piece {
    min-width: $block-size;
    min-height: $block-size;
    color: white;
    font-size: 8px;
    max-width: $block-size;
    position: absolute;
    outline: 1px solid rgba(255, 255, 255,1);
    outline-offset: -1px;
    border-radius: 7px;
    // box-shadow: 0px 0px 21px -4px rgba(0,0,0,1);
  }
</style>
