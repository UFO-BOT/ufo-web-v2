<template>
  <div>
    <div class="automods">
      <div>
        <div v-for="(automod, name) in autoModeration" class="automod">
          <div class="automod-name text-truncate">{{ $t(`GuildModeration.autoModeration.${name}.name`) }}</div>
          <div class="automod-actions">
            <v-switch v-model="automod.enabled" class="automod-enable" color="primary" hide-details
                      :disabled="loadingDisable[name]" :loading="loadingDisable[name]" @click="enable(name)"/>
            <v-btn icon variant="text" size="small" :disabled="!automod.enabled" @click="dialogs[name] = true">
              <v-icon size="25">settings</v-icon>
            </v-btn>
          </div>
          <v-dialog v-model="dialogs[name]" fullscreen>
            <v-card color="modal">
              <v-toolbar dark color="primary">
                <v-btn icon="close" :disabled="loading[name]" @click="dialogs[name] = false"/>
                <v-toolbar-title>{{ $t(`GuildModeration.autoModeration.${name}.name`) }}</v-toolbar-title>
                <v-spacer/>
                <v-toolbar-items>
                  <v-btn dark text :disabled="valid[name] === false" :loading="loading[name]" @click="submitAutomod(name)">
                    <v-icon class="btn-icon" size="large">save</v-icon>
                    {{ $t('GuildModeration.submit') }}
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <div class="automod-settings">
                <v-form v-model="valid[name]">
                  <TemplateCompilationError v-if="templateCompilationErrors[name]" class="error"/>
                  <v-alert class="alert mb-2" color="alert" border="start"
                           :title="$t('GuildModeration.subtitles.description')" variant="tonal">
                    {{ $t(`GuildModeration.autoModeration.${name}.description`) }}
                  </v-alert>
                  <div class="subtitle">{{ $t('GuildModeration.subtitles.options') }}</div>
                  <v-checkbox v-model="automod.deleteMessages" color="primary" density="comfortable" hide-details
                              :label="$t('GuildModeration.subtitles.deleteMessages')"/>
                  <AutoModInvitesOptions v-if="name === 'invites'" v-model="automod.options"/>
                  <AutoModFloodOptions v-if="name === 'flood'" v-model="automod.options"/>
                  <div class="subtitle">{{ $t('GuildModeration.subtitles.actions') }}</div>
                  <v-switch v-model="automod.message.enabled" class="fit-content" color="primary" hide-details
                            density="compact" :label="$t('GuildModeration.subtitles.message')"/>
                  <v-expand-transition>
                    <div v-if="automod.message.enabled">
                      <v-checkbox v-model="certainChannels[name]" :label="$t('GuildModeration.subtitles.selectChannel')"
                                  hide-details density="comfortable" color="primary" @change="certainChannelChange(name)"/>
                      <v-expand-transition>
                        <v-select v-if="certainChannels[name]" v-model="automod.message.channel" class="item-select"
                                  color="primary" :items="channels" :label="$t('GuildModeration.subtitles.channel')"/>
                      </v-expand-transition>
                      <TemplateInput v-model="automod.message.template" :variables="['member', 'guild', 'channel']"
                                     :counter="1500"/>
                    </div>
                  </v-expand-transition>
                  <v-switch v-model="automod.punishment.enabled" class="fit-content" color="primary" hide-details
                            density="compact" :label="$t('GuildModeration.subtitles.punishMember')"/>
                  <v-expand-transition>
                    <div v-if="automod.punishment.enabled">
                      <div class="punishment">
                        <div class="item-select">
                          <v-select v-model="automod.punishment.type" color="primary" :items="punishments"
                                    :label="$t('GuildModeration.subtitles.punishment')"/>
                        </div>
                        <DurationPicker v-if="['mute', 'ban'].includes(automod.punishment.type)" :limit="315360000000"
                                        v-model="automod.punishment.duration" class="punishment-duration"/>
                      </div>
                      <v-text-field v-model="automod.punishment.reason" class="general-item-field" color="primary"
                                    counter="512" :rules="reasonRules" :label="$t('GuildModeration.subtitles.reason')"/>
                    </div>
                  </v-expand-transition>
                  <div class="subtitle">{{ $t('GuildModeration.subtitles.whitelist') }}</div>
                  <v-select v-model="automod.whitelist.roles" class="role-select mt-1" color="primary"
                            :items="whitelistRoles" multiple chips closable-chips
                            :label="$t('GuildModeration.subtitles.allowedRoles')"/>
                  <v-select v-model="automod.whitelist.channels" class="role-select mt-1" color="primary"
                            :items="whitelistChannels" multiple chips closable-chips
                            :label="$t('GuildModeration.subtitles.allowedChannels')"/>
                </v-form>
              </div>
            </v-card>
          </v-dialog>
          <v-divider v-if="Object.keys(autoModeration).indexOf(name) < Object.keys(autoModeration).length-1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, Reactive, reactive, Ref, ref} from "vue";
import {GuildAutoModeration} from "@/types/GuildSettings";
import {Role} from "@/types/Role";
import i18n from "@/plugins/i18n";
import {useRoute} from "vue-router";
import DurationPicker from "@/components/DurationPicker.vue";
import SelectItems from "@/utils/SelectItems";
import {Channel} from "@/types/Channel";
import config from "@/config.json";
import AutoModInvitesOptions from "@/components/automod/options/AutoModInvitesOptions.vue";
import AutoModFloodOptions from "@/components/automod/options/AutoModFloodOptions.vue";
import TemplateInput from "@/components/TemplateInput.vue";
import TemplateCompilationError from "@/components/TemplateCompilationError.vue";

const props = defineProps<{autoModeration: GuildAutoModeration, roles: Array<Role>, channels: Array<Channel>}>()
const emit = defineEmits(['update'])
const route = useRoute()
let autoModeration = props.autoModeration
let channels = SelectItems.channels(props.channels, false)
let whitelistRoles = SelectItems.roles(props.roles, false, false)
let whitelistChannels = SelectItems.channels(props.channels, false, false)
let dialogs: Reactive<Record<string, boolean>> = reactive({})
let valid: Reactive<Record<string, boolean>> = reactive({})
let loadingDisable: Reactive<Record<string, boolean>> = reactive({})
let loading: Reactive<Record<string, boolean>> = reactive({})
let certainChannels: Reactive<Record<string, boolean>> = reactive({})
let templateCompilationErrors: Reactive<Record<string, boolean>> = reactive({})
let punishments = computed(() => [
  {title: i18n.global.t('GuildModeration.punishments.warn'), value: 'warn'},
  {title: i18n.global.t('GuildModeration.punishments.mute'), value: 'mute'},
  {title: i18n.global.t('GuildModeration.punishments.kick'), value: 'kick'},
  {title: i18n.global.t('GuildModeration.punishments.ban'), value: 'ban'}
])

const reasonRules = [
  (reason: string) => (reason.length <= 512) || i18n.global.t('GuildModeration.errors.reasonLength')
]

for (let name of Object.keys(autoModeration)) {
  let automod = autoModeration[name as keyof typeof autoModeration]
  if (!automod.message?.enabled) automod.message = {enabled: false, channel: null, template: ''}
  if (!automod.punishment?.enabled) automod.punishment = {enabled: false, type: "warn", duration: 0, reason: ''}
  certainChannels[name] = Boolean(automod.message?.channel)
}

function certainChannelChange(name: string) {
  if (!certainChannels[name]) autoModeration[name as keyof typeof autoModeration].message!.channel = null
}

async function enable(name: string) {
  let automod = autoModeration[name as keyof typeof autoModeration]
  if(!automod.enabled) {
    automod.deleteMessages = true
    automod.options = {whitelistGuilds: [], messages: 20, symbols: 3000}
    automod.message = {enabled: false, channel: null, template: ''}
    automod.punishment = {enabled: false, type: 'warn', duration: 0, reason: ''}
    automod.whitelist = {roles: [], channels: []}
    dialogs[name] = true
  }
  else {
    loadingDisable[name] = true
    automod.enabled = false
    let response = await fetch(`${config.API}/private/guilds/${route.params.id}/automod/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') as string
      },
      body: JSON.stringify(automod)
    })
    loadingDisable[name] = false
    if (response.ok) emit('update', 'success', autoModeration)
    else emit('update', 'error')
  }
}

async function submitAutomod(name: string) {
  templateCompilationErrors[name] = false;
  loading[name] = true;
  let automod = autoModeration[name as keyof typeof autoModeration]
  if (!automod.message?.template?.length) automod.message!.enabled = false
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/automod/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify(automod)
  })
  let body = await response.json()
  templateCompilationErrors[name] = body.message === "Template compilation error"
  loading[name] = false;
  if (response.ok) {
    dialogs[name] = false;
    emit('update', 'success', autoModeration)
  }
  else emit('update', 'error', autoModeration)
}
</script>

<style scoped>
.automods {
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 5px rgb(var(--v-theme-shadow));
  padding: 10px 15px 10px 15px;
  margin-bottom: 15px;
  width: 95%;
  margin-top: 5px;
}

.automod {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 6px;
}

.automod-name {
  font-size: 1.5em;
  align-self: center;
}

.automod-actions {
  display: flex;
  align-items: center;
}

.automod-enable {
  margin-right: 5px;
}

.automod-settings {
  padding: 15px;
}

.btn-icon {
  margin-right: 5px;
}

.error {
  margin-bottom: 10px;
}

.alert {
  text-align: justify;
}

.punishment {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 5px;
}

.item-select {
  width: 250px;
  margin-right: 15px;
}

.punishment-duration {
  margin-bottom: 15px;
}

.subtitle {
  font-size: 1.2em;
  margin-top: 5px;
  margin-bottom: 3px;
}
</style>