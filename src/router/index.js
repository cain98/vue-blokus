import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/components/Lobby'
import Board from '@/components/Board'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: Lobby
    },
    {
      path: '/board/:id',
      name: 'board',
      component: Board
    }
  ]
})
