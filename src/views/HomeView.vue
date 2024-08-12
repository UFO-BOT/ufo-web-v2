<template>
  <div class="center">
    <div class="name">
      UFO
      <router-link class="primary-link" to="/v2">V2</router-link>
    </div>
    <v-img v-if="$vuetify.theme.current.dark" :src="UFOLogoDark" class="logo item-center"></v-img>
    <v-img v-else :src="UFOLogoLight" class="logo item-center"></v-img>
    <div class="description-field">
      <span class="description-text"></span><br>
    </div>
    <v-btn :href="`https://discord.com/api/oauth2/authorize?client_id=${config.botID}&redirect_uri=${encodeURIComponent
    (location + '/landing')}&response_type=code&permissions=1515519995134&scope=bot`"
           size="x-large" color="primary" class="invite">
      <v-icon class="mr-2" size="large">discord</v-icon>{{ $t('Home.invite') }}
    </v-btn>
    <div class="features-header">{{ $t('Home.featuresTitle') }}</div>
    <div class="features-container">
      <v-card class="feature" color="block" v-for="feature in $tm('Home.features')">
        <div class="feature-name">{{ $rt(feature.name) }}</div>
        <div class="feature-description">{{ $rt(feature.description) }}</div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Typed from "typed.js";
import {onMounted, watch, WritableComputedRef} from "vue";
import UFOLogoDark from "@/assets/logo-v2-dark.png";
import UFOLogoLight from "@/assets/logo-v2-light.png";
import config from "@/config.json";
import {Language} from "@/types/Language";
import i18n from "@/plugins/i18n";

const location = window.location.origin
let typed: Typed;
function startTyped() {
  typed?.destroy();
  typed = new Typed('.description-text', {
    strings: i18n.global.tm('Home.descriptions').map(desc => i18n.global.rt(desc)),
    typeSpeed: 50,
    backSpeed: 50,
    shuffle: true,
    backDelay: 3000,
    loop: true,
    cursorChar: '__'
  })
}
onMounted(startTyped)
watch(() => (i18n.global.locale as WritableComputedRef<Language>).value, startTyped)
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 4em;
  font-weight: bold;
}

.logo {
  max-width: 400px;
  max-height: 300px;
}

.description-field {
  margin-top: 10px;
  margin-bottom: 5px;
}

.description-text {
  margin-top: 15px;
  font-size: 1.8em;
}

.invite {
  font-size: 1.4em;
  margin-top: 5px;
}

.features-header {
  font-size: 2.2em;
  margin-top: 20px;
  font-weight: bold;
}

.features-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.feature {
  padding: 20px;
  margin: 5px 15px 10px;
  width: 300px;
}

.feature-name {
  font-size: 1.4em;
}

.feature-description {
  color: rgb(var(--v-theme-description));
}
</style>