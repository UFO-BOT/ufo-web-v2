<template>
  <div>
    <v-toolbar class="pr-3 navbar" color="navbar" elevation="5">
      <v-app-bar-nav-icon class="nav-menu" @click="mobileNav = !mobileNav"></v-app-bar-nav-icon>
      <router-link to="/"><img class="main-icon" :src="UFOLogo" alt="UFO Logo"></router-link>
      <v-toolbar-items class="nav-links">
        <v-btn v-for="link in $tm('Nav.links')" :to="link.href ? '' : $rt(link.path)"
               :href="link.href ? $rt(link.path) : ''" :target="link.blank ? '_blank' : '_self'">
          <v-icon class="nav-icon" size="25">{{ $rt(link.icon) }}</v-icon>{{ $rt(link.name) }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer/>
      <v-toolbar-items>
        <v-btn @click="translate"><v-icon size="35" class="nav-icon">translate</v-icon></v-btn>
        <v-btn :href="`https://discord.com/api/oauth2/authorize?client_id=${config.botID}&redirect_uri=` +
          `${encodeURIComponent(location + '/login')}&response_type=`+
          `code&scope=identify+guilds+applications.commands.permissions.update`"
               v-if="!loadingUser && !user?.username">
          <v-icon size="20" class="nav-icon">{{ $t('Nav.login.icon') }}</v-icon>{{ $t('Nav.login.name') }}
        </v-btn>
        <v-btn @click="mobileNav = false" to="/@me" v-if="user?.username">
          <v-avatar class="mr-2"><img :src="user.avatarURL" class="user-avatar" alt="Avatar"></v-avatar>
          <span class="user-username">{{ user.username }}</span>
        </v-btn>
        <v-btn v-if="loadingUser" disabled class="login"><v-progress-circular indeterminate/></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list v-if="mobileNav" class="mobileNav" bg-color="mobileNav" color="primary" elevation="3">
      <v-item-group @click="mobileNav = false">
        <v-list-item v-for="link in $tm('Nav.links')" min-height="55" :prepend-icon="$rt(link.icon)"
                     :to="link.href ? '' : $rt(link.path)" :href="link.href ? $rt(link.path) : ''"
                     :target="link.blank ? '_blank' : '_self'">
          {{ $rt(link.name) }}
        </v-list-item>
      </v-item-group>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, WritableComputedRef} from "vue";
import {useStore} from "vuex";
import i18n from "@/plugins/i18n";
import vuetify from "@/plugins/vuetify";
import UFOLogo from "@/assets/logo-v2-dark.png";
import config from "@/config.json";
import {useRoute} from "vue-router";
import {Language} from "@/types/Language"

const route = useRoute();
const location = window.location.origin
const mobileNav = ref(false);
const loadingUser = ref(false);
const store = useStore();

function translate() {
  let locale = i18n.global.locale as WritableComputedRef<Language>
  let language: Language = locale.value === "ru" ? "en" : "ru"
  localStorage.setItem("language", language);
  locale.value = language;
  vuetify.locale.current = computed(() => language);
  let title = String(route.name) + '.title'
  if (i18n.global.te(title)) document.title = i18n.global.t(title)
}

let user = computed(() => store.getters.user)

onMounted(async () => {
  loadingUser.value = true;
  await store.dispatch('getUser');
  loadingUser.value = false;
})
</script>

<style scoped>
.navbar {
 z-index: 1;
}

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
  .user-username {
    display: none;
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
  .user-username {
    display: block;
  }
}

.mobileNav {
  margin: 10px 0;
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

.user-avatar {
  width: 40px;
  height: 40px;
}
</style>