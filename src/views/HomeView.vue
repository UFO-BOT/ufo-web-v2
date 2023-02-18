<template>
  <div class="center">
    <div class="name"><b>UFO</b></div>
    <v-img :src="UFOLogo" class="img-center logo"></v-img>
    <span class="description"></span><br>
    <v-btn :href="`https://discord.com/api/oauth2/authorize?client_id=${config.botID}&redirect_uri=${encodeURIComponent
    (location + 'landing')}&response_type=code&permissions=1515519995134&scope=bot`"
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
import {onMounted, watch} from "vue";
import UFOLogo from "@/assets/logo.png";
import config from "@/config.json";
import i18n from "@/plugins/i18n";

const location = window.location.href
let typed: Typed;
function startTyped() {
  typed?.destroy();
  typed = new Typed('.description', {
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
watch(() => i18n.global.locale.value, startTyped)
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 4em;
}

.logo {
  max-width: 400px;
  max-height: 300px;
}

.description {
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