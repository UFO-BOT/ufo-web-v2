<template>
  <div>
    <div class="items">
      <v-progress-circular v-if="loading" class="loading" :size="40" :width="4" indeterminate/>
      <div v-if="items.length && !loading" v-for="item of items" :key="item.name">
        <div class="item">
          <div class="item-name text-truncate">{{ item.name }}</div>
          <div>
            <EditItem :item="item" :names="items.map(i => i.name)" class="item-action"/>
            <DeleteItem :item="item" @delete="deleted" class="item-action"/>
          </div>
        </div>
        <v-divider/>
      </div>
      <div class="items-bottom" v-if="!loading">
        <div>
          <CreateItem v-if="items.length < lim" :names="items.map(i => i.name)"
                      @create="created"/>
          <div v-else>
            <div v-if="guild.settings.boost">{{ $t('Items.subtitles.limit') }}</div>
            <div v-else class="items-limit">
              <v-btn color="primary" variant="text" rounded prepend-icon="favorite" to="/donate">
                {{ $t('Items.subtitles.donate') }}
              </v-btn>
              {{ $t('Items.subtitles.increaseLimit') }} {{ limit.boost }}
            </div>
          </div>
        </div>
        <div class="items-count">
          {{ items.length }}/{{ lim }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import config from "@/config.json";
import {Item} from "@/types/Item";
import {Guild} from "@/types/Guild";
import CreateItem from "@/components/items/CreateItem.vue";
import EditItem from "@/components/items/EditItem.vue";
import DeleteItem from "@/components/items/DeleteItem.vue";

const route = useRoute()
const store = useStore()
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let loading = ref(false)
let name = ref();
let items: Ref<Array<Item>> = ref([]);

const limit = {
  standard: 15,
  boost: 30
}
let lim = guild.value?.settings?.boost ? limit.boost : limit.standard

function created(item: Item) {
  items.value.push(item)
}

function deleted(item: Item) {
  items.value.splice(items.value.findIndex(i => i.name === item.name), 1)
}

onMounted(async () => {
  loading.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/items`, {
    headers: {
      Authorization: localStorage.getItem('token') as string
    }
  })
  if(response.ok) {
    items.value = await response.json();
    items.value = items.value.map(item => {item.newName = item.name; return item})
  }
  loading.value = false;
})
</script>

<style scoped>
.items {
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 5px rgb(var(--v-theme-shadow));
  padding: 5px 15px 15px 20px;
  margin-bottom: 15px;
  width: 95%;
  margin-top: 5px;
}

.loading {
  margin-top: 10px;
}

.item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 8px;
}

.item-name {
  font-size: 1.5em;
  align-self: center;
}

.item-action {
  display: inline;
}

.items-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  column-gap: 20px;
}

.items-limit {
  font-size: 1.2em;
}

.items-count {
  color: rgb(var(--v-theme-description));
  font-size: 1.2em;
}
</style>