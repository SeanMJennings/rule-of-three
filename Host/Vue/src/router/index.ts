import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Landing from '../views/Landing.vue'
import Notes from '../views/Notes.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Landing
  },
  {
    path: '/notes',
    component: Notes
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
