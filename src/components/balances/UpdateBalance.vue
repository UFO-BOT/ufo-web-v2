<template>
  <div>
    <v-btn icon variant="text" size="40" @click="dialog = true">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="500px">
      <v-card color="modal">
        <v-card-title class="modal-header">
          <div>{{ props.member.user.tag }}</div>
          <v-btn icon variant="text" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form v-model="valid">
            <v-text-field v-model="updateBalance.balance" class="ma-0 pa-0" color="primary"
                          :label="$t('LeaderboardMember.balance')" :rules="rules" hide-details="auto"/>
            <v-checkbox v-model="updateBalance.resetXP" :label="$t('LeaderboardMember.resetXP')" color="primary"
                        hide-details/>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" text :loading="loading" :disabled="valid === false" @click="submit">
            {{ $t('LeaderboardMember.submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {LeaderboardMember} from "@/types/LeaderboardMember";
import {ReactiveVariable} from "vue/macros";
import {UpdateBalanceForm} from "@/types/UpdateBalanceForm";
import {useRoute} from "vue-router";
import config from "@/config.json";
import i18n from "@/plugins/i18n";

const props = defineProps<{member: LeaderboardMember}>()
const emit = defineEmits(['update'])
const route = useRoute()
let dialog = ref(false)
let valid = ref(true)
let loading = ref(false)
let updateBalance: ReactiveVariable<UpdateBalanceForm> = reactive({balance: props.member.balance, resetXP: false})

const rules = [
  (value: number) => (!isNaN(value) && !(value % 1)) || i18n.global.t('LeaderboardMember.errors.invalidBalance')
]

document.title = i18n.global.t('LeaderboardMember.title')

async function submit() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/balances/${props.member.user.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify({
      balance: updateBalance.balance,
      resetXP: updateBalance.resetXP
    })
  })
  if(response.ok) {
    dialog.value = false;
    emit('update', updateBalance)
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