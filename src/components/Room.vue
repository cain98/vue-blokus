<template>
  <div>
    <Board />
  </div>
</template>
<script>
import Board from './Board'
import RoomService from '../services/room.service'

export default {
  components: {
    Board
  },
  methods: {
    joinRoom: function (userId) {
      RoomService.join({ room: this.router.params.id, userId: userId }).then(res => {
        window.localStorage.setItem('userId', res.data.userId)
        this.$router.push({ path: `/room/${res.data.room._id}` })
      }).catch(e => { console.log(e) })
    }
  },
  mounted () {
    this.joinRoom(window.localStorage.getItem('userId'))
  }
}

</script>
<style lang="scss">
</style>
