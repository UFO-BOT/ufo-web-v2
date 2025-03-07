<template>
  <div class="center">
    <div class="content item-center">
      <div class="name"><b>{{ $t('Donate.name') }}</b></div>
      <div class="donate-description" v-html="$t('Donate.description')"></div>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="feature of $tm('Donate.features')" bg-color="block">
          <v-expansion-panel-title class="feature-name" ripple>
            <v-icon class="category-icon">{{ $rt(feature.icon) }}</v-icon>
            {{ $rt(feature.name) }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="feature-description" color="block">
            {{ $rt(feature.description) }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div class="cards-container">
      <div v-for="(card, i) in $tm('Donate.cards')" :class="`donate-card donate-card-${i}`">
        <div>
          <div class="donate-name">{{ $rt(card.name) }}</div>
          <v-divider class="donate-card-divider"></v-divider>
          <ul class="donate-bonuses">
            <li v-for="perk in $tm(`Donate.cards.${i}.perks`)" :class="`donate-bonus-${i} donate-bonus`">
              <span v-if="!$rt(perk).includes('[R]')">{{ $rt(perk) }}</span>
              <span v-else>
                {{ $rt(perk).split('[R]')[0] }}
                <v-chip v-if="i !== 'premium'" variant="outlined" color="#4caf50">Donator</v-chip>
                <v-chip v-else variant="outlined" color="#007bff">Premium Donator</v-chip>
                {{ $rt(perk).split('[R]')[1] }}
              </span>
            </li>
          </ul>
        </div>
        <div>
          <v-divider class="donate-card-divider"></v-divider>
          <v-btn class="donate-buy" theme="dark" :color="i === 'premium' ? '#007bff' : '#4caf50'" :width="220"
                 :height="40" :loading="loading" @click="payment(i)">
            {{ $rt(card.price) }}₽<span class="per">{{ $t('Donate.perMonth') }}</span>
          </v-btn>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar" color="block">
      <div class="error-text">{{ $t('Donate.error') }}</div>
      <template v-slot:actions>
        <v-btn color="pink" variant="text" ripple @click="snackbar = false">
          {{ $t('Donate.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import {ref, WritableComputedRef} from "vue";
import {SubscriptionType} from "@/types/SubscriptionType";
import config from "@/config.json";
import i18n from "@/plugins/i18n";
import {loginUrl} from "@/utils/LoginUrl";
import {PaymentResponse} from "@/types/PaymentResponse";

import {Language} from "@/types/Language";

let loading = ref(false)
let snackbar = ref(false)

async function payment(type: SubscriptionType) {
  let token = localStorage.getItem('token')
  if (!token) window.location.replace(loginUrl())
  let locale = i18n.global.locale as WritableComputedRef<Language>
  let language: Language = locale.value === "ru" ? "en" : "ru"
  loading.value = true
  let response = await fetch(`${config.API}/private/payments`,
      {
        method: 'POST',
        headers: {
          Authorization: token as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          type,
          language: language
        })
      })
  let body: PaymentResponse = await response.json()
  if (response.ok) window.location.replace(body.confirmationUrl)
  else {
    snackbar.value = true
    loading.value = false
  }
}
</script>

<style scoped>
.content {
  max-width: 1100px;
  padding: 0 20px;
}

.name {
  font-size: 3.5em;
}

.donate-description {
  font-size: 1.4em;
  text-align: left;
  margin-bottom: 10px;
}

.feature-name {
  font-size: 1.4em;
}

.category-icon {
  margin-right: 10px;
}

.feature-description {
  text-align: left;
  font-size: 1.1em;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}

.donate-card {
  background-color: rgb(var(--v-theme-block));
  padding: 5px 15px 5px 15px;
  border-radius: 10px !important;
  border: solid 2px;
  width: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px 20px;
}

.donate-card-standard {
  box-shadow: 0 0 15px -3px #4caf50;
  border-color: #4caf50;
}

.donate-card-premium {
  box-shadow: 0 0 15px -3px #1976d2;
  border-color: #1976d2;
}

.donate-card-divider {
  margin: 5px 5px;
}

.donate-name {
  font-size: 1.8em;
  margin-top: 3px;
}

.donate-bonuses {
  color: var(--v-opacityColor-base);
  text-align: left;
  padding-left: 20px;
  list-style: none;
}

.donate-bonus {
  word-break: break-word;
  font-size: 1.3em;
}

.donate-bonus::before {
  content: "\2022";
  font-weight: bold;
  display: inline-block;
  width: 0.7em;
  margin-left: -1em;
}

.donate-bonus-standard::before {
  color: #28a745;
}

.donate-bonus-premium::before {
  color: #007bff;
}

.donate-buy {
  width: 80%;
  margin: 5px 5px;
  font-size: 1.2em;
  letter-spacing: 0 !important;
  text-transform: none !important;
}

.per {
  font-size: 0.8em;
}

.error-text {
  font-size: 1.4em;
}
</style>