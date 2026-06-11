import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/syllabus',
    name: 'Syllabus',
    component: () => import('../pages/Syllabus.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../pages/Notes.vue')
  },
  {
    path: '/pyq',
    name: 'PYQ',
    component: () => import('../pages/PYQ.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../pages/Projects.vue')
  },
  {
    path: '/ieagpt',
    name: 'IEAGPT',
    component: () => import('../pages/IeaGPT.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
