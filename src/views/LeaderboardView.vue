<template>
  <div class="center">
    <div class="name text-truncate">{{ guildName }}</div>
    <v-table class="leaderboard-table item-center">
      <thead>
      <tr>
        <th class="text-left">#</th>
        <th class="text-left">{{ $t('Leaderboard.user') }}</th>
        <th class="text-center">{{ $t(`Leaderboard.${sortBy}`) }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="leader in leaders">
        <td class="text-left">{{ leader.number }}</td>
        <td class="text-left">
          <router-link class="user-link" :to="`/leaderboard/${$route.params.id}/${leader.user.id}`">
            <img :src="leader.user.avatar" class="user-avatar" alt="">
              <span>{{ leader.user.tag }}</span>
          </router-link>
        </td>
        <td>{{ leader[sort] === null ? 'Infinity' : leader[sort] }}</td>
      </tr>
      </tbody>
    </v-table>
    <v-progress-linear v-if="loading" class="loading" indeterminate/>
    <div class="leaderboard-menu">
      <div>
        <v-pagination v-model="page" :length="pageCount" :disabled="loading"
                      :total-visible="width >= 600 ? 7 : 0" @update:modelValue="loadLeaderboard"/>
      </div>
      <div>
        <v-select v-model="sortBy" class="sort-select" :items="sortItems" :disabled="loading"
                  :label="$t('Leaderboard.sort')" @update:modelValue="loadLeaderboard"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import config from "@/config.json";
import {useRoute} from "vue-router";
import i18n from "@/plugins/i18n";

const route = useRoute()
let guildName = ref(i18n.global.t('Leaderboard.loading'))
let pageCount = ref(0)
let leaders = ref([])
let sortBy = ref('balance')
let sort = ref('balance')
const sortItems = computed(() => [
  {title: i18n.global.t('Leaderboard.balance'), value: 'balance'},
  {title: i18n.global.t('Leaderboard.xp'), value: 'xp'}
])
let page = ref(1)
let loading = ref(true)
let width = ref(window.innerWidth)

window.addEventListener('resize', () => width.value = window.innerWidth)

document.title = i18n.global.t('Leaderboard.title')

async function loadLeaderboard() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/leaderboard/` +
      `${route.params.id}?page=${page.value}&sort=${sortBy.value}`, {
    headers: {
      Authorization: localStorage.getItem('token') as string
    }
  })
  let body = await response.json();
  if (!response.ok) return window.location.replace('/@me');
  guildName.value = body.guildName;
  pageCount.value = body.pageCount;
  leaders.value = body.leaders;
  loading.value = false;
  sort.value = sortBy.value;
}

onMounted(async () => {
  await loadLeaderboard()
})
</script>

<style scoped>
.name {
  font-size: calc(2.5vw + 1rem);
}

.leaderboard-table {
  width: 1200px;
  background-color: rgb(var(--v-theme-block))!important;
  box-shadow: 0 0 8px -3px rgb(var(--v-theme-shadow));
}

.user-link {
  text-decoration: none;
  color: inherit;
  transition-duration: 200ms;
}

.user-link:active {
  opacity: 0.7;
  transition-duration: 200ms;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 5px;
}

.leaderboard-menu {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px auto;
  max-width: 1200px;
}

.sort-select {
  width: 150px!important;
  margin: 8px 0 0 0!important;
  padding: 0!important;
}

.loading {
  width: 1200px;
}
</style>