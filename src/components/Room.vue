<template>
  <div>
    <Board :roomId="$route.params.id" />
  </div>
</template>
<script>
import Board from './Board'

export default {
  components: {
    Board
  }
}

</script>
<style lang="scss">
</style>
