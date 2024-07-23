<template>
  <div>
    <v-form v-model="valid">
      <div class="subtitle-1">{{ $t('GuildModeration.subtitles.muteRole') }}</div>
      <v-select v-model="settings.muteRole" class="role-select mt-1" color="primary" :items="roles" hide-details
                :label="$t('GuildModeration.subtitles.selectRole')"/>
      <v-checkbox v-model="settings.useTimeout" class="ma-0 pa-0 fit-content" color="primary" hide-details
                  :label="$t('GuildModeration.subtitles.useTimeout')"/>
      <v-alert v-if="settings.useTimeout" class="alert mb-3" border="start" color="alert"
               :title="$t('GuildModeration.subtitles.timeout')" variant="tonal">
        {{ $t('GuildModeration.subtitles.timeoutDescription') }}
      </v-alert>
      <div class="subtitle-1">{{ $t('GuildModeration.subtitles.autoModeration') }}</div>
      <AutoModeration :auto-moderation="settings.autoModeration" :roles="guild.roles" :channels="guild.channels"
                      @update="automodUpdated"/>
      <div class="subtitle-1">{{ $t('GuildModeration.subtitles.warnsPunishments') }}</div>
      <div class="wp-list">
        <div v-for="(warnsPunishment, i) of settings.warnsPunishments">
          <div class="wp-flex">
            <div class="punishment-title">{{ $t('GuildModeration.subtitles.punishment') }} {{ i + 1 }}</div>
            <v-btn icon variant="text" size="small" @click="settings.warnsPunishments.splice(i, 1)">
              <v-icon size="large" color="red">delete</v-icon>
            </v-btn>
          </div>
          <v-text-field v-model="warnsPunishment.warns" class="warns-count mt-0" color="primary"
                        :rules="warnsRules" :label="$t('GuildModeration.subtitles.warns')"/>
          <div class="punishment">
            <div class="punishment-select">
              <v-select v-model="warnsPunishment.punishment.type" color="primary"
                        :label="$t('GuildModeration.subtitles.punishment')" :items="punishments"/>
            </div>
            <DurationPicker v-if="warnsPunishment.punishment.type !== 'kick'"
                            v-model="warnsPunishment.punishment.duration" class="punishment-duration"
                            :limit="315360000000"/>
          </div>
          <v-divider/>
        </div>
        <v-btn class="wp-add" color="primary" variant="outlined"
               v-if="settings.warnsPunishments?.length < 10"
               @click="settings.warnsPunishments.push({warns: 0, punishment: {type: 'kick', duration: 0}})">
          <v-icon medium class="mr-1">add</v-icon>
          {{ $t('GuildModeration.subtitles.add') }}
        </v-btn>
        <div v-else>{{ $t('GuildModeration.errors.warnsPunishmentsLimit') }}</div>
      </div>
      <BoostAlert v-if="!guild.settings.boost" class="alert" :text="$t('GuildModeration.subtitles.boostDescription')"/>
      <div v-else>
        <div class="subtitle-1">{{ $t('GuildModeration.subtitles.kickMessage') }}</div>
        <v-switch v-model="settings.punishmentMessages.kick.enabled" color="primary" hide-details
                  :label="$t('GuildModeration.subtitles.enabled')"/>
        <TemplateInput v-model="settings.punishmentMessages.kick.message" class="template" :counter="1500"
                       :disabled="!settings.punishmentMessages.kick.enabled"
                       :variables="['member', 'guild', 'moderator', 'punishment']"/>
        <EmbedInput v-model="settings.punishmentMessages.kick.embed" class="embed"
                    :disabled="!settings.punishmentMessages.kick.enabled"
                    :variables="['member', 'guild', 'moderator', 'punishment']"/>
        <div class="subtitle-1">{{ $t('GuildModeration.subtitles.banMessage') }}</div>
        <v-switch v-model="settings.punishmentMessages.ban.enabled" color="primary" hide-details
                  :label="$t('GuildModeration.subtitles.enabled')"/>
        <TemplateInput v-model="settings.punishmentMessages.ban.message" class="template" :counter="1500"
                       :disabled="!settings.punishmentMessages.ban.enabled"
                       :variables="['member', 'guild', 'moderator', 'punishment']"/>
        <EmbedInput v-model="settings.punishmentMessages.ban.embed" class="embed"
                    :disabled="!settings.punishmentMessages.ban.enabled"
                    :variables="['member', 'guild', 'moderator', 'punishment']"/>
        <div class="subtitle-1">{{ $t('GuildModeration.subtitles.tests') }}</div>
        <v-alert v-if="settings.useTimeout" class="alert" border="start" color="alert"
                 :title="$t('GuildModeration.subtitles.testsTitle')" variant="tonal">
          {{ $t('GuildModeration.subtitles.testsDescription') }}
        </v-alert>
        <div class="test-buttons">
          <v-btn class="test-button" color="primary" variant="tonal" :loading="tests.kick" prepend-icon="person_add"
                 @click="test('kick')">
            <v-tooltip v-if="testsThrottle.kick" activator="parent" location="top" open-on-click>
              {{ $t('GuildGreetings.subtitles.throttle') }}
            </v-tooltip>
            {{ $t('GuildModeration.subtitles.kickTest') }}
          </v-btn>
          <v-btn class="test-button" color="primary" variant="tonal" :loading="tests.ban" prepend-icon="person_remove"
                 @click="test('ban')">
            <v-tooltip v-if="testsThrottle.ban" activator="parent" location="top" open-on-click>
              {{ $t('GuildGreetings.subtitles.throttle') }}
            </v-tooltip>
            {{ $t('GuildModeration.subtitles.banTest') }}
          </v-btn>
        </div>
        <v-snackbar v-model="testSnackbar" color="block">
          <div class="test-result">
            {{
              testSuccess ? $t('GuildModeration.subtitles.testCompleted') : $t('GuildModeration.subtitles.testError')
            }}
          </div>
          <template v-slot:actions>
            <v-btn :color="testSuccess ? 'green' : 'pink'" variant="text" ripple @click="testSnackbar = false">
              {{ $t('GuildModeration.subtitles.close') }}
            </v-btn>
          </template>
        </v-snackbar>
      </div>
      <v-btn class="submit" :disabled="valid === false" :loading="submitting" size="large" color="secondary"
             @click="submit">
        <v-icon class="save-icon">save</v-icon>
        {{ $t('GuildEconomy.submit') }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import i18n from "@/plugins/i18n";
import SelectItems from "@/utils/SelectItems";
import {computed, Reactive, reactive, ref} from "vue";
import {Guild} from "@/types/Guild";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {GuildAutoModeration, GuildSettings} from "@/types/GuildSettings";
import config from "@/config.json";
import AutoModeration from "@/components/automod/AutoModeration.vue";
import DurationPicker from "@/components/DurationPicker.vue";
import {SubmitResult} from "@/types/SubmitResult";
import {Command} from "@/types/Command";
import TemplateInput from "@/components/TemplateInput.vue";
import EmbedInput from "@/components/EmbedInput.vue";
import BoostAlert from "@/components/BoostAlert.vue";

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!, false)
let commands = computed(() => (store.getters.commands as Array<Command>));
let settings: Reactive<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);
let punishments = computed(() => [
  {title: i18n.global.t('GuildModeration.punishments.mute'), value: 'mute'},
  {title: i18n.global.t('GuildModeration.punishments.kick'), value: 'kick'},
  {title: i18n.global.t('GuildModeration.punishments.ban'), value: 'ban'}
])
let tests: Reactive<Record<string, boolean>> = reactive({});
let testsThrottle: Reactive<Record<string, boolean>> = reactive({});
let testSnackbar = ref(false);
let testSuccess = ref(true);

const warnsRules = [
  (number: number) => (number > 0 && !(number % 1)) || i18n.global.t('GuildModeration.errors.invalidWarns'),
  (number: number) => (settings.warnsPunishments.filter(wp => wp.warns == number).length <= 1 ||
      i18n.global.t('GuildModeration.errors.duplicateWarns'))
]

function automodUpdated(result: SubmitResult, autoModeration: GuildAutoModeration) {
  if (result === 'success') settings.autoModeration = autoModeration
  emit('submitted', result, settings)
}

async function submit() {
  submitting.value = true;
  if (!settings.punishmentMessages.kick.message?.trim()?.length && !settings.punishmentMessages.kick.embed?.enabled)
    settings.punishmentMessages.kick.enabled = false
  if (!settings.punishmentMessages.ban.message?.trim()?.length && !settings.punishmentMessages.ban.embed?.enabled)
    settings.punishmentMessages.ban.enabled = false
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/moderation`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          muteRole: settings.muteRole,
          useTimeout: settings.useTimeout,
          warnsPunishments: settings.warnsPunishments,
          punishmentMessages: settings.punishmentMessages
        })
      })
  if (response.ok) emit('submitted', 'success', settings)
  else emit('submitted', 'error')
  submitting.value = false;
}

async function test(type: 'kick' | 'ban') {
  if (testsThrottle[type]) return
  tests[type] = true
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/tests/punishments`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({type})
      })
  tests[type] = false
  tests[type] = false
  testsThrottle[type] = true
  setTimeout(() => testsThrottle[type] = false, 10000)
  testSuccess.value = response.ok
  testSnackbar.value = true
}
</script>

<style scoped>
.subtitle-1 {
  font-size: 1.2em;
}

.role-select {
  width: 220px;
}

.wp-list {
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 5px rgb(var(--v-theme-shadow));
  padding: 5px 15px 15px 20px;
  margin-bottom: 20px;
  width: 95%;
  margin-top: 5px;
}

.wp-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 5px;
}

.punishment-title {
  font-size: 1.2em;
  margin-top: 3px;
}

.warns-count {
  width: 95%;
}

.punishment {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 5px;
}

.punishment-select {
  width: 200px;
  margin-right: 15px;
}

.punishment-duration {
  margin-bottom: 15px;
}

.wp-add {
  margin-top: 10px;
}

.template {
  width: 95%;
}

.embed {
  margin-bottom: 15px;
}

.alert {
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