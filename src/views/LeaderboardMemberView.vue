<template>
  <div class="center">
    <div class="member-card">
      <v-progress-circular v-if="loading" :size="80" :width="6" indeterminate/>
      <div v-else>
        <v-img :lazy-src="member.user.avatar" :src="member.user.avatar" class="member-avatar item-center"/>
        <div class="member-global-name">{{ member.user.global_name }}</div>
        <div class="member-username">{{ member.user.username }}</div>
        <div class="mb-1">
          <div class="subtitle">{{ $t('LeaderboardMember.server') }}</div>
          <div class="guild-name">{{ guildName }}</div>
        </div>
        <div v-if="member.number !== null" class="mb-1">
          <div class="subtitle">{{ $t('LeaderboardMember.rank') }}</div>
          <div class="guild-name">{{ member.number }}</div>
        </div>
        <div class="member-flex">
          <div>
            <div class="subtitle">{{ $t('LeaderboardMember.balance') }}</div>
            <div>{{ Number(member.balance).toLocaleString($i18n.locale) }}</div>
          </div>
          <div>
            <div class="subtitle">{{ $t('LeaderboardMember.xp') }}</div>
            <div>{{ Number(member.xp).toLocaleString($i18n.locale) }}</div>
          </div>
        </div>
        <div v-if="manageable">
          <v-divider class="mt-2 mb-2"></v-divider>
          <div class="member-flex">
            <v-btn icon variant="text" color="primary" size="40" :to="`/leaderboard/${route.params.id}`">
              <v-icon>keyboard_return</v-icon>
            </v-btn>
            <UpdateBalance :member="member" @update="updateBalance"/>
            <DeleteBalance :member="member" @delete="deleteBalance"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {LeaderboardMember} from "@/types/LeaderboardMember";
import config from "@/config.json";
import {useRoute} from "vue-router";
import i18n from "@/plugins/i18n";
import {UpdateBalanceForm} from "@/types/UpdateBalanceForm";
import UpdateBalance from "@/components/balances/UpdateBalance.vue";
import DeleteBalance from "@/components/balances/DeleteBalance.vue";

const route = useRoute()
let loading = ref(true)
let manageable = ref(false)
let guildName = ref()
let member: Ref<LeaderboardMember> = ref({} as LeaderboardMember)

document.title = i18n.global.t('LeaderboardMember.title')

function updateBalance(balance: UpdateBalanceForm) {
  member.value.balance = balance.balance;
  if(balance.resetXP) member.value.xp = 0;
  return load();
}

function deleteBalance() {
  window.location.replace(`/leaderboard/${route.params.id}`)
}

async function load() {
  let response = await fetch(`${config.API}/private/leaderboard/${route.params.id}/${route.params.user}`, {
    headers: {
      Authorization: localStorage.getItem('token') as string
    }
  })
  let body = await response.json()
  if (!response.ok) return window.location.replace('/@me');
  guildName.value = body.guildName;
  member.value = body.leader;
  let guildResponse = await fetch(`${config.API}/private/guilds/${route.params.id}/info`, {headers: {
      Authorization: localStorage.getItem('token') as string
    }})
  if(guildResponse.ok) manageable.value = true;
}

onMounted(async () => {
  loading.value = true;
  await load();
  loading.value = false;
})
</script>

<style scoped>
.member-card {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  border-radius: 5px;
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 8px -3px rgb(var(--v-theme-shadow));
}

.member-avatar {
  max-width: 150px;
  max-height: 150px;
  border-radius: 50%;
}

.member-global-name {
  margin-top: 10px;
  font-size: 1.7em;
  line-height: 1em;
}

.member-username {
  font-size: 1.2em;
  color: rgb(var(--v-theme-description));
  margin-bottom: 10px;
  opacity: 0.7;
}

.member-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
  margin: auto;
}

.subtitle {
  color: rgb(var(--v-theme-description));
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 5px;
}

.guild-name {
  font-size: 1.2em;
}
</style>