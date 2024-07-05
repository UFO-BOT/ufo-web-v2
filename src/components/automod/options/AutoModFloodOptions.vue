<template>
  <div>
    <div class="values">
      <div>
        <v-text-field v-model="props.modelValue.messages" class="value" color="primary" :rules="positiveIntegerRules"
                      :label="$t('GuildModeration.subtitles.maxMessages')"
                      @submit="emit('update:modelValue', props.modelValue)"/>
      </div>
      <div>
        <v-text-field v-model="props.modelValue.symbols" class="value" color="primary" :rules="positiveIntegerRules"
                      :label="$t('GuildModeration.subtitles.maxSymbols')"
                      @submit="emit('update:modelValue', props.modelValue)"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AutoModFloodOptions} from "@/types/GuildSettings";
import i18n from "@/plugins/i18n";

const props = defineProps<{ modelValue: AutoModFloodOptions }>()
const emit = defineEmits(['update:modelValue'])
const positiveIntegerRules = [
  (number: number) => (number > 0 && !(number % 1)) || i18n.global.t('GuildModeration.errors.invPosNumber')
]

</script>

<style scoped>
.values {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.value {
  width: 200px;
}
</style>