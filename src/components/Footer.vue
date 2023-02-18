<template>
  <div>
    <v-footer color="footer" class="footer">
      <div class="footer-flex pa-4">
        <div class="footer-block">
          <div class="bot-name">
            <img :src="UFOLogo" alt="UFO Logo" class="main-icon"/>UFO
          </div>
        </div>
        <div class="links-flex">
          <div v-for="i in 3" :key="i" class="footer-block">
            <div v-for="link in $tm('Footer.links')">
              <span v-if="link.block === i">
                <a v-if="link.blank" class="footer-link" target="_blank" :href="$rt(link.path)">{{ $rt(link.name) }}</a>
                <router-link v-else class="footer-link" :to="$rt(link.path)">{{ $rt(link.name) }}</router-link>
              </span>
            </div>
          </div>
        </div>
        <div class="footer-block">
          <v-switch v-model="dark" color="primary" :label="$t('Footer.darkTheme')" @change="updateTheme" hide-details/>
        </div>
      </div>
      <div class="footer-bottom">
        <v-divider/>
        <div class="ma-2">Smoky © {{ year }} | {{ $t("Footer.rights") }}</div>
      </div>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import vuetify from "@/plugins/vuetify";
import UFOLogo from "@/assets/logo.png";
import {ref} from "vue";

const year = new Date().getFullYear();
const dark = ref(localStorage.getItem('theme') !== 'light')

function updateTheme() {
  let theme = dark.value ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  vuetify.theme.global.name.value = theme;
}
</script>

<style scoped>
.footer {
  padding: 0;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.footer-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.links-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.main-icon {
  width: 50px;
  height: 27px;
  display: inline;
  margin-right: 5px;
}

.bot-name {
  font-size: 2em;
  font-weight: bold;
}

.footer-block {
  margin: 5px 30px;
}

.footer-link {
  color: rgb(var(--v-theme-footerLink));
  text-decoration: none;
  transition-duration: 200ms;
}

.footer-link:active {
  opacity: 0.7;
  transition-duration: 200ms;
}

.footer-bottom {
  text-align: center;
  width: 100%;
}
</style>