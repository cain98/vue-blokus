<template>
  <div class="room-container">
    <h1>
      Blokus
    </h1>

    <div class="">
      <input v-model="roomInput" type="text" name="room" value="" placeholder="Enter a room id" />
      <button type="button" @click="joinRoom" name="button" :disabled="roomInput.length == 0">Go!</button>
      <small> Or </small>
      <button type="button" name="button" @click="createRoom">Create Room</button>
      <br />
      <small>{{responseMessage}}</small>

    </div>
    <small>eg: "5aa89329ed45ec7a4a1a8205"</small>
  </div>
</template>

<script>
import RoomService from '../services/room.service'

export default {
  data () {
    return {
      roomInput: '',
      responseMessage: ''
    }
  },
  methods: {
    joinRoom: function () {
      RoomService.join(this.roomInput).then(res => {
        window.localStorage.setItem('userId', res.data.userId)
        this.$router.push({ path: `/room/${res.data.room._id}` })
      }).catch(e => { console.log(e) })
    },
    createRoom: function () {
      RoomService.create().then(res => {
        window.localStorage.setItem('userId', res.data.userId)
        this.$router.push({ path: `/room/${res.data.room._id}` })
      }).catch(e => { this.responseMessage = {...e}.response.data.message })
    }
  }
}
</script>

<style lang="scss" scoped>
.room-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh
}
</style>
