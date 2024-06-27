<template>
  <div>
    <v-form v-model="valid">
      <div class="subtitle-1">{{ $t('GuildLogs.subtitles.logs') }}</div>
        <v-expansion-panels class="logs" variant="accordion">
          <v-expansion-panel v-for="(category, i) of Object.keys(categories)" bg-color="block">
            <v-expansion-panel-title class="category" ripple>
              <v-icon class="category-icon">{{ icons[i] }}</v-icon>
              {{ $t(`GuildLogs.categories.${category}`) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-for="log in categories[category]">
                <div class="log">
                  <div>{{ $t(`GuildLogs.logs.${log}`) }}</div>
                  <div>
                    <v-select v-model="settings.logs.list[log].channel" :items="channels" color="primary" hide-details
                              :disabled="!settings.logs.list[log].enabled" :label="$t(`GuildLogs.subtitles.channel`)"
                              class="channel-select mr-3"/>
                    <v-switch v-model="settings.logs.list[log].enabled" hide-details color="primary" class="switch"/>
                  </div>
                </div>
                <v-divider v-if="categories[category].indexOf(log) < categories[category].length - 1"/>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      <div class="subtitle-1 mt-3">{{ $t('GuildLogs.subtitles.ignoredChannels') }}</div>
      <v-select v-model="settings.logs.ignore.channels"
                :label="$t('GuildLogs.subtitles.channels')"
                :hint="$t('GuildLogs.subtitles.ignoredChannelsHint')"
                color="primary" persistent-hint multiple chips closable-chips
                :items="ignoredChannels"
                class="channels-select mt-1 mb-2"/>
      <v-btn class="submit" :disabled="valid === false" :loading="submitting" size="large" color="secondary"
             @click="submit">
        <v-icon class="save-icon">save</v-icon>
        {{ $t('GuildLogs.submit') }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import i18n from "@/plugins/i18n";
import SelectItems from "@/utils/SelectItems";
import {computed, reactive, ref} from "vue";
import {Guild} from "@/types/Guild";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {ReactiveVariable} from "vue/macros";
import {GuildSettings} from "@/types/GuildSettings";
import config from "@/config.json";

document.title = i18n.global.t('GuildLogs.title')

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let channels = SelectItems.channels(guild.value!.channels!, false)
let ignoredChannels = SelectItems.channels(guild.value!.channels!, false, false)
let settings: ReactiveVariable<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);

const categories = {
  messages: ['messageDelete', 'messageEdit', 'messageDeleteBulk'],
  roles: ['roleCreate', 'roleEdit', 'roleDelete'],
  moderation: ['moderationWarn', 'moderationMute', 'moderationKick', 'moderationBan',
    'moderationUnmute', 'moderationUnban']
}
const icons = ['speaker_notes', 'assignment', 'security']

for (let log of Object.values(categories).flat(1)) {
  if (!settings.logs.list[log]?.enabled || !channels.find(ch => ch.value === settings.logs.list[log]?.channel))
    settings.logs.list[log] = {enabled: false, channel: null}
}

async function submit() {
  submitting.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/logs`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify(settings.logs)
      })
  if(response.ok) emit('submitted', 'success', settings)
  else emit('submitted', 'error')
  submitting.value = false;
}
</script>

<style scoped>
.subtitle-1 {
  font-size: 1.2em;
}

.logs {
  width: 95%;
  margin-top: 5px;
}

.log {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  margin-top: 12px;
  margin-bottom: 5px;
  word-break: break-all;
}

.category {
  font-size:  1.5em;
  padding: 26px 26px!important;
}

.category-icon {
  margin-right: 10px;
}

.channel-select {
  width: 180px;
  display: inline-block;
}

.channels-select {
  width: 95%;
}

.switch {
  display: inline-block;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>