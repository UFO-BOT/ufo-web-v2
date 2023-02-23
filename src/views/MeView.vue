<template>
  <div class="center">
    <br>
    <div v-if="!user.username"><v-progress-circular :size="100" :width="7" indeterminate/></div>
    <div v-else>
      <v-img class="user-avatar item-center" :lazy-src="user.avatarURL" :src="user.avatarURL"/>
      <div class="user-tag">
        <span class="username">{{ user.username }}</span>
        <span class="discriminator">#{{ user.discriminator }}</span>
      </div>
      <div>
        <v-tooltip v-for="badge in user.botBadges" content-class="tooltip" location="top" color="black">
          <template v-slot:activator="{ props }">
            <img :src="require(`@/assets/badges/${badge}.png`)" class="user-badge" v-bind="props" alt="">
          </template>
          <span>{{ $t(`Me.badges.${badge}`) }}</span>
        </v-tooltip>
      </div>
      <v-btn class="user-action" color="red" :loading="loggingOut" variant="outlined" size="large" @click="logout">
        <v-icon class="logout-icon">logout</v-icon> {{ $t('Me.logout') }}
      </v-btn>
      <v-btn class="user-action" :disabled="loadingGuilds" color="blue-grey" variant="outlined" size="large"
             @click="loadGuilds(true)">
        <v-icon large>refresh</v-icon>
      </v-btn>
      <div class="guilds">
        <v-progress-circular v-if="loadingGuilds" :size="60" :width="5" indeterminate/>
        <v-select v-if="!loadingGuilds" class="show-select item-center" :items="showItems" v-model="leaders"
                  :label="$t('Me.show')" color="primary"/>
        <div v-if="guilds.filter(guild => guild.manageable || (leaders && guild.invited)).length <= 0 && !loadingGuilds"
             class="noGuilds">¯\_(ツ)_/¯</div>
        <div class="guilds-container">
          <div class="guild" v-for="guild in guilds.filter(g => g.manageable || (leaders && g.invited))">
            <div>
              <span>
                <img :src="guild.icon ?? 'https://media.discordapp.net/attachments/708680940385337386' +
                '/1077567295251038248/5.png?width=663&height=663'" class="guild-icon" alt="Icon">
              </span>
              {{ guild.name.length <= 25 ? guild.name : guild.name.slice(0, 25) + '...' }}
            </div>
            <div>
              <v-divider class="guild-divider"></v-divider>
              <div class="guild-buttons">
                <v-btn v-if="!guild.invited && guild.manageable" class="action-button" color="blue"
                       variant="outlined" :href="generateInvite(guild.id)">{{ $t('Me.invite') }}
                </v-btn>
                <v-btn v-if="guild.invited && guild.manageable" class="action-button" color="blue-grey lighten-1"
                       variant="outlined" :to="`/server/${guild.id}/general`">{{ $t('Me.settings') }}
                </v-btn>
                <v-btn v-if="leaders && guild.invited" class="action-button" color="warning"
                       variant="outlined" :to="`/leaderboard/${guild.id}`">{{ $t('Me.leaders') }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import Oauth2 from "@/utils/Oauth2";
import config from "@/config.json"
import i18n from "@/plugins/i18n";

if(!localStorage.getItem('token')) window.location.replace('/');

const store = useStore();
const showItems = computed(() => [
  {title: i18n.global.t('Me.settings'), value: false},
  {title: i18n.global.t('Me.leaders'), value: true}
]);
let leaders = ref(false);
let loggingOut = ref(false);
let loadingGuilds = ref(true);

let user = computed(() => {
  document.title = store.getters.user.username ?? '';
  return store.getters.user;
})
let guilds = computed(() => store.getters.guilds)

function generateInvite(guildID: string) {
  return `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&response_type=code` +
      `&permissions=1515519995134&redirect_uri=${encodeURIComponent(window.location.origin + '/landing')}` +
      `&guild_id=${guildID}&scope=bot`
}

async function loadGuilds(reload?: boolean) {
  if(reload) store.state.guilds = [];
  if(!guilds.value.length) loadingGuilds.value = true;
  await store.dispatch('getGuilds')
  loadingGuilds.value = false;
}

async function logout() {
  loggingOut.value = true;
  let response = await Oauth2.revokeToken(localStorage.getItem('token') as string);
  if(!response) return;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  window.location.replace('/');
}

onMounted(async () => {
  await store.dispatch('getUserBadges');
  await loadGuilds();
})
</script>

<style scoped>
.user-avatar {
  max-width: 200px;
  max-height: 200px;
  border-radius: 50%;
}

.user-tag {
  font-size: 2em;
}

.username {
  word-break: break-all;

}

.discriminator {
  color: rgb(var(--v-theme-description));
  opacity: 0.7;
}

.user-badge {
  width: 40px;
  height: 40px;
  margin-right: 3px;
  cursor: pointer;
}

.user-action {
  font-size: 1.4em;
  margin: 5px;
}

.logout-icon {
  margin-right: 8px;
}

.noGuilds {
  font-size: 1.4em;
}

.guilds {
  margin-top: 15px;
}

.guilds-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.guild {
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 3px rgb(var(--v-theme-shadow));
  padding: 20px 20px 5px 20px;
  font-size: 1.5em;
  margin: 5px;
  border-radius: 10px;
  flex-basis: 400px;
  word-break: break-all;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  transition-duration: 200ms;
}

.guild:hover {
  box-shadow: 0 0 10px rgb(var(--v-theme-shadow));
  transition-duration: 200ms;
}

.guild-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  vertical-align: middle;
}

.guild-divider {
  margin-top: 8px;
}

.guild-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 8px;
}

.action-button {
  margin-bottom: 6px;
}
.show-select {
  width: 300px;
  margin: 0 10px 0 10px;
}
</style>