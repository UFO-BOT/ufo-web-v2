<template>
  <div>
    <v-form v-model="valid">
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.work') }}</div>
      <div class="subtitle-2">{{ $t('GuildEconomy.subtitles.salary') }}</div>
      <div class="number-inputs-flex">
        <v-text-field v-model="settings.work.low" class="number-input-item" :rules="positiveIntegerRules" type="number"
                      color="primary" :label="$t('GuildEconomy.subtitles.from')"/>
        <v-text-field v-model="settings.work.high" class="number-input-item" :rules="positiveIntegerRules" type="number"
                      color="primary" :label="$t('GuildEconomy.subtitles.to')"/>
      </div>
      <div class="subtitle-2">{{ $t('GuildEconomy.subtitles.cooldown') }}</div>
      <DurationPicker v-model="settings.work.cooldown"/>
      <br>
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.moneybags') }}</div>
      <div class="subtitle-2">{{ $t('GuildEconomy.subtitles.money') }}</div>
      <div class="number-inputs-flex">
        <v-text-field v-model="settings.moneybags.low" class="number-input-item" :rules="integerRules" type="number"
                      color="primary" :label="$t('GuildEconomy.subtitles.from')"/>
        <v-text-field v-model="settings.moneybags.high" class="number-input-item" :rules="integerRules" type="number"
                      color="primary" :label="$t('GuildEconomy.subtitles.to')"/>
      </div>
      <div class="subtitle-2">{{ $t('GuildEconomy.subtitles.cooldown') }}</div>
      <DurationPicker v-model="settings.moneybags.cooldown"/>
      <br>
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.moneySymbol') }}</div>
      <v-text-field v-model="settings.moneySymbol" class="money-symbol-input" :rules="moneySymbolRules" color="primary"
                    counter="50" variant="outlined" :label="$t('GuildEconomy.subtitles.symbol')"
                    :hint="$t('GuildEconomy.subtitles.moneySymbolHint')"/>
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.commission') }}</div>
      <v-text-field v-model="settings.commission" class="number-input" :rules="commissionRules" type="number"
                    color="primary" :label="$t('GuildEconomy.subtitles.percent')" suffix="%" hide-details="auto"/>
      <v-checkbox v-model="settings.duelCommission" color="primary" hide-details
                  :label="$t('GuildEconomy.subtitles.duelCommission')"/>
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.minBet') }}</div>
      <v-text-field v-model="settings.minBet" class="number-input" :rules="positiveIntegerRules" type="number"
                    color="primary" :label="$t('GuildEconomy.subtitles.bet')"/>
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.resetBalance') }}</div>
      <ResetBalance :guild="guild"/>
      <br>
      <div class="subtitle-1">{{ $t('GuildEconomy.subtitles.shop') }}</div>
      <Items/>
      <v-btn class="submit" :disabled="valid === false" :loading="submitting" size="large" color="secondary"
             @click="submit">
        <v-icon class="save-icon">save</v-icon>
        {{ $t('GuildEconomy.submit') }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {ReactiveVariable} from "vue/macros";
import {GuildSettings} from "@/types/GuildSettings";
import config from "@/config.json";
import i18n from "@/plugins/i18n";
import {Guild} from "@/types/Guild";
import DurationPicker from "@/components/DurationPicker.vue";
import ResetBalance from "@/components/ResetBalance.vue";
import Items from "@/components/items/Items.vue";

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute();
const store = useStore();
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let settings: ReactiveVariable<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);

const integerRules = [
  (number: number) => !(number % 1) || i18n.global.t('GuildEconomy.errors.invNumber')
]
const positiveIntegerRules = [
  (number: number) => (number >= 0 && !(number % 1)) || i18n.global.t('GuildEconomy.errors.invPosNumber')
]
const moneySymbolRules = [
  (symbol: string) => (symbol.length <= 50) || i18n.global.t('GuildEconomy.errors.invMoneySymbol')
]
const commissionRules = [
  (number: number) => (number >= 0 && number <= 100 && !(number % 1)) ||
      i18n.global.t('GuildEconomy.errors.invCommission')
]

document.title = i18n.global.t('GuildEconomy.title')

async function submit() {
  submitting.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/economy`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          work: settings.work,
          moneybags: settings.moneybags,
          moneySymbol: settings.moneySymbol,
          minBet: settings.minBet,
          commission: settings.commission,
          duelCommission: settings.duelCommission
        })
      })
  if(response.ok) emit('submitted', 'success', settings)
  else emit('submitted', 'error')
  submitting.value = false;
}
</script>

<style scoped>
.subtitle-1 {
  font-size: 1.2em;
}

.subtitle-2 {
  font-size: 1.1em;
  color: grey;
}

.number-inputs-flex {
  display: flex;
  flex-wrap: wrap;
  max-width: 350px;
}

.number-input-item {
  width: 100px;
  margin-right: 20px;
}

.number-input {
  max-width: 200px;
  margin-right: 20px;
  margin-top: 8px;
}

.money-symbol-input {
  max-width: 280px;
  margin-right: 20px;
  margin-top: 8px;
}

.items {
  background-color: var(--v-block-base);
  box-shadow: 0 0 5px var(--v-blockShadow-base);
  padding: 15px 15px 15px 20px;
  margin-bottom: 15px;
  width: 90%;
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
}

.item-action {
  display: inline;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>