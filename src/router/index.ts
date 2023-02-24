import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import CommandsView from "@/views/CommandsView.vue"
import StatsView from "@/views/StatsView.vue"
import DonateView from "@/views/DonateView.vue"
import MeView from "@/views/MeView.vue"
import LeaderboardView from "@/views/LeaderboardView.vue"
import LeaderboardMemberView from "@/views/LeaderboardMemberView.vue"
import LoginView from "@/views/LoginView.vue"
import NotFoundView from "@/views/NotFoundView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/commands',
    name: 'Commands',
    component: CommandsView
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView
  },
  {
    path: '/donate',
    name: 'Donate',
    component: DonateView
  },
  {
    path: '/@me',
    name: 'Me',
    component: MeView
  },
  {
    path: '/leaderboard/:id',
    name: 'Leaderboard',
    component: LeaderboardView
  },
  {
    path: '/leaderboard/:id/:user',
    name: 'LeaderboardMember',
    component: LeaderboardMemberView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
