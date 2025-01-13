import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/player/:id/:userId',
      name: 'PlayerView',
      component: () => import('../views/PlayerView.vue')
    },
    {
      path: '/admin/:id',
      name: 'AdminView',
      component: ()=> import('../views/Admin.vue')
    },
    {
      path: '/lobby/:id',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/create/',
      name: 'BeforeCreate',
      component: () => import('../views/BeforeCreate.vue')
    },
    {
    path: '/makeQuiz/',
    name: 'CreateView',
    component: () => import('../views/CreateView.vue')
    },
    {
      path: '/selectQuiz/',
      name: 'SelectQuestions',
      component: () => import('../views/SelectQuestions.vue')
    },
    {
        path: '/adminLobby/:id',
        name: 'AdminLobbyView',
        component: ()=> import('../views/AdminLobbyView.vue')
    },
    {
      path: '/resultLobby/:id',
      name: 'ResultLobbyView',
      component: ()=> import('../views/ResultLobbyView.vue')
  },
    {
      path: '/game/:id',
      name: 'GameView',
      component: () => import('../views/GameView.vue')
    },
    {
      path: '/join/',
      name: 'Join',
      component: () => import('../views/Join.vue')
    },
    {
      path:'/result/:id',
      name:'resultView',
      component: () => import('../views/Result.vue')
    },
    {
      path:'/resultPlayer/:id/:userId',
      name:'ResultPlayerView',
      component: () => import('../views/ResultPlayer.vue')
    }

  ]
})

export default router
