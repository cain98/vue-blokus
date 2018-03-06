<template>
  <div class="block"
  @click="onClick(block)"
  v-bind:style="{ height: `${block.grid.y * GRID_SIZE}px`, width: `${block.grid.x * GRID_SIZE}px`, top: `${block.y}px`, left: `${block.x}px`}">
    <div
    class="piece"
    v-for="piece in block.pieces"
    v-bind:key="block.id + 'x' + piece.x + 'y' + piece.y"
    v-bind:style="{ left: `${(piece.x - 1) * GRID_SIZE}px`, top: `${(piece.y - 1) * GRID_SIZE}px` }"
    >
      {{piece.id}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'block',
  props: ['block', 'GRID_SIZE', 'onClick']
}
</script>

<style lang="scss">
  $block-size: 40px;
  .block {
    cursor: pointer;
    /* padding: $block-size; */
    opacity: 0.35;
    position: relative;
  }
  .piece {
    min-width: $block-size;
    min-height: $block-size;
    background: red;
    color: white;
    font-size: 8px;
    max-width: $block-size;
    position: absolute;
    outline: 2px solid rgba(0,0,0,0.4);
    outline-offset: -5px;
  }
</style>
