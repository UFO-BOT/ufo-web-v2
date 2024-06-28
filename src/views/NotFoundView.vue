<template>
  <div class="center">
    <div class="error-code"><b>404</b></div>
    <div class="description">{{ $t('NotFound.name') }}</div>
    <v-btn class="home" color="secondary" size="x-large" to="/">
      <v-icon class="mr-2" size="large">home</v-icon>{{ $t('NotFound.home')}}
    </v-btn>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.error-code {
  font-size: 10em;
}

.description {
  margin: 10px;
  font-size: 3em;
}

.home {
  font-size: 1.5em;
  margin: 10px 10px;
}
</style>