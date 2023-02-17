<template>
  <div>
    <v-toolbar class="pr-3">
      <v-app-bar-nav-icon class="nav-menu" @click="mobileNav = !mobileNav"></v-app-bar-nav-icon>
      <router-link to="/"><img :src="UFOLogo" alt="UFO Logo" class="main-icon"></router-link>
      <v-toolbar-items class="nav-links">
        <v-btn v-for="link in $tm('Nav.links')" :to="link.href ? '' : $rt(link.path)"
               :href="link.href ? $rt(link.path) : ''" :target="link.blank ? '_blank' : '_self'">
          <v-icon class="nav-icon" size="25">{{ $rt(link.icon) }}</v-icon>{{ $rt(link.name) }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer/>
      <v-toolbar-items class="nav-links">
        <v-btn @click="translate"><v-icon size="35" class="nav-icon">translate</v-icon></v-btn>
        <v-btn :href="`https://discord.com/api/oauth2/authorize?client_id=${config.botID}&redirect_uri=` +
          `${encodeURIComponent(location + 'login')}&response_type=code&scope=identify%20guilds`"
               v-if="true">
          <v-icon size="20" class="nav-icon">{{ $t('Nav.login.icon') }}</v-icon>{{ $t('Nav.login.name') }}
        </v-btn>
        <v-btn v-if="false" disabled class="login"><v-progress-circular indeterminate></v-progress-circular></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list v-if="mobileNav" class="mobileNav" color="primary">
      <v-item-group @click="mobileNav = false">
        <v-list-item v-for="link in $tm('Nav.links')" :prepend-icon="$rt(link.icon)"
                     :to="link.href ? '' : $rt(link.path)" :href="link.href ? $rt(link.path) : ''"
                     :target="link.blank ? '_blank' : '_self'">
          {{ $rt(link.name) }}
        </v-list-item>
      </v-item-group>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import i18n from "@/plugins/i18n";
import UFOLogo from "@/assets/logo.png";
import config from "@/config.json";
import {ref} from "vue";

const location = window.location.href;
const mobileNav = ref(false);

function translate() {
  let language: "ru" | "en" = i18n.global.locale.value === "ru" ? "en" : "ru"
  localStorage.setItem("language", language);
  i18n.global.locale.value = language;
}
</script>

<style scoped>
@media screen and (max-width: 1000px) {
  .nav-menu {
    display: block;
  }
  .nav-links {
    display: none;
  }
  .mobileNav {
    display: block;
  }
}
@media screen and (min-width: 1000px) {
  .nav-menu {
    display: none;
  }
  .nav-links {
    display: block;
  }
  .mobileNav {
    display: none;
  }
}

.main-icon {
  float: left;
  width: 52px;
  height: 30px;
  transition-duration: 200ms;
  margin: 15px;
}

.main-icon:active {
  opacity: 0.7;
  transition-duration: 200ms;
}

.nav-icon {
  margin-right: 3px;
}

.login {
  opacity: 1;
}
</style>