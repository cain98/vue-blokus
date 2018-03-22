<template>
  <div class="block"
  @click="onClick(block)"
  v-bind:style="{ top: `${block.y * GRID_SIZE}px`, left: `${block.x * GRID_SIZE}px`}">
    <div
    class="piece"
    v-for="piece in block.pieces"
    v-bind:key="block.id + 'x' + piece.x + 'y' + piece.y"
    v-bind:style="{ left: `${(piece.x - 1) * GRID_SIZE}px`, top: `${(piece.y - 1) * GRID_SIZE}px`, background: team }"
    >
      {{piece.id}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'block',
  props: ['block', 'GRID_SIZE', 'onClick', 'team']
}
</script>

<style lang="scss">
  $block-size: 20px;
  .block {
    cursor: pointer;
    opacity:1;
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
    outline: 1px solid rgba(0,0,0,1);
    outline-offset: -1px;
    box-shadow: 0px 0px 21px -4px rgba(0,0,0,1);
  }
</style>
