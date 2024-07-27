<template>
  <div>
    <v-btn icon variant="text" color="primary" size="50" @click="dialog = true">
      <v-icon class="material-icons-outlined">timer</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="500px">
      <v-card color="modal">
        <v-card-title class="modal-header">
          <div>{{ title ?? $t('DurationPicker.durationInput') }}</div>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <div class="input-header">{{ $t('DurationPicker.enterDuration') }}</div>
            <div class="value-inputs">
              <v-text-field v-for="unit in Object.keys(values).reverse()" v-model="values[unit]" class="value-input"
                            :rules="rules" color="primary" :label="label ?? $t(`DurationPicker.units.${unit}`)"/>
            </div>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" :disabled="valid === false" @click="submit">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import i18n from "@/plugins/i18n";

const props = defineProps<{modelValue: number, limit?: number, title?: string, label?: string}>()
const emit = defineEmits(['update:modelValue'])
const route = useRoute()
let value = props.modelValue;
let dialog = ref(false)
let valid = ref(true)
const multipliers = {
  seconds: 1e3,
  minutes: 6e4,
  hours: 36e5,
  days: 864e5
}
let values = reactive({
  seconds: 0,
  minutes: 0,
  hours: 0,
  days: 0
})

Object.keys(values).reverse().forEach(u => {
  let unit = u as  keyof typeof values;
  let num = Math.floor(value / multipliers[unit]);
  if(num > 0) {
    values[unit] = num;
    value -= num * multipliers[unit];
  }
})

const rules = [
  (number: number) => (number >= 0 && !(number % 1)) || i18n.global.t('DurationPicker.invalidNumber'),
  () => countDuration() <= (props.limit || Infinity) || i18n.global.t('DurationPicker.tooLongDuration')
]

function countDuration(): number {
  return Number(values.seconds) * multipliers.seconds
      + Number(values.minutes) * multipliers.minutes
      + Number(values.hours) * multipliers.hours
      + Number(values.days) * multipliers.days
}

function submit() {
  emit('update:modelValue', countDuration());
  dialog.value = false;
}
</script>

<style scoped>
.modal-header {
  font-size: 1.4em;
  background-color: rgb(var(--v-theme-modalHeader));
  padding: 15px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-header {
  color: rgb(var(--v-theme-description));
  font-size: 1.2em;
  margin-bottom: 10px;
}

.value-inputs {
  display: flex;
  flex-wrap: wrap;
}

.value-input {
  width: 80px;
  display: inline-block;
  margin-right: 30px;
}
</style>