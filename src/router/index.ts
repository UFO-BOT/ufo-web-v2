import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import CommandsView from "@/views/CommandsView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/commands',
    name: 'commands',
    component: CommandsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
