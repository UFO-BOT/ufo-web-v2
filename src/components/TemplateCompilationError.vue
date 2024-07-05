<template>
  <div>
    <v-alert class="alert" border="start" color="error" variant="tonal"
             :title="$t(`TemplateCompilationError.title`)">
      {{ $t(`TemplateCompilationError.description`) }}
      <a href="https://docs.ufobot.ru/articles/variables" target="_blank" class="link">
        {{ $t(`TemplateCompilationError.link`) }}
      </a>
    </v-alert>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.alert {
  text-align: justify;
}

.link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}
</style>