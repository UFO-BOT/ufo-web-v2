<template>
  <div>
    <v-btn color="primary" variant="outlined" @click="dialog = true">
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
            <div v-if="!guild.settings.boost" class="icon-description">
              <router-link class="donate-link" to="/donate">
                <v-icon size="small">favorite</v-icon>
                {{ $t('Items.subtitles.donate') }}
              </router-link>
              {{ $t('Items.subtitles.iconDescription') }}
            </div>
            <v-text-field v-model="item.iconUrl" class="general-item-field" prepend-inner-icon="art_track"
                          :disabled="!guild.settings.boost" :rules="iconRules" color="primary"
                          :label="$t('Items.subtitles.iconUrl')"/>
            <div class="subtitle">{{ $t('Items.subtitles.values') }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="item.price" class="number-input" color="primary" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.price')"/>
              </div>
              <div>
                <v-text-field v-model="item.requiredXp" class="number-input" color="primary" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.requiredXp')"/>
              </div>
            </div>
            <div class="subtitle">{{ $t('Items.subtitles.xp') }}</div>
            <div class="item-flex">
              <div>
                <v-text-field v-model="item.xp.min" class="number-input" color="primary" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.minimum')"/>
              </div>
              <div>
                <v-text-field v-model="item.xp.max" class="number-input" color="primary" :rules="positiveIntegerRules"
                              type="number" :label="$t('Items.subtitles.maximum')"/>
              </div>
            </div>
            <div class="subtitle">{{ $t('Items.subtitles.roles') }}</div>
            <v-select v-model="item.addRoles" class="roles-select" multiple chips closable-chips clearable
                      color="primary" :items="roles" :rules="rolesRules" :label="$t('Items.subtitles.addRoles')"/>
            <v-select v-model="item.removeRoles" class="roles-select" multiple chips closable-chips clearable
                      color="primary" :items="roles" :rules="rolesRules" :label="$t('Items.subtitles.removeRoles')"/>
            <v-select v-model="item.requiredRoles" color="primary" :items="requiredRoles" multiple chips closable-chips
                      clearable :label="$t('Items.subtitles.requiredRoles')"/>
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
let roles = SelectItems.roles(guild.value!.roles!, false)
let requiredRoles = SelectItems.roles(guild.value!.roles!, false, false)
let dialog = ref(false)
let valid = ref(true)
let loading = ref(false)
let item = {} as Item

function isUrl(str: string): boolean {
  try {
    let url = new URL(str)
    return url.protocol == 'http:' || url.protocol == 'https:'
  }
  catch (e) {
    return false
  }
}

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
const iconRules = [
  (icon: string) => ((!icon.length || isUrl(icon)) || i18n.global.t('Items.errors.invUrl'))
]
const rolesRules = [
  (roles: Array<string>) => (roles.length <= 5 || i18n.global.t('Items.errors.maxRoles'))
]

function newItem() {
  item = reactive({
    name: '',
    description: '',
    iconUrl: '',
    requiredRoles: [],
    requiredXp: 0,
    price: 0,
    xp: {min: 0, max: 0},
    addRoles: [],
    removeRoles: []
  })
}
newItem()

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
    newItem()
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

.donate-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition-duration: 200ms;
}

.donate-link:active {
  opacity: 0.7;
  transition-duration: 200ms;
}

.icon-description {
  color: rgb(var(--v-theme-description));
}

.item-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  column-gap: 20px;
}

.roles-select {
  margin-bottom: 5px;
}

.btn-icon {
  margin-right: 5px;
}
</style>