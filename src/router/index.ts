import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import CommandsView from "@/views/CommandsView.vue"
import StatsView from "@/views/StatsView.vue"
import DonateView from "@/views/DonateView.vue"
import LandingView from "@/views/LandingView.vue"
import MeView from "@/views/MeView.vue"
import GuildView from "@/views/GuildView.vue"
import GuildGeneralView from "@/views/guild/GuildGeneralView.vue"
import GuildEconomyView from "@/views/guild/GuildEconomyView.vue"
import GuildModerationView from "@/views/guild/GuildModerationView.vue"
import GuildLogsView from "@/views/guild/GuildLogsView.vue"
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
    path: '/landing',
    name: 'Landing',
    component: LandingView
  },
  {
    path: '/@me',
    name: 'Me',
    component: MeView
  },
  {
    path: '/guilds/:id',
    name: 'Guild',
    component: GuildView,
    children: [
      {
        path: '/guilds/:id/general',
        name: 'GuildGeneral',
        component: GuildGeneralView
      },
      {
        path: '/guilds/:id/economy',
        name: 'GuildEconomy',
        component: GuildEconomyView
      },
      {
        path: '/guilds/:id/moderation',
        name: 'GuildModeration',
        component: GuildModerationView
      },
      {
        path: '/guilds/:id/logs',
        name: 'GuildLogs',
        component: GuildLogsView
      }
    ]
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
