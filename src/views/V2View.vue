<template>
  <div>
    <V2Ru v-if="$i18n.locale === 'ru'"/>
    <V2En v-else/>
  </div>
</template>

<script setup lang="ts">
import V2Ru from "@/components/v2/V2Ru.vue";
import V2En from "@/components/v2/V2En.vue";
</script>

<style scoped>

</style>