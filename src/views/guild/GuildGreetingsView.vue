<template>
  <v-form v-model="valid">
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.joinMessage') }}</div>
    <v-switch v-model="settings.greetings.join.enabled" class="fit-content" color="primary" hide-details
              :label="$t(`GuildGreetings.subtitles.enabled`)"/>
    <v-select v-model="settings.greetings.join.channel" class="channel-select" color="primary"
              :rules="joinRules" :disabled="!settings.greetings.join.enabled" :items="channels"
              :label="$t(`GuildGreetings.subtitles.channel`)"/>
    <TemplateInput v-model="settings.greetings.join.message" class="template"
                   :disabled="!settings.greetings.join.enabled" :counter="1500"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.leaveMessage') }}</div>
    <v-switch v-model="settings.greetings.leave.enabled" class="fit-content" color="primary" hide-details
              :label="$t(`GuildGreetings.subtitles.enabled`)"/>
    <v-select v-model="settings.greetings.leave.channel" class="channel-select" color="primary"
              :rules="joinRules" :disabled="!settings.greetings.leave.enabled" :items="channels"
              :label="$t(`GuildGreetings.subtitles.channel`)"/>
    <TemplateInput v-model="settings.greetings.leave.message" class="template"
                   :disabled="!settings.greetings.leave.enabled" :counter="1500"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.joinDM') }}</div>
    <v-switch v-model="settings.greetings.dm.enabled" class="fit-content" color="primary" hide-details
              :label="$t(`GuildGreetings.subtitles.enabled`)"/>
    <TemplateInput v-model="settings.greetings.dm.message" class="template"
                   :disabled="!settings.greetings.dm.enabled" :counter="1500"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.joinRoles') }}</div>
    <v-select v-model="settings.greetings.joinRoles" class="roles-select"
              :label="$t('GuildGreetings.subtitles.selectRoles')"
              color="primary" persistent-hint multiple chips closable-chips
              :items="roles"/>
    <v-btn class="submit" :disabled="valid === false" :loading="submitting" size="large" color="secondary"
           @click="submit">
      <v-icon class="save-icon">save</v-icon>
      {{ $t('GuildEconomy.submit') }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import i18n from "@/plugins/i18n";
import SelectItems from "@/utils/SelectItems";
import {computed, reactive, ref} from "vue";
import {Guild} from "@/types/Guild";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {ReactiveVariable} from "vue/macros";
import {GuildAutoModeration, GuildSettings} from "@/types/GuildSettings";
import config from "@/config.json";
import {SubmitResult} from "@/types/SubmitResult";
import TemplateInput from "@/components/TemplateInput.vue";

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!, false)
let channels = SelectItems.channels(guild.value!.channels!, false)
let settings: ReactiveVariable<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);
const joinRules = [
  (channel: string) => (!!channel || '')
]

if (!settings.greetings.join?.enabled) settings.greetings.join = {enabled: false, message: '', embed: {}}
if (!settings.greetings.leave?.enabled) settings.greetings.leave = {enabled: false, message: '', embed: {}}
if (!settings.greetings.dm?.enabled) settings.greetings.dm = {enabled: false, message: '', embed: {}}
if (!settings.greetings.joinRoles) settings.greetings.joinRoles = []

async function submit() {
  submitting.value = true;
  if (!settings.greetings.join.channel || !settings.greetings.join.message?.length)
    settings.greetings.join.enabled = false;
  if (!settings.greetings.leave.channel || !settings.greetings.join.message?.length)
    settings.greetings.leave.enabled = false;
  if (!settings.greetings.dm.message?.length) settings.greetings.dm.enabled = false;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/greetings`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify(settings.greetings)
      })
  if (response.ok) emit('submitted', 'success', settings)
  else emit('submitted', 'error')
  submitting.value = false;
}
</script>

<style scoped>
.subtitle-1 {
  font-size: 1.2em;
}

.channel-select {
  max-width: 250px;
}

.template {
  width: 90%;
}

.roles-select {
  margin-top: 10px;
  width: 90%;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>