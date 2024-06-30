<template>
  <div>
    <v-combobox v-model="props.modelValue.whitelistGuilds" @submit="emit('update:modelValue', props.modelValue)"
                :label="$t('GuildModeration.subtitles.allowedGuilds')" chips closable-chips multiple/>
  </div>
</template>

<script setup lang="ts">
import {AutoModInvitesOptions} from "@/types/GuildSettings";

const props = defineProps<{modelValue: AutoModInvitesOptions}>()
const emit = defineEmits(['update:modelValue'])

</script>

<style scoped>

</style>