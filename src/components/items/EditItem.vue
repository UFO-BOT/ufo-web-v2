<template>
  <div>
    <v-btn icon variant="text" size="small" @click="dialog = true">
      <v-icon size="25">settings</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" fullscreen>
      <v-card color="modal">
        <v-toolbar dark color="secondary">
          <v-btn icon :disabled="loading" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ item.name }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn dark text :disabled="valid === false || !item.newName.length" :loading="loading" @click="editItem">
              <v-icon class="btn-icon" size="large">save</v-icon>
              {{ $t('Items.subtitles.submit') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="item-settings">
          <v-form v-model="valid">
            <div class="subtitle">{{ $t('Items.subtitles.general') }}</div>
            <v-text-field v-model="item.newName" class="general-item-field" counter="50"
                          :rules="nameRules" :label="$t('Items.subtitles.name')"/>
            <v-textarea v-model="item.description" class="general-item-field" counter="200"
                        :rules="descriptionRules" :label="$t('Items.subtitles.description')"/>
            <v-text-field v-model="item.thumbnailUrl" class="general-item-field" prepend-inner-icon="art_track"
                        :rules="descriptionRules" :label="$t('Items.subtitles.thumbnailUrl')"/>
            <div class="subtitle">{{ $t('Items.subtitles.values') }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="item.price" class="number-input" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.price')"/>
              </div>
              <div>
                <v-text-field v-model="item.requiredXp" class="number-input" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.requiredXp')"/>
              </div>
            </div>
            <div class="subtitle">{{ $t('Items.subtitles.xp') }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="item.xp.min" class="number-input" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.minimum')"/>
              </div>
              <div>
                <v-text-field v-model="item.xp.max" class="number-input" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.maximum')"/>
              </div>
            </div>
            <div class="subtitle">{{ $t('Items.subtitles.roles') }}</div>
            <div class="item-flex">
              <div>
                <v-select v-model="item.addRole" class="role-select" :items="roles"
                          :label="$t('Items.subtitles.addRole')"/>
              </div>
              <div>
                <v-select v-model="item.removeRole" class="role-select" :items="roles"
                          :label="$t('Items.subtitles.removeRole')"/>
              </div>
            </div>
            <v-select v-model="item.requiredRoles" :items="requiredRoles" multiple chips closable-chips
                      :label="$t('Items.subtitles.requiredRoles')"/>
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

const props = defineProps<{item: Item, names: Array<string>}>()
const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!)
let requiredRoles = SelectItems.roles(guild.value!.roles!, false, false)
let dialog = ref(false)
let valid = ref(true)
let loading = ref(false)
let item: Reactive<Item> = reactive(props.item)

const positiveIntegerRules = [
  (number: number) => (number >= 0 && !(number % 1)) || i18n.global.t('Items.errors.invPosNumber')
]
const nameRules = [
  (name: string) => (name.length > 0 && name.length <= 50) || i18n.global.t('Items.errors.invItemName'),
  (name: string) => (!props.names.includes(name) || name === item.name) || i18n.global.t('Items.errors.alreadyExists')
]
const descriptionRules = [
  (description: string) => (description.length <= 200) || i18n.global.t('Items.errors.invItemDescription')
]

async function editItem() {
  loading.value = true;
  let newItem = {...item}
  newItem.name = newItem.newName!
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/items/${item.name}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string
    },
    body: JSON.stringify(newItem)
  })
  if (response.ok) {
    Object.assign(item, newItem)
    dialog.value = false;
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
  gap: 20px;
}

.role-select {
  width: 200px;
}

.btn-icon {
  margin-right: 5px;
}
</style>