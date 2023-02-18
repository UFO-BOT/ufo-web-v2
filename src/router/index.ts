import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import CommandsView from "@/views/CommandsView.vue"
import StatsView from "@/views/StatsVue.vue"

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
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
