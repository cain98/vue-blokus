<template>
  <div>
    <Board :roomId="$route.params.id" :player="player" />
      <!-- Player information -->
      <div class="player-info">
        Player ID: {{ player.id }} <br />
        Team: {{ player.team }} <br />
        <button @click="leaveRoom()">leave game</button>
      </div>
  </div>
</template>
<script>
import Board from './Board'
const userId = window.localStorage.getItem('userId')

export default {
  components: {
    Board
  },
  sockets: {
    connected: function () {
      console.log('socket connected')
    },
    disconnected: function () {
      console.log('socket disconnected')
    },
    roomJoined: function (res) {
      console.log('room joined', res)

      this.player = res.player
      window.localStorage.setItem('userId', this.player._id)
      switch (res.status) {
        case 'select': this.playerSelect(); break
        case 'joined': this.joinGame(); break
        case 'full': this.spectate(); break
        default: this.kick()
      }
    }
  },
  data () {
    return {
      player: {},
      players: []
    }
  },
  mounted () {
    this.joinRoom()
  },
  methods: {
    joinRoom: function () {
      // connect to the room
      this.$socket.emit('room_connect', { roomId: this.$route.params.id, userId })
      // roomService.join({
      //   roomId: this.roomId,
      //   userId: window.localStorage.getItem('userId')
      // }).then(res => {
      //   window.localStorage.setItem('userId', res.data.player._id)
      //   this.player = {
      //     id: res.data.player._id,
      //     team: res.data.player.team
      //   }
      //   this.blocks = res.data.room.blocks
      // })
    },
    playerSelect: function () {
      // window.localStorage.setItem('userId', this.player.id)
      console.log('playerselect')
      this.$confirm('Team Selection here', 'Info', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        // choose nickname and colour here
        this.$socket.emit('player_connect', { roomId: this.$route.params.id, userId, colour: 'red', nickName: 'Cain' })
      })
    },
    leaveRoom: async function () {
      await this.$confirm('Are you sure you want to leave?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        this.$router.push({ path: `/` })
      })
    },
    joinGame: function (room) {

    }
  }
}
</script>
<style lang="scss">
.player-info {
  position: fixed;
  right: 0;
  text-align: right;
  bottom: 0px;
  text-transform: capitalize;
  font-size: 12px;
}
</style>
