<template>
  <div>
    <v-select color="primary" prepend-icon="schedule" :items="items" :label="$t('TimestampInput.label')"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import i18n from "@/plugins/i18n";

const props = defineProps<{}>()
const route = useRoute()
const store = useStore()
let date = defineModel<string>()
let items = [
  {
    title: i18n.global.t('TimestampInput.items.custom.name'),
    props: {subtitle: i18n.global.t('TimestampInput.items.custom.description')},
    value: "custom"
  },
  {
    title: i18n.global.t('TimestampInput.items.current.name'),
    props: {subtitle: i18n.global.t('TimestampInput.items.current.description')},
    value: "current"
  },
  {
    title: "{{member.created}}",
    props: {subtitle: i18n.global.t('TimestampInput.items.memberCreated')},
    value: "{{member.created}}"
  },
  {
    title: "{{member.joined}}",
    props: {subtitle: i18n.global.t('TimestampInput.items.memberJoined')},
    value: "{{member.joined}}"
  },
  {
    title: "{{guild.created}}",
    props: {subtitle: i18n.global.t('TimestampInput.items.memberCreated')},
    value: "{{guild.created}}"
  }
]
</script>

<style scoped>

</style>