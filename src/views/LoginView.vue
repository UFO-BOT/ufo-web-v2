<template>
  <div class="center">
    <div class="name">{{ $t('Login.name') }}</div>
    <v-progress-circular
        :size="100"
        :width="7"
        indeterminate
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import Oauth2 from "@/utils/Oauth2";
import i18n from "@/plugins/i18n";

document.title = i18n.global.t('Login.title')

onMounted(async () => {
  let route = useRoute();
  let response = await Oauth2.getToken(route.query.code as string)
  if(!response) return window.location.replace("/");
  localStorage.setItem('token', response.accessToken)
  localStorage.setItem('refreshToken', response.refreshToken)
  window.location.replace("/@me")
})
</script>

<style scoped>
.name {
  margin: 15px;
  font-size: 3em;
}
</style>