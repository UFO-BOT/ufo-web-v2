<template>
  <div>
    <v-form v-model="valid">
      <div class="subtitle-1">{{ $t('GuildModeration.subtitles.muteRole') }}</div>
      <v-select v-model="settings.muteRole" class="role-select mt-1" :items="roles" hide-details
                :label="$t('GuildModeration.subtitles.selectRole')"/>
      <v-checkbox v-model="settings.useTimeout" class="ma-0 pa-0 fit-content" color="primary" hide-details
                  :label="$t('GuildModeration.subtitles.useTimeout')"/>
      <v-alert v-if="settings.useTimeout" class="alert" border="start" color="primary"
               :title="$t('GuildModeration.subtitles.timeout')" variant="tonal" closable>
                {{ $t('GuildModeration.subtitles.timeoutDescription') }}
      </v-alert>
      <br>
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
let roles = SelectItems.roles(guild.value!.roles!, false)
let settings: ReactiveVariable<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);

async function submit() {
  submitting.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/moderation`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          muteRole: settings.muteRole,
          useTimeout: settings.useTimeout
        })
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

.role-select {
  width: 220px;
}

.alert {
  width: 95%;
}
</style>