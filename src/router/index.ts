import { createRouter, createWebHistory } from 'vue-router'
import Screen from './Screen.vue'
import Error from './Error.vue'
const routes = [
  {
    name: 'ScreenPage',
    path: '/',
    component: Screen,
  },
  {
    name: 'ErrorPage',
    path: '/error',
    component: Error,
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
