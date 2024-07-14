<template>
  <div>
    <div class="buttons">
      <v-btn class="button" icon variant="text" size="40" :disabled="props.disabled">
        <v-icon>alternate_email</v-icon>
        <v-tooltip activator="parent" location="top">{{ $t(`TemplateInput.tooltips.role`) }}</v-tooltip>
        <v-overlay v-model="roleSelect" activator="parent" :scrim="false"
                   location-strategy="connected" scroll-strategy="reposition">
          <v-list :items="roles" :max-height="300" :disabled="!roleSelect" @click:select="roleMention"/>
        </v-overlay>
      </v-btn>
      <v-btn class="button" icon variant="text" size="40" :disabled="props.disabled">
        <v-icon>tag</v-icon>
        <v-tooltip activator="parent" location="top">{{ $t(`TemplateInput.tooltips.channel`) }}</v-tooltip>
        <v-overlay v-model="channelSelect" activator="parent" :scrim="false"
                   location-strategy="connected" scroll-strategy="reposition">
          <v-list :items="channels" :max-height="300" :disabled="!channelSelect" @click:select="channelMention"/>
        </v-overlay>
      </v-btn>
      <v-btn class="button" icon variant="text" size="40" :disabled="props.disabled">
        <v-icon>data_object</v-icon>
        <v-tooltip activator="parent" location="top">{{ $t(`TemplateInput.tooltips.variable`) }}</v-tooltip>
        <v-overlay v-model="variableSelect" activator="parent" :scrim="false"
                   location-strategy="connected" scroll-strategy="reposition">
          <v-list :items="channels" :max-height="300" :disabled="!variableSelect" @click:select="channelMention">
            <div v-for="name in variablesList">
              <v-list-subheader>
                {{ $t(`TemplateInput.variables.${name}.name`) }}
              </v-list-subheader>
              <v-list-item v-for="variable in $tm(`TemplateInput.variables.${name}.list`)"
                           @click="variableAdd($rt(variable.name))">
                <v-list-item-title>
                  <span v-pre>{{</span><span>{{ $rt(variable.name) }}</span><span v-pre>}}</span>
                </v-list-item-title>
                <v-list-item-subtitle>{{ $rt(variable.description) }}</v-list-item-subtitle>
              </v-list-item>
            </div>
          </v-list>
        </v-overlay>
      </v-btn>
      <v-btn class="button" icon variant="text" size="40" href="https://docs.ufobot.ru/articles/variables"
             :disabled="props.disabled" target="_blank">
        <v-icon>help_outline</v-icon>
        <v-tooltip activator="parent" location="top">{{ $t(`TemplateInput.tooltips.docs`) }}</v-tooltip>
      </v-btn>
    </div>
    <v-textarea v-model="template" ref="textarea" class="template" :disabled="props.disabled" :rules="rules"
                :label="props.label ?? $t(`TemplateInput.template`)" color="primary" :counter="props.counter"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {VTextarea} from "vuetify/lib/components";
import {useRoute} from "vue-router";
import SelectItems from "@/utils/SelectItems";
import {useStore} from "vuex";
import {Guild} from "@/types/Guild";
import {ListItemSelect} from "@/types/ListItemSelect";
import {TemplateVariable} from "@/types/TemplateVariable";
import i18n from "@/plugins/i18n";

const props = defineProps<{ variables: Array<TemplateVariable>, counter?: number, label?: string, required?: boolean
  disabled?: boolean }>()
const route = useRoute()
const store = useStore()
let template = defineModel<string>({default: ''})
let textarea = ref<VTextarea | null>(null)
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!, false, false)
let channels = SelectItems.channels(guild.value!.channels!, false, false)
let roleSelect = ref(false);
let channelSelect = ref(false);
let variableSelect = ref(false);

if (!template.value) template.value = ''

const variablesList = Object.keys(i18n.global.tm('TemplateInput.variables'))
    .filter(v => props.variables.includes(v as TemplateVariable))

const rules = [
  (template: string) => ((!props.required || template.length > 0) || i18n.global.t('TemplateInput.errors.required')),
  (template: string) => (template.length <= props.counter ||
      i18n.global.t('TemplateInput.errors.invalidLength').replace("[length]", props.counter.toString()))
]

function roleMention(role: ListItemSelect) {
  let pos = textarea.value!.selectionStart
  let len = template.value?.length
  template.value = template.value?.substring(0, pos) + `<@&${role.id}>` + template.value?.substring(pos, len)
  roleSelect.value = false
}

function channelMention(channel: ListItemSelect) {
  let pos = textarea.value!.selectionStart
  let len = template.value?.length
  template.value = template.value?.substring(0, pos) + `<#${channel.id}>` + template.value?.substring(pos, len)
  channelSelect.value = false
}

function variableAdd(variable: string) {
  let pos = textarea.value!.selectionStart
  let len = template.value?.length
  template.value = template.value?.substring(0, pos) + '{{' + variable + '}}' + template.value?.substring(pos, len)
  variableSelect.value = false
}
</script>

<style scoped>
.buttons {
  margin-bottom: 5px;
}

.button {
  margin-right: 5px;
}
</style>