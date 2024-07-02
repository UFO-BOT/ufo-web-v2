<template>
  <div>
    <div class="command-actions">
      <v-switch v-model="command.enabled" class="command-enable" color="primary" :loading="loading"
                :disabled="loading" hide-details @change="submit"/>
      <v-btn icon variant="text" size="small" :disabled="!command.enabled || loading" @click="dialog = !dialog">
        <v-icon size="25">settings</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" fullscreen>
      <v-card color="modal">
        <v-toolbar dark color="primary">
          <v-btn icon :disabled="loading" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ props.name }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn dark text :loading="loading" @click="submit">
              <v-icon class="btn-icon" size="large">save</v-icon>
              {{ $t('GuildModeration.submit') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="command-settings">
          <v-form>
            <div class="subtitle">{{ $t('GuildCommands.subtitles.general') }}</div>
            <v-checkbox v-model="command.deleteUsage" color="primary" hide-details
                        :label="$t('GuildCommands.subtitles.deleteUsage')"/>
            <div class="subtitle">{{ $t('GuildCommands.subtitles.permissions') }}</div>
            <v-select v-for="perm in permsList" v-model="command[perm]" class="perms-select mb-2"
                      multiple chips closable-chips :label="$t(`GuildCommands.permissionsLabel.${perm}`)"
                      :hint="$t(`GuildCommands.permissionsHint.${perm}`)" persistent-hint
                      :items="perm.includes('Roles') ? roles : channels"/>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {CommandSettings} from "@/types/CommandSettings";
import SelectItems from "@/utils/SelectItems";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {Guild} from "@/types/Guild";
import config from "@/config.json";

const props = defineProps<{name: string, command: CommandSettings}>()
const emit = defineEmits(['update'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!, false, false)
let channels = SelectItems.channels(guild.value!.channels!, false, false)
let permsList = ['allowedRoles', 'forbiddenRoles', 'allowedChannels', 'forbiddenChannels']
let dialog = ref(false)
let loading = ref(false)

async function submit() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/commands/${props.command.name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify(props.command)
  })
  loading.value = false;
  dialog.value = false
  if (response.ok) emit('update', 'success', response.status, props.command)
  else emit('update', 'error', response.status)
}
</script>

<style scoped>
.command-actions {
  display: flex;
  align-items: center;
}

.command-enable {
  margin-right: 5px;
}

.command-settings {
  padding: 15px;
}

.subtitle {
  font-size: 1.2em;
  margin-bottom: 3px;
}
</style>