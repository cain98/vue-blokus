import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/components/Lobby'
import Room from '@/components/Room'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: Lobby
    },
    {
      path: '/room/:id',
      name: 'room',
      component: Room
    }
  ]
})
