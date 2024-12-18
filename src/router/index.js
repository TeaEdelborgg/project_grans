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
      path: '/poll/:id/:userId', // skapa en till dynamisk rutt med id
      name: 'PollView',
      component: () => import('../views/PollView.vue')
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
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/join/',
      name: 'Join',
      component: () => import('../views/Join.vue')
    },
    {
      path:'/finalResult/:id',
      name:'FinalResultView',
      component: () => import('../views/FinalResult.vue')
    },
    {
      path:'/finalResultPlayer/:id/:userId',
      name:'FinalResultPlayerView',
      component: () => import('../views/FinalResultPlayer.vue')
    }

  ]
})

export default router
