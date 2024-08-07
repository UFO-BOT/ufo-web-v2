<template>
  <span>
    <v-dialog v-model="image" width="500" scrollable>
    <v-card color="modal">
      <v-card-title class="image-name">
        {{ name }}
      </v-card-title>
      <v-card-text>
        <img class="image" :src="require(`@/assets/v2/${file}`)" alt=""/>
      </v-card-text>
      <v-divider class="blue-grey darken-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="image = false">{{ $t('V2.close') }}</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
    <span class="image-link" @click="image = true"><v-icon>image</v-icon><slot/></span>
  </span>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{ name: string, file: string }>()
let image = ref(false)

</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
}
.image-link {
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
}

.image-name {
  font-size: 1.8em;
  background-color: rgb(var(--v-theme-modalHeader));
  padding: 15px 20px 10px;
}
</style>