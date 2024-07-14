<template>
  <div class="guild-content">
    <v-list class="guild-menu" color="primary" bg-color="mobileNav" elevation="5">
      <v-list-subheader v-if="!guild" class="guild-name">{{ $t('Guild.loading') }}</v-list-subheader>
      <v-list-subheader v-else class="guild-name text-truncate">{{ guild.name }}</v-list-subheader>
      <v-divider/>
      <v-item-group>
        <v-list-item v-for="link in $tm('Guild.links')" :to="$rt(link.path)" :prepend-icon="$rt(link.icon)"
                     min-height="55">
          {{ $rt(link.name) }}
        </v-list-item>
        <v-divider v-if="guild?.settings?.boost"/>
        <v-list-item v-if="guild?.settings?.boost" :prepend-icon="$t('Guild.boost.icon')"
                     :to="$t('Guild.boost.path')" min-height="55">
          {{ $t('Guild.boost.name') }}
        </v-list-item>
      </v-item-group>
    </v-list>
    <v-window class="guild-settings">
      <div class="settings">
        <router-view v-slot="{ Component }">
          <v-scroll-y-transition :duration="100">
            <v-progress-circular v-if="!guild?.settings" class="item-center" :size="60" :width="5" indeterminate/>
            <component v-else :is="Component" :settings="guild.settings" @submitted="submitted"/>
          </v-scroll-y-transition>
        </router-view>
        <v-snackbar v-model="snackbar" color="block">
          <div class="result-text">{{ success ? $t('Guild.submitted') : $t('Guild.error') }}</div>
          <template v-slot:actions>
            <v-btn :color="success ? 'green' : 'pink'" variant="text" ripple @click="snackbar = false">
              {{ $t('Guild.close') }}
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {SubmitResult} from "@/types/SubmitResult";
import {Guild} from "@/types/Guild";
import {GuildSettings} from "@/types/GuildSettings";

const store = useStore();
const route = useRoute();
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let snackbar = ref(false)
let success = ref(true)

onMounted(async () => {
  if (!guild.value?.settings) await store.dispatch('getGuild', route.params.id)
})

async function submitted(result: SubmitResult, settings?: GuildSettings) {
  success.value = result === 'success';
  if (result === 'success') await store.dispatch('updateSettings', {id: route.params.id, settings})
  snackbar.value = true;
}
</script>

<style scoped>
.guild-name {
  font-size: 1.2em !important;
  padding: 5px 5px 5px 15px;
  margin-bottom: 8px;
}

@media screen and (min-width: 900px) {
  .guild-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .guild-menu {
    width: 250px;
  }

  .guild-settings {
    width: calc(100% - 250px);
  }

}

.result-text {
  font-size: 1.4em;
}

.settings {
  padding: 20px 0 0 20px;
}
</style>