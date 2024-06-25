<template>
  <div class="center">
    <div class="name">{{ $t('Landing.name') }}</div>
    <v-img src="@/assets/avatar.png" class="avatar item-center" max-width="260px" max-height="260px"></v-img>
    <div class="buttons-container mt-2">
      <v-btn size="x-large" color="primary" class="action-button" to="/commands">
        <v-icon class="button-icon" size="large">list</v-icon>{{ $t('Landing.commands') }}
      </v-btn>
      <v-btn size="x-large" color="info" class="action-button" href="https://discord.gg/qPrqVwR">
        <v-icon class="button-icon" size="large">discord</v-icon>{{ $t('Landing.support') }}
      </v-btn>
    </div>
    <v-btn class="action-button" size="x-large" color="secondary" v-if="guild"
           :to="`/guilds/${$route.query.guild_id}/general`">
      <v-icon class="button-icon" size="large">settings</v-icon>{{ $t('Landing.settings') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import i18n from "@/plugins/i18n";
import {computed, onMounted} from "vue";
import {Guild} from "@/types/Guild";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

const store = useStore();
const route = useRoute();
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.query?.guild_id))

document.title = i18n.global.t('Landing.title')

onMounted(async () => {
  if(route.query?.guild_id) await store.dispatch('getGuild', route.query?.guild_id)
})
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 3em;
}
.avatar {
  border-radius: 50%;
  margin: 10px;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.action-button {
  font-size: 1.3em;
  margin: 10px;
}
.button-icon {
  margin-right: 5px;
}
</style>