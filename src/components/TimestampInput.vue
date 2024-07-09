<template>
  <div>
    <div class="inputs">
      <v-select v-model="timestamp.type" class="input" color="primary" prepend-icon="schedule" :items="items"
                clearable :label="$t('TimestampInput.label')"/>
      <v-select v-if="timestamp.type === 'template'" v-model="timestamp.template" class="input" color="primary"
                prepend-icon="data_object" :items="variables" :label="$t('TimestampInput.variable')"/>
      <v-text-field v-if="timestamp.type === 'custom'" v-model="formatted" class="input" color="primary"
                    readonly prepend-icon="calendar_month" :label="$t('TimestampInput.date')">
        <v-overlay v-model="datePicker" activator="parent" :scrim="false"
                   location-strategy="connected" scroll-strategy="reposition">
          <v-date-picker v-model="timestamp.date" @update:modelValue="datePicker = false"/>
        </v-overlay>
      </v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineModel, ref} from "vue";
import {useDate} from "vuetify";
import i18n from "@/plugins/i18n";
import {EmbedTimestamp} from "@/types/Embed";

const props = defineProps<{}>()
const date = useDate()
let timestamp = defineModel<EmbedTimestamp>()
let datePicker = ref(false)
let formatted = computed(() => date.format(timestamp.value?.date, 'fullDateWithWeekday'))

if (timestamp.value?.type != "custom") timestamp.value.date = new Date()

const items = [
  {
    title: i18n.global.t('TimestampInput.items.current'),
    value: "current"
  },
  {
    title: i18n.global.t('TimestampInput.items.custom'),
    value: "custom"
  },
  {
    title: i18n.global.t('TimestampInput.items.template'),
    value: "template"
  }
]
const variables = [
  {
    title: "{{member.created}}",
    props: {subtitle: i18n.global.t('TimestampInput.variables.memberCreated')},
    value: "{{member.created}}"
  },
  {
    title: "{{member.joined}}",
    props: {subtitle: i18n.global.t('TimestampInput.variables.memberJoined')},
    value: "{{member.joined}}"
  },
  {
    title: "{{guild.created}}",
    props: {subtitle: i18n.global.t('TimestampInput.variables.guildCreated')},
    value: "{{guild.created}}"
  }
]
</script>

<style scoped>
.inputs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.input {
  margin-right: 25px;
  margin-top: 10px;
  flex-basis: 20em;
}
</style>