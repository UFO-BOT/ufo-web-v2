<template>
  <div>
    <v-btn icon variant="text" size="small" color="red" @click="dialog = true">
      <v-icon size="25">delete</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="500px">
      <v-card color="modal">
        <v-card-title class="modal-header">{{ $t('CustomJobs.subtitles.deleteItem') }}</v-card-title>
        <v-card-text v-html="$t('CustomJobs.subtitles.deleteConfirm').replace('[J]',
        `<code>${job.name}</code>`)"/>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="red" :loading="loading" text @click="deleteJob">{{ $t('CustomJobs.subtitles.delete') }}</v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ $t('CustomJobs.subtitles.cancel') }}</v-btn>
        </v-card-actions>
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
import {CustomJob} from "@/types/CustomJob";

const props = defineProps<{job: CustomJob}>()
const emit = defineEmits(['delete'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!)
let dialog = ref(false)
let valid = ref(true)
let loading = ref(false)
let job = props.job ? reactive(props.job) : {} as CustomJob

async function deleteJob() {
  loading.value = true;
  let name = encodeURIComponent(job.name)
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/custom-jobs/${name}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify(job)
  })
  if (response.ok) {
    dialog.value = false;
    emit('delete', job);
  }
  loading.value = false;
}
</script>

<style scoped>
.modal-header {
  font-size: 1.4em;
  background-color: rgb(var(--v-theme-modalHeader));
  padding: 15px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>