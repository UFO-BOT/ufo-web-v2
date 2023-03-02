<template>
  <div>
    <v-btn color="red" @click="dialog = true">{{ $t('ResetBalance.reset') }}</v-btn>
    <v-dialog v-model="dialog" width="500px">
      <v-card color="modal">
        <v-card-title class="modal-header">
          <div>{{ $t('ResetBalance.resetBalance') }}</div>
        </v-card-title>
        <v-card-text>
          <div class="attention">{{ $t('ResetBalance.attention') }}</div>
          <div class="confirm">{{ $t('ResetBalance.confirm') }}</div>
          <v-text-field v-model="name" class="mt-3" color="red" :label="$t('ResetBalance.name')"
                        :placeholder="guild.name" variant="outlined"/>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="red" @click="reset" :disabled="name !== guild.name" :loading="loading" text>
            {{ $t('ResetBalance.reset') }}
          </v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ $t('ResetBalance.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import {Guild} from "@/types/Guild";
import config from "@/config.json";

const props = defineProps<{guild: Guild}>()
let guild = props.guild;
let dialog = ref(false)
let loading = ref(false)
let name = ref();

async function reset() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${guild.id}/reset`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('token') as string,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.value,
      scopes: ['balance']
    })
  })
  if(response.ok) dialog.value = false;
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

.attention {
  font-size: 1.1em;
  font-weight: bold;
  color: rgb(var(--v-theme-description));
}

.confirm {
  color: rgb(var(--v-theme-description));
}
</style>