<template>
  <div>
    <v-btn class="create-item-btn" color="primary" variant="outlined" @click="dialog = true">
      <v-icon class="btn-icon" size="25">add</v-icon>
      {{ $t('Items.subtitles.create') }}
    </v-btn>
    <v-dialog v-model="dialog" fullscreen>
      <v-card color="modal">
        <v-toolbar dark color="primary">
          <v-btn icon :disabled="loading" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('Items.subtitles.createItem') }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn dark text :disabled="valid === false || !item.name.length" :loading="loading" @click="createItem">
              <v-icon class="btn-icon" size="large">save</v-icon>
              {{ $t('Items.subtitles.submit') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="item-settings">
          <v-form v-model="valid">
            <div class="subtitle">{{ $t('Items.subtitles.general') }}</div>
            <v-text-field v-model="item.name" class="general-item-field" color="primary" counter="50" :rules="nameRules"
                          :label="$t('Items.subtitles.name')"/>
            <v-textarea v-model="item.description" class="general-item-field" color="primary" counter="200"
                        :rules="descriptionRules" :label="$t('Items.subtitles.description')"/>
            <div class="subtitle">{{ $t('Items.subtitles.values') }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="item.price" class="number-input" color="primary" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.price')"/>
              </div>
              <div>
                <v-text-field v-model="item.xp" class="number-input" color="primary" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.xp')"/>
              </div>
            </div>
            <div class="subtitle">{{ $t('Items.subtitles.roles') }}</div>
            <div class="item-flex">
              <div>
                <v-select v-model="item.addRole" class="role-select" color="primary" :items="roles"
                          :label="$t('Items.subtitles.addRole')"/>
              </div>
              <div>
                <v-select v-model="item.removeRole" class="role-select" color="primary" :items="roles"
                          :label="$t('Items.subtitles.removeRole')"/>
              </div>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, Reactive, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import config from "@/config.json";
import {Item} from "@/types/Item";
import {Guild} from "@/types/Guild";
import SelectItems from "@/utils/SelectItems";
import i18n from "@/plugins/i18n";

const props = defineProps<{names: Array<string>}>()
const emit = defineEmits(['create'])
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!)
let dialog = ref(false)
let valid = ref(true)
let loading = ref(false)
let item: Reactive<Item> = reactive({
  name: '',
  description: '',
  price: 0,
  xp: 0,
  addRole: null,
  removeRole: null
})

const positiveIntegerRules = [
  (number: number) => (number >= 0 && !(number % 1)) || i18n.global.t('Items.errors.invPosNumber')
]
const nameRules = [
  (name: string) => (name.length > 0 && name.length <= 50) || i18n.global.t('Items.errors.invItemName'),
  (name: string) => (!props.names.includes(name)) || i18n.global.t('Items.errors.alreadyExists')
]
const descriptionRules = [
  (description: string) => (description.length <= 200) || i18n.global.t('Items.errors.invItemDescription')
]

async function createItem() {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify(item)
  })
  if (response.ok) {
    dialog.value = false;
    item.newName = item.name;
    emit('create', item);
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
  width: 100px;
  display: inline-block;
  margin-right: 20px;
}

.create-item-btn {
  margin-top: 12px;
}

.item-settings {
  padding: 15px;
}

.general-item-field {
  padding-top: 7px !important;
}

.item-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.role-select {
  width: 180px;
}

.btn-icon {
  margin-right: 5px;
}
</style>