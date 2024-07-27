<template>
  <div>
    <div class="jobs">
      <div v-if="jobs.length" v-for="job of jobs" :key="job.name">
        <div class="job">
          <div class="job-name text-truncate">{{ job.name }}</div>
          <div>
            <CustomJobsEditor :job="job" :names="jobs.map(i => i.name)" class="job-action"/>
            <DeleteCustomJob :job="job" class="job-action" @delete="deleted"/>
          </div>
        </div>
        <v-divider/>
      </div>
      <div class="jobs-bottom">
        <div>
          <CustomJobsEditor v-if="jobs.length < lim" :names="jobs.map(i => i.name)"
                      @create="created"/>
          <div v-else>
            <div v-if="guild.settings.boost">{{ $t('CustomJobs.subtitles.limit') }}</div>
            <div v-else class="jobs-limit">
              <router-link class="donate-link" to="/donate">
                <v-icon>favorite</v-icon>
                {{ $t('CustomJobs.subtitles.donate') }}
              </router-link>
              {{ $t('CustomJobs.subtitles.increaseLimit') }} {{ limit.boost }}
            </div>
          </div>
        </div>
        <div class="jobs-count">
          {{ jobs.length }}/{{ lim }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import CustomJobsEditor from "@/components/customJobs/CustomJobsEditor.vue";
import DeleteCustomJob from "@/components/customJobs/DeleteCustomJob.vue";
import {CustomJob} from "@/types/CustomJob";
import {Guild} from "@/types/Guild";

const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let jobs = ref(guild.value.settings?.customJobs ?? [])
let name = ref();

const limit = {
  standard: 5,
  boost: 15
}
let lim = guild.value?.settings?.boost ? limit.boost : limit.standard

function created(job: CustomJob) {
  jobs.value.push(job)
}

function deleted(job: CustomJob) {
  jobs.value.splice(jobs.value.findIndex(i => i.name === job.name), 1)
}
</script>

<style scoped>
.jobs {
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 5px rgb(var(--v-theme-shadow));
  padding: 5px 15px 15px 20px;
  margin-bottom: 15px;
  width: 95%;
  margin-top: 5px;
}

.job {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 8px;
}

.job-name {
  font-size: 1.5em;
  align-self: center;
}

.job-action {
  display: inline;
}

.jobs-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  column-gap: 20px;
}

.jobs-limit {
  font-size: 1.2em;
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

.jobs-count {
  color: rgb(var(--v-theme-description));
  font-size: 1.2em;
}
</style>