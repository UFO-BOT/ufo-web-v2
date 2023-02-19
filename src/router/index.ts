import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import CommandsView from "@/views/CommandsView.vue"
import StatsView from "@/views/StatsView.vue"
import DonateView from "@/views/DonateView.vue"
import LoginView from "@/views/LoginView.vue"
import NotFoundView from "@/views/NotFoundView.vue"

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
  },
  {
    path: '/donate',
    name: 'donate',
    component: DonateView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/:catchAll(.*)',
    name: 'notfound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
