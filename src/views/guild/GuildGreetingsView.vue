<template>
  <v-form v-model="valid">
    <TemplateCompilationError v-if="templateCompilationError" class="error"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.joinMessage') }}</div>
    <v-switch v-model="settings.greetings.join.enabled" class="fit-content" color="primary" hide-details
              :label="$t(`GuildGreetings.subtitles.enabled`)"/>
    <v-select v-model="settings.greetings.join.channel" class="channel-select" color="primary"
              :rules="joinRules" :disabled="!settings.greetings.join.enabled" :items="channels"
              :label="$t(`GuildGreetings.subtitles.channel`)"/>
    <TemplateInput v-model="settings.greetings.join.message" class="template" :variables="['member', 'guild']"
                   :disabled="!settings.greetings.join.enabled" :counter="1500"/>
    <EmbedInput v-model="settings.greetings.join.embed" class="embed" :disabled="!settings.greetings.join.enabled"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.leaveMessage') }}</div>
    <v-switch v-model="settings.greetings.leave.enabled" class="fit-content" color="primary" hide-details
              :label="$t(`GuildGreetings.subtitles.enabled`)"/>
    <v-select v-model="settings.greetings.leave.channel" class="channel-select" color="primary"
              :rules="joinRules" :disabled="!settings.greetings.leave.enabled" :items="channels"
              :label="$t(`GuildGreetings.subtitles.channel`)"/>
    <TemplateInput v-model="settings.greetings.leave.message" class="template" :variables="['member', 'guild']"
                   :disabled="!settings.greetings.leave.enabled" :counter="1500"/>
    <EmbedInput v-model="settings.greetings.leave.embed" class="embed" :disabled="!settings.greetings.leave.enabled"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.joinDM') }}</div>
    <v-switch v-model="settings.greetings.dm.enabled" class="fit-content" color="primary" hide-details
              :label="$t(`GuildGreetings.subtitles.enabled`)"/>
    <TemplateInput v-model="settings.greetings.dm.message" class="template" :variables="['member', 'guild']"
                   :disabled="!settings.greetings.dm.enabled" :counter="1500"/>
    <EmbedInput v-model="settings.greetings.dm.embed" class="embed" :disabled="!settings.greetings.dm.enabled"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.joinRoles') }}</div>
    <v-select v-model="settings.greetings.joinRoles" class="roles-select"
              :label="$t('GuildGreetings.subtitles.selectRoles')"
              color="primary" persistent-hint multiple chips closable-chips
              :items="roles"/>
    <div class="subtitle-1">{{ $t('GuildGreetings.subtitles.tests') }}</div>
    <v-alert v-if="settings.useTimeout" class="alert" border="start" color="alert"
             :title="$t('GuildGreetings.subtitles.testsTitle')" variant="tonal">
      {{ $t('GuildGreetings.subtitles.testsDescription') }}
    </v-alert>
    <div class="test-buttons">
      <v-btn class="test-button" color="primary" variant="tonal" :loading="tests['join']" prepend-icon="person_add"
             @click="test('join')">
        {{ $t('GuildGreetings.subtitles.joinTest') }}
      </v-btn>
      <v-btn class="test-button" color="primary" variant="tonal" :loading="tests['leave']" prepend-icon="person_remove"
             @click="test('leave')">
        {{ $t('GuildGreetings.subtitles.leaveTest') }}
      </v-btn>
    </div>
    <v-snackbar v-model="testSnackbar" color="block">
      <div class="test-result">
        {{ testSuccess ? $t('GuildGreetings.subtitles.testCompleted') : $t('GuildGreetings.subtitles.testError') }}
      </div>
      <template v-slot:actions>
        <v-btn :color="testSuccess ? 'green' : 'pink'" variant="text" ripple @click="testSnackbar = false">
          {{ $t('GuildGreetings.subtitles.close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-btn class="submit" :disabled="valid === false" :loading="submitting" size="large" color="secondary"
           @click="submit">
      <v-icon class="save-icon">save</v-icon>
      {{ $t('GuildEconomy.submit') }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import SelectItems from "@/utils/SelectItems";
import {computed, Reactive, reactive, ref} from "vue";
import {Guild} from "@/types/Guild";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {GuildSettings} from "@/types/GuildSettings";
import config from "@/config.json";
import TemplateInput from "@/components/TemplateInput.vue";
import TemplateCompilationError from "@/components/TemplateCompilationError.vue";
import EmbedInput from "@/components/EmbedInput.vue";
import {Embed} from "@/types/Embed";

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!, false)
let channels = SelectItems.channels(guild.value!.channels!, false)
let settings: Reactive<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);
let templateCompilationError = ref(false);
let tests: Reactive<Record<string, boolean>> = reactive({});
let testSnackbar = ref(false);
let testSuccess = ref(true);
const joinRules = [
  (channel: string) => (!!channel || '')
]

let embed: Embed = {enabled: false}
if (!settings.greetings.join?.enabled) settings.greetings.join = {enabled: false, message: '', embed}
if (!settings.greetings.leave?.enabled) settings.greetings.leave = {enabled: false, message: '', embed}
if (!settings.greetings.dm?.enabled) settings.greetings.dm = {enabled: false, message: '', embed}
if (!settings.greetings.joinRoles) settings.greetings.joinRoles = []

async function submit() {
  templateCompilationError.value = false;
  submitting.value = true;
  if (!settings.greetings.join.channel ||
      (!settings.greetings.join.message?.trim()?.length && !settings.greetings.join.embed?.enabled))
    settings.greetings.join.enabled = false;
  if (!settings.greetings.leave.channel ||
      (!settings.greetings.leave.message?.trim()?.length && !settings.greetings.leave.embed?.enabled))
    settings.greetings.leave.enabled = false;
  if (!settings.greetings.dm.message?.trim()?.length && !settings.greetings.dm.embed?.enabled)
    settings.greetings.dm.enabled = false;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/greetings`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify(settings.greetings)
      })
  let body = await response.json()
  templateCompilationError.value = body.message === "Template compilation error"
  if (response.ok) emit('submitted', 'success', settings)
  else emit('submitted', 'error')
  submitting.value = false;
}

async function test(type: 'join' | 'leave') {
  tests[type] = true
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/tests/greetings`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({type})
      })
  tests[type] = false
  testSuccess.value = response.ok
  testSnackbar.value = true
}
</script>

<style scoped>
.error {
  margin-bottom: 10px;
  width: 90%;
}

.subtitle-1 {
  font-size: 1.2em;
}

.channel-select {
  max-width: 250px;
}

.template {
  width: 95%;
}

.embed {
  margin-bottom: 15px;
}

.roles-select {
  margin-top: 10px;
  width: 95%;
}

.alert {
  text-align: justify;
  width: 95%;
  margin-top: 5px;
}

.test-buttons {
  margin-top: 15px;
}

.test-button {
  margin-right: 15px;
  margin-bottom: 10px;
}

.test-result {
  font-size: 1.4em;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>