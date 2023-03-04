<template>
  <div>
    <v-btn icon variant="text" size="small" color="red" @click="dialog = true">
      <v-icon size="25">delete</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="500px">
      <v-card color="modal">
        <v-card-title class="modal-header">{{ $t('Items.subtitles.deleteItem') }}</v-card-title>
        <v-card-text v-html="$t('Items.subtitles.deleteConfirm').replace('[I]',
        `<code>${item.name}</code>`)"/>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="red" :loading="loading" text @click="deleteItem">{{ $t('Items.subtitles.delete') }}</v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ $t('Items.subtitles.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import config from "@/config.json";
import {Item} from "@/types/Item";
import {ReactiveVariable} from "vue/macros";

const props = defineProps<{item: Item}>()
const emit = defineEmits(['delete'])
const route = useRoute()
let dialog = ref(false)
let loading = ref(false)
let item: ReactiveVariable<Item> = reactive(props.item)

async function deleteItem() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/items/${item.name}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('token') as string
    }
  })
  if (response.ok) {
    dialog.value = false;
    emit('delete', item)
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