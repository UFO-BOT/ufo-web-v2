<template>
  <div class="center">
    <div class="subscription-card" :class="loading ? 'subscription-card-loading' : `subscription-card-${type}`">
      <v-progress-circular v-if="loading" :size="80" :width="6" indeterminate/>
      <div v-else>
        <div class="subscription-name">{{ title }}</div>
        <div class="subscription-description">{{ description }}</div>
        <v-divider opacity="0.3" class="subscription-divider"></v-divider>
        <div class="subscription-grid">
          <div>
            <div class="subscription-subtitle">{{ $t('Subscription.type') }}</div>
            <v-select v-model="type" class="subscription-select" :items="typeItems" :disabled="typeLocked"
                      :color="theme.color" variant="outlined"/>
          </div>
          <div>
            <div class="subscription-subtitle">{{ $t('Subscription.period') }}</div>
            <v-select v-model="months" class="subscription-select" :items="monthsItems"
                      :color="theme.color" variant="outlined"/>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-title">{{ $t('Subscription.summary') }}</div>
          <div class="summary-row">
            <span>{{ $t('Subscription.selectedType') }}</span>
            <b>{{ currentCard.name }}</b>
          </div>
          <div class="summary-row">
            <span>{{ $t('Subscription.selectedPeriod') }}</span>
            <b>{{ selectedPeriodName }}</b>
          </div>
          <div class="summary-row">
            <span>{{ $t('Subscription.price') }}</span>
            <b>{{ selectedPeriod.price }}₽</b>
          </div>
          <div class="summary-row">
            <span>{{ $t('Subscription.boosts') }}</span>
            <b>{{ currentCard.boosts }}</b>
          </div>
          <div v-if="subscription" class="summary-row">
            <span>{{ $t('Subscription.ends') }}</span>
            <b>{{ ends }}</b>
          </div>
        </div>
        <div v-if="!subscription" class="subscription-perks">
          <div class="subscription-subtitle">{{ $t('Subscription.perks') }}</div>
          <ul class="subscription-list">
            <li v-for="perk in $tm(`Donate.cards.${type}.perks`)" :class="`subscription-list-item subscription-list-item-${type}`">
              <span v-if="!$rt(perk).includes('[R]')">{{ $rt(perk) }}</span>
              <span v-else>
                {{ $rt(perk).split('[R]')[0] }}
                <v-chip v-if="type !== 'premium'" variant="outlined" color="#4caf50">Donator</v-chip>
                <v-chip v-else variant="outlined" color="#007bff">Premium Donator</v-chip>
                {{ $rt(perk).split('[R]')[1] }}
              </span>
            </li>
          </ul>
        </div>
        <v-divider opacity="0.3" class="subscription-actions-divider"></v-divider>
        <div class="subscription-actions">
          <v-btn class="subscription-back" theme="dark" variant="outlined" color="blue-grey" :to="'/donate'">{{ $t('Subscription.back') }}</v-btn>
          <v-btn class="subscription-submit" theme="dark" :color="theme.color" :loading="submitting"
                 @click="payment">
            {{ actionText }} · {{ selectedPeriod.price }}₽
          </v-btn>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar" color="block">
      <div class="error-text">{{ errorText }}</div>
      <template v-slot:actions>
        <v-btn color="pink" variant="text" ripple @click="snackbar = false">
          {{ $t('Subscription.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, WritableComputedRef} from "vue";
import {useRoute} from "vue-router";

import subscriptions from "@/configs/subscriptions";
import config from "@/config.json";
import i18n from "@/plugins/i18n";
import {Language} from "@/types/Language";
import {PaymentResponse} from "@/types/PaymentResponse";
import {SelectItem} from "@/types/SelectItem";
import {SubscriptionType} from "@/types/SubscriptionType";
import {SubscriptionViewResponse} from "@/types/SubscriptionViewResponse";
import {loginUrl} from "@/utils/LoginUrl";

const route = useRoute()
const themes: Record<SubscriptionType, {color: string}> = {
  standard: {
    color: '#4caf50'
  },
  premium: {
    color: '#007bff'
  }
}

let loading = ref(true)
let submitting = ref(false)
let snackbar = ref(false)
let errorText = ref(String(i18n.global.t('Subscription.error')))
let subscription = ref<SubscriptionViewResponse['subscription']>(null)
let type = ref<SubscriptionType>('standard')
let months = ref<1 | 3 | 6 | 12>(1)
let typeLocked = ref(false)

const theme = computed(() => themes[type.value])
const currentPrices = computed(() => subscriptions[type.value].months)
const selectedPeriod = computed(() => currentPrices.value.find(period => period.count === months.value) ?? currentPrices.value[0])
const ends = computed(() => subscription.value?.ends ? new Date(subscription.value.ends)
    .toLocaleString((i18n.global.locale as WritableComputedRef<Language>).value) : '')
const selectedPeriodName = computed(() => selectedPeriod.value.name[(i18n.global.locale as WritableComputedRef<Language>).value])
const currentCard = computed(() => ({
  name: String(i18n.global.t(`Donate.cards.${type.value}.name`)),
  boosts: subscriptions[type.value].boosts
}))
const title = computed(() => subscription.value ? String(i18n.global.t('Subscription.extendTitle')) : String(i18n.global.t('Subscription.buyTitle')))
const description = computed(() => subscription.value ? String(i18n.global.t('Subscription.extendDescription')) : String(i18n.global.t('Subscription.buyDescription')))
const actionText = computed(() => subscription.value ? String(i18n.global.t('Subscription.extend')) : String(i18n.global.t('Subscription.buy')))
const typeItems = computed<Array<SelectItem>>(() => [
  {title: String(i18n.global.t('Donate.cards.standard.name')), value: 'standard'},
  {title: String(i18n.global.t('Donate.cards.premium.name')), value: 'premium'}
])
const monthsItems = computed<Array<SelectItem>>(() => currentPrices.value.map(period => {
  let base = currentPrices.value[0].price * period.count
  let saved = base - period.price
  let percent = base > 0 ? Math.round(saved / base * 100) : 0
  let title = period.name[(i18n.global.locale as WritableComputedRef<Language>).value]
  if (period.count > 1 && percent > 0) title += ` - ${percent}%`
  return {title, value: period.count}
}))

async function load() {
  let token = localStorage.getItem('token')
  if (!token) return window.location.replace(loginUrl())
  let id = route.params.id as string | undefined
  let queryType = route.query.type
  if (queryType === 'premium' || queryType === 'standard') type.value = queryType
  if (!id) {
    months.value = currentPrices.value[0].count
    loading.value = false
    return
  }
  let response = await fetch(`${config.API}/private/subscriptions/${id}`, {
    headers: {
      Authorization: token
    }
  })
  let body: SubscriptionViewResponse = await response.json()
  if (!response.ok || !body.subscription) return window.location.replace('/donate')
  subscription.value = body.subscription
  type.value = body.subscription.type
  months.value = currentPrices.value[0].count
  typeLocked.value = true
  loading.value = false
}

async function payment() {
  let token = localStorage.getItem('token')
  if (!token) return window.location.replace(loginUrl())
  let locale = i18n.global.locale as WritableComputedRef<Language>
  let language: Language = locale.value === 'ru' ? 'ru' : 'en'
  submitting.value = true
  let response = await fetch(`${config.API}/private/payments`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: type.value,
      months: months.value,
      language: language,
      subscription_id: subscription.value?.id
    })
  })
  let body: PaymentResponse = await response.json()
  if (response.ok) window.location.replace(body.confirmationUrl)
  else {
    errorText.value = String(i18n.global.t('Subscription.error'))
    snackbar.value = true
    submitting.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.subscription-card {
  max-width: 920px;
  margin: 20px auto;
  width: min(920px, calc(100vw - 40px));
  padding: 20px;
  border-radius: 12px;
  background-color: rgb(var(--v-theme-block));
  border: solid 2px;
  box-sizing: border-box;
}

.subscription-card-standard {
  box-shadow: 0 0 15px -3px #4caf50;
  border-color: #4caf50;
}

.subscription-card-premium {
  box-shadow: 0 0 15px -3px #1976d2;
  border-color: #1976d2;
}

.subscription-card-loading {
  border-color: rgb(var(--v-theme-outline));
}

.subscription-name {
  font-size: clamp(2rem, 5vw, 2.6rem);
  line-height: 1.1em;
}

.subscription-description {
  max-width: 760px;
  margin: 10px auto 0 auto;
  color: rgb(var(--v-theme-description));
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  line-height: 1.45;
}

.subscription-divider {
  margin: 18px 0;
}

.subscription-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  text-align: left;
}

.subscription-subtitle {
  margin-bottom: 8px;
  color: rgb(var(--v-theme-description));
  font-size: 1.1em;
  font-weight: bold;
}

.subscription-select {
  width: 100%;
}

.summary-card {
  margin-top: 18px;
  padding: 18px;
  border-radius: 10px;
  background-color: rgba(var(--v-theme-shadow), 0.16);
  border: 1px solid rgba(var(--v-theme-shadow), 0.2);
  text-align: left;
}

.summary-title {
  font-size: 1.3em;
  margin-bottom: 10px;
}

.summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-top: 6px;
  font-size: 1.1em;
}

.summary-row b {
  text-align: right;
}

.subscription-perks {
  margin-top: 18px;
  text-align: left;
}

.subscription-actions-divider {
  margin-top: 18px;
}

.subscription-list {
  color: var(--v-opacityColor-base);
  padding-left: 20px;
  list-style: none;
}

.subscription-list-item {
  word-break: break-word;
  font-size: 1.2em;
  margin-bottom: 6px;
}

.subscription-list-item::before {
  content: "\2022";
  font-weight: bold;
  display: inline-block;
  width: 0.7em;
  margin-left: -1em;
}

.subscription-list-item-standard::before {
  color: #28a745;
}

.subscription-list-item-premium::before {
  color: #007bff;
}

.subscription-actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.subscription-back,
.subscription-submit {
  height: 48px;
  letter-spacing: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  font-size: 1.1em;
}

.subscription-back {
  min-width: 132px;
  font-weight: 600;
  box-shadow: none;
}

.subscription-submit {
  width: 220px;
  font-weight: 600;
}

.subscription-actions :deep(.v-btn__content) {
  color: inherit;
}

.error-text {
  font-size: 1.2em;
}

@media (max-width: 600px) {
  .subscription-card {
    width: calc(100vw - 32px);
    margin: 16px auto;
    padding: 20px 16px;
    border-radius: 16px;
  }

  .subscription-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .subscription-name {
    font-size: 1.8rem;
    line-height: 1.15;
  }

  .subscription-description {
    max-width: 100%;
    font-size: 0.98rem;
  }

  .summary-card {
    padding: 14px;
  }

  .summary-row {
    flex-direction: column;
    gap: 4px;
    margin-top: 10px;
  }

  .summary-row b {
    text-align: left;
  }

  .subscription-actions {
    flex-direction: column;
    gap: 10px;
  }

  .subscription-actions :deep(.v-btn) {
    width: 100%;
  }

  .subscription-back,
  .subscription-submit {
    height: 52px;
  }

  .subscription-submit {
    order: 1;
  }

  .subscription-back {
    order: 2;
    min-width: 100%;
  }

}
</style>
