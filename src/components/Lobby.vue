<template>
  <div class="room-container">
    <h1>
      Lobby
    </h1>

    <div class="">
      <input v-model="roomId" type="text" name="room" value="" placeholder="Enter a room id" />
      <button type="button" @click="joinRoom" name="button" :disabled="roomId.length == 0">Go!</button>
      <br />
      <small>{{responseMessage}}</small>

    </div>
    <br />
    OR <br /> <br />
    <button type="button" name="button" @click="createRoom">Create Room</button>
    <br />
    <small>eg: "5aa89329ed45ec7a4a1a8205"</small>
  </div>
</template>

<script>
import RoomService from '../services/room.service'

export default {
  data () {
    return {
      roomId: '',
      responseMessage: ''
    }
  },
  methods: {
    joinRoom: function () {
      RoomService.join(this.roomId).then(res => {
        console.log(res.data.userId)
      }).catch(e => { this.responseMessage = {...e}.response.data.message })
    },
    createRoom: function () {
      RoomService.create().then(res => {
        console.log(res.data.userId)
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
