<template>
  <div>
    <v-btn icon variant="text" size="40" @click="dialog = true">
      <v-icon color="red">delete</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="500px">
      <v-card color="modal">
        <v-card-title class="modal-header">{{ $t('LeaderboardMember.deleteMember') }}</v-card-title>
        <v-card-text
            v-html="$t('LeaderboardMember.deleteConfirm').replace('[M]',
            `<code>${member.user.tag}</code>`)">
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="submit" :loading="loading" text>
            {{ $t('LeaderboardMember.delete') }}
          </v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ $t('LeaderboardMember.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import {LeaderboardMember} from "@/types/LeaderboardMember";
import {useRoute} from "vue-router";
import config from "@/config.json";
import i18n from "@/plugins/i18n";

const props = defineProps<{member: LeaderboardMember}>()
const emit = defineEmits(['delete'])
const route = useRoute()
let dialog = ref(false)
let loading = ref(false)

document.title = i18n.global.t('LeaderboardMember.title')

async function submit() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/balances/${props.member.user.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('token') as string
    }
  })
  if(response.ok) {
    dialog.value = false;
    emit('delete')
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