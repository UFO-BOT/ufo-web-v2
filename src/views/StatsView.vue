<template>
  <div class="center">
    <div class="header">{{ $t('Stats.name') }}</div>
    <div class="stats-container">
      <div class="stats-element" v-for="value of values">
        <v-progress-circular v-if="!statistics.shards?.length" :size="45" width="4" indeterminate></v-progress-circular>
        <div class="value" v-else>
          {{ statistics.stats[value] }}
        </div>
        <div class="value-name">{{ $t(`Stats.${value}`) }}</div>
      </div>
    </div>
    <div class="header">{{ $t('Stats.ping') }}</div>
    <div class="stats-container">
      <div class="stats-element">
        <v-progress-circular v-if="!statistics.shards?.length" :size="45" width="4"  indeterminate></v-progress-circular>
        <div class="value" v-else :style="{color: statistics.ping.bot < 300 ?
        '#00f56e' : (statistics.ping.bot > 1000 ? '#e20000' : '#ffd70c')}">
          {{ statistics.ping.bot }} {{ $t('Stats.ms') }}
        </div>
        <div class="value-name">{{ $t('Stats.bot') }}</div>
      </div>
      <div class="stats-element">
        <v-progress-circular v-if="!statistics.shards?.length" :size="45" width="4" indeterminate></v-progress-circular>
        <div class="value" v-else :style="{color: statistics.ping.database < 300 ?
        '#00f56e' : (statistics.ping.database > 1000 ? '#e20000' : '#ffd70c')}">
          {{ statistics.ping.database }} {{ $t('Stats.ms') }}
        </div>
        <div class="value-name">{{ $t('Stats.database') }}</div>
      </div>
    </div>
    <div class="header">{{ $t('Stats.shards') }}</div>
    <v-table class="shards-table item-center">
      <thead>
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">{{ $t('Stats.status') }}</th>
          <th class="text-center">{{ $t('Stats.guilds') }}</th>
          <th class="text-center">{{ $t('Stats.users') }}</th>
          <th class="text-center">{{ $t('Stats.ping') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="shard in statistics.shards">
          <td>{{ shard.id }}</td>
          <td>
            <div v-if="shard.ready" class="status-circle status-circle-green item-center"></div>
            <div v-else class="status-circle status-circle-yellow item-center"></div>
          </td>
          <td>{{ shard.guilds }}</td>
          <td>{{ shard.users }}</td>
          <td>{{ shard.ping }} {{ $t('Stats.ms') }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import config from "@/config.json";
import {Stats} from "@/types/Stats";
import i18n from "@/plugins/i18n";

const values = ['guilds', 'users', 'channels', 'emojis'];
let statistics: Ref<Stats> = ref({} as Stats);
let shards: Ref<Record<string, any>> = ref([]);

onMounted(async () => {
  let response = await fetch(config.API + '/public/stats');
  statistics.value = await response.json();
  shards.value = statistics.value.shards.map(shard => {return {
    id: shard.id,
    ready: shard.ready,
    guilds: shard.guilds,
    users: shard.users,
    ping: shard.ping + ' ms'
  }})
})
</script>

<style scoped>
.header {
  margin: 5px 0 5px 0;
  font-size: 2em;
}

.stats-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.stats-element {
  background-color: rgb(var(--v-theme-block));
  padding: 15px 15px;
  text-align: center;
  margin: 10px 10px 10px 10px;
  border-radius: 4px;
  width: 230px;
  word-break: break-all;
  box-shadow: 3px 3px 3px -3px rgb(var(--v-theme-shadow));
}

.value {
  font-size: 2em;
}

.value-name {
  color: rgb(var(--v-theme-description));
  font-size: 1.5em;
}

.shards-table {
  width: 1100px;
  border-radius: 20px;
  padding: 10px;
  background-color: rgb(var(--v-theme-block));
  box-shadow: 0 0 8px -3px rgb(var(--v-theme-shadow));
}

.status-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  content: '⁣';
}

.status-circle-green {
  background-color: #00f56e;
}

.status-circle-yellow {
  background-color: #ffd70c;
}
</style>