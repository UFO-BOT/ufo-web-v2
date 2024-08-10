<template>
  <div>
    <v-btn v-if="props.job" icon variant="text" size="small" @click="dialog = true">
      <v-icon size="25">settings</v-icon>
    </v-btn>
    <v-btn v-else color="primary" variant="outlined" @click="dialog = true">
      <v-icon class="btn-icon" size="25">add</v-icon>
      {{ $t('CustomJobs.subtitles.create') }}
    </v-btn>
    <v-dialog v-model="dialog" fullscreen>
      <v-card color="modal">
        <v-toolbar dark :color="props.job ? 'secondary' : 'primary'">
          <v-btn icon :disabled="loading" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ props.job ? job.name : $t('CustomJobs.subtitles.createItem') }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn dark text :disabled="valid === false || !job.newName.length" :loading="loading" @click="saveJob">
              <v-icon class="btn-icon" size="large">save</v-icon>
              {{ $t('CustomJobs.subtitles.submit') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="job-settings">
          <v-form v-model="valid">
            <div class="subtitle">{{ $t('CustomJobs.subtitles.general') }}</div>
            <v-text-field v-model="job.newName" class="general-job-field" :color="props.job ? '' : 'primary'"
                          counter="50" :rules="nameRules" :label="$t('CustomJobs.subtitles.name')"/>
            <v-textarea v-model="job.description" :color="props.job ? '' : 'primary'" color="primary" :counter="1000"
                        :rules="descriptionRules" :label="$t('CustomJobs.subtitles.description')"/>
            <div class="subtitle">{{ $t('CustomJobs.subtitles.message') }}</div>
            <TemplateInput v-model="job.message" :variables="['member', 'guild', 'work']" :counter="1500"
                           :hint="$t('CustomJobs.subtitles.messageHint')" :color="props.job ? '' : 'primary'"/>
            <div v-if="!guild.settings.boost" class="subtitle-description">
              <router-link class="donate-link" to="/donate">
                <v-icon size="small">favorite</v-icon>
                {{ $t('CustomJobs.subtitles.donate') }}
              </router-link>
              {{ $t('CustomJobs.subtitles.iconDescription') }}
            </div>
            <v-text-field v-model="job.iconUrl" class="general-job-field" prepend-inner-icon="art_track"
                          :disabled="!guild.settings.boost" :rules="iconRules" :color="props.job ? '' : 'primary'"
                          :label="$t('CustomJobs.subtitles.iconUrl')"/>
            <div class="subtitle">{{ $t('CustomJobs.subtitles.hideOptions') }}</div>
            <div class="subtitle-description">{{ $t('CustomJobs.subtitles.hideOptionsDescription') }}</div>
            <v-checkbox v-model="job.hideOptions" :label="$t('CustomJobs.subtitles.hide')"
                        :color="props.job ? '' : 'primary'" hide-details/>
            <div class="subtitle subtitle-salary">{{ $t('CustomJobs.subtitles.salary') }}</div>
            <v-tooltip location="top" width="300px" open-on-click>
              {{ $t('CustomJobs.subtitles.salaryDescription') }}
              <template v-slot:activator="{ props }">
                <v-btn class="salary-icon" icon="help_outline" variant="text" density="comfortable" v-bind="props"/>
              </template>
            </v-tooltip>
            <div class="job-flex">
              <div>
                <v-text-field v-model="job.salary.min" class="number-input" :color="props.job ? '' : 'primary'"
                              :rules="integerRules" type="number" :label="$t('CustomJobs.subtitles.minimum')"/>
              </div>
              <div>
                <v-text-field v-model="job.salary.max" class="number-input" :color="props.job ? '' : 'primary'"
                              :rules="integerRules" type="number" :label="$t('CustomJobs.subtitles.maximum')"/>
              </div>
            </div>
            <div class="subtitle">{{ $t('CustomJobs.subtitles.values') }}</div>
            <div class="job-flex">
              <DurationPicker v-model="job.cooldown" :title="$t('CustomJobs.subtitles.cooldown')"/>
              <div>
                <v-text-field v-model="job.requiredXp" class="number-input" :color="props.job ? '' : 'primary'"
                              :rules="integerRules" type="number" :label="$t('CustomJobs.subtitles.requiredXp')"/>
              </div>
            </div>
            <v-select v-model="job.requiredRoles" :color="props.job ? '' : 'primary'" :items="requiredRoles" multiple
                      chips closable-chips :label="$t('CustomJobs.subtitles.requiredRoles')"/>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import config from "@/config.json";
import {Guild} from "@/types/Guild";
import SelectItems from "@/utils/SelectItems";
import i18n from "@/plugins/i18n";
import {CustomJob} from "@/types/CustomJob";
import TemplateInput from "@/components/TemplateInput.vue";
import DurationPicker from "@/components/DurationPicker.vue";

const props = defineProps<{names: Array<string>, job?: CustomJob}>()
const emit = defineEmits(['create'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let requiredRoles = SelectItems.roles(guild.value!.roles!, false, false)
let dialog = ref(false)
let valid = ref(true)
let loading = ref(false)
let job = props.job ? reactive(props.job) : {} as CustomJob

function isUrl(str: string): boolean {
  try {
    let url = new URL(str)
    return url.protocol == 'http:' || url.protocol == 'https:'
  }
  catch (e) {
    return false
  }
}

const integerRules = [
  (number: number) => !(number % 1) || i18n.global.t('CustomJobs.errors.invNumber')
]
const nameRules = [
  (name: string) => (name.length > 0 && name.length <= 50) || i18n.global.t('CustomJobs.errors.invJobName'),
  (name: string) => (!props.names.includes(name) || name === job.name) || i18n.global.t('CustomJobs.errors.alreadyExists')
]
const descriptionRules = [
  (description: string) => (description.length <= 1000) || i18n.global.t('CustomJobs.errors.invJobDescription')
]
const iconRules = [
  (icon: string) => ((!icon.length || isUrl(icon)) || i18n.global.t('CustomJobs.errors.invUrl'))
]

function createJob() {
  job = reactive({
    name: '',
    newName: '',
    description: '',
    message: '',
    hideOptions: false,
    iconUrl: '',
    salary: {min: 0, max: 0},
    cooldown: 0,
    requiredXp: 0,
    requiredRoles: []
  })
}
if(!props.job) createJob()
else job.newName = job.name

async function saveJob() {
  loading.value = true;
  let name = props.job ? `/${job.name}` : ''
  let newJob = {...job}
  newJob.name = newJob.newName!
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/custom-jobs${name}`, {
    method: props.job ?  'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify(newJob)
  })
  if (response.ok) {
    dialog.value = false;
    Object.assign(job, newJob)
    emit('create', job);
    if (!props.job) createJob()
  }
  loading.value = false;
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
  margin-bottom: 8px;
}

.number-input {
  width: 150px;
  display: block;
}

.job-settings {
  padding: 15px;
}

.general-job-field {
  padding-top: 7px !important;
}

.donate-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition-duration: 200ms;
}

.donate-link:active {
  opacity: 0.7;
  transition-duration: 200ms;
}

.subtitle-description {
  color: rgb(var(--v-theme-description));
}

.subtitle-salary {
  display: inline-block;
  margin-bottom: 15px;
}

.salary-icon {
  margin-left: 5px;
}

.job-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.btn-icon {
  margin-right: 5px;
}
</style>