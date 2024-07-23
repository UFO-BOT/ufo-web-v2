<template>
  <div>
    <v-alert class="alert mb-3" border="start" color="primary"
             :title="$t('BoostAlert.boost')" variant="tonal">
      <div class="donate-description">
        {{ props.text }}
      </div>
      <v-btn class="donate-button" color="primary" size="small" variant="outlined" prepend-icon="favorite" to="/donate">
        {{ $t('BoostAlert.donate') }}
      </v-btn>
    </v-alert>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{text: string}>()

</script>

<style scoped>
.donate-description {
  margin-top: 5px;
}

.donate-button {
  margin-top: 5px;
}
</style>