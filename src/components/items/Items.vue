<template>
  <div>
    <div class="items">
      <v-progress-circular v-if="loading" :size="40" :width="4" indeterminate/>
      <div v-if="!items.length && !loading">
        <div class="item">
          <div class="item-name">¯\_(ツ)_/¯</div>
        </div>
        <v-divider/>
      </div>
      <div v-if="items.length && !loading" v-for="item of items">
        <div class="item">
          <div class="item-name text-truncate">{{ item.name }}</div>
          <div>
            <EditItem :item="item" :names="items.map(i => i.name)" class="item-action"/>
            <DeleteItem :item="item" @delete="deleted" class="item-action"/>
          </div>
        </div>
        <v-divider/>
      </div>
      <CreateItem v-if="items.length < (guild.settings?.boost ? 40 : 15)" :names="items.map(i => i.name)"
                  @create="created"/>
      <div v-else class="items-limit">{{ $t('Items.subtitles.limit') }}</div>
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
  padding: 15px 15px 15px 20px;
  margin-bottom: 15px;
  width: 95%;
  margin-top: 5px;
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

.items-limit {
  font-size: 1.1em;
  color: rgb(var(--v-theme-description));
  margin-top: 5px;
}
</style>