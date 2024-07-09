<template>
  <div>
    <div class="embed-actions">
      <v-btn color="primary" :disabled="props.disabled || !embed.enabled" @click="dialog = true">
        {{ $t('EmbedInput.title') }}
      </v-btn>
      <v-switch v-model="embed.enabled" class="embed-switch" color="primary" hide-details :disabled="props.disabled"/>
    </div>
    <v-dialog v-model="dialog" fullscreen>
      <v-card color="modal">
        <v-toolbar dark color="primary">
          <v-btn icon="close" @click="dialog = false"/>
          <v-toolbar-title>{{ $t('EmbedInput.title') }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn dark :disabled="valid === false" @click="submit">
              <v-icon class="btn-icon" size="large">check</v-icon>
              {{ $t('EmbedInput.done') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="embed-settings">
          <v-form v-model="valid">
            <div class="subtitle">{{ $t('EmbedInput.general') }}</div>
            <v-text-field v-model="embed.color" class="input" :label="$t('EmbedInput.embed.color')" readonly>
              <template v-slot:prepend>
                <v-icon :color="embed.color" icon="$vuetify">palette</v-icon>
              </template>
              <v-overlay v-model="colorPicker" activator="parent" :scrim="false"
                         location-strategy="connected" scroll-strategy="reposition">
                <v-color-picker v-model="embed.color" mode="hex" :modes="['hex', 'rgb', 'hsl']"/>
              </v-overlay>
            </v-text-field>
            <div class="inputs">
              <v-text-field v-model="embed.author.name" class="input" :label="$t('EmbedInput.embed.author.name')"
                            color="primary" prepend-icon="person" :counter="256" :rules="lengthRules(256)"/>
              <v-text-field v-model="embed.author.url"  class="input" :label="$t('EmbedInput.embed.author.url')"
                            color="primary" prepend-icon="link" :counter="2048" :rules="lengthRules(2048)"/>
              <v-text-field v-model="embed.author.iconUrl"  class="input" :label="$t('EmbedInput.embed.author.iconUrl')"
                            color="primary" prepend-icon="account_circle" :counter="2048" :rules="lengthRules(2048)"/>
            </div>
            <div class="inputs">
              <v-text-field v-model="embed.title"  class="input" :label="$t('EmbedInput.embed.title')"
                            color="primary" prepend-icon="title" :counter="256" :rules="lengthRules(256)"/>
              <v-text-field v-model="embed.url"  class="input" :label="$t('EmbedInput.embed.url')"
                            color="primary" prepend-icon="link" :counter="2048" :rules="lengthRules(2048)"/>
            </div>
            <div class="inputs">
              <v-text-field v-model="embed.image" class="input" :label="$t('EmbedInput.embed.image')"
                            color="primary" prepend-icon="image" :counter="2048" :rules="lengthRules(2048)"/>
              <v-text-field v-model="embed.thumbnail"  class="input" :label="$t('EmbedInput.embed.thumbnail')"
                            color="primary" prepend-icon="art_track" :counter="2048" :rules="lengthRules(2048)"/>
            </div>
            <div class="inputs">
              <v-text-field v-model="embed.footer.text"  class="input" :label="$t('EmbedInput.embed.footer.text')"
                            color="primary" prepend-icon="edit_note" :counter="2048" :rules="lengthRules(2048)"/>
              <v-text-field v-model="embed.footer.iconUrl"  class="input" :label="$t('EmbedInput.embed.footer.iconUrl')"
                            color="primary" prepend-icon="link" :counter="2048" :rules="lengthRules(2048)"/>
            </div>
            <TimestampInput v-model="embed.timestamp"/>
            <div class="subtitle">{{ $t('EmbedInput.description') }}</div>
            <TemplateInput v-model="embed.description" :variables="['member', 'guild']" :counter="2048"/>
            <div class="subtitle">{{ $t('EmbedInput.fields') }}</div>
            <v-expansion-panels v-if="embed.fields.length" class="fields" variant="accordion" multiple>
              <v-expansion-panel v-for="(field, i) in embed.fields" bg-color="block">
                <v-expansion-panel-title class="field-number" :ripple="!fieldRemove" :readonly="fieldRemove">
                  {{ $t('EmbedInput.field') }} {{ i + 1 }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-text-field v-model="field.name" class="field-name" :label="$t('EmbedInput.embed.field.name')"
                                color="primary" :counter="256" :rules="fieldNameRules"/>
                  <TemplateInput v-model="field.value" :variables="['member', 'guild']" :counter="1024" required
                                 :label="$t('EmbedInput.embed.field.value')"/>
                  <div class="field-actions">
                    <v-checkbox v-model="field.inline" color="primary" :label="$t('EmbedInput.embed.field.inline')"
                                density="comfortable" hide-details/>
                    <v-btn icon="delete" variant="text" color="red" size="x-large" density="comfortable"
                           @click="embed.fields.splice(i, 1)"/>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-btn v-if="embed.fields.length < 25" icon="add" variant="tonal" color="success" @click="addField"/>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineModel, ref} from "vue";
import TemplateInput from "@/components/TemplateInput.vue";
import {Embed, EmbedTimestamp} from "@/types/Embed";
import i18n from "@/plugins/i18n";
import TimestampInput from "@/components/TimestampInput.vue";

const props = defineProps<{ modelValue: Embed, disabled?: boolean }>()
let embed = defineModel<Embed>()
let dialog = ref(false)
let valid = ref(true)
let colorPicker = ref(false)
let fieldRemove = ref(false)

function lengthRules(length: number) {
  return [(str: string) => (str.length <= length || i18n.global.t('EmbedInput.errors.invalidLength')
      .replace("[length]", String(length)))]
}

const fieldNameRules = [
  (name: string) => (name.length > 0 || i18n.global.t('EmbedInput.errors.nameRequired')),
  (name: string) => (name.length <= 256 || i18n.global.t('EmbedInput.errors.invalidLength').replace("[length]", "256"))
]

if (!embed.value?.enabled) embed.value = {
  enabled: false,
  color: '#00a6ff',
  author: {name: '', url: '', iconUrl: ''},
  title: '', url: '',
  description: '',
  fields: [],
  image: '', thumbnail: '',
  footer: {text: '', iconUrl: ''},
  timestamp: {type: null, date: new Date(), template: "{{member.created}}"} as EmbedTimestamp
}

function addField() {
  embed.value!.fields!.push({name: '', value: '', inline: false})
}

function submit() {
  embed.value!.fields!.filter(f => !f.name.trim().length || !f.value.trim().length)
      .map(f => embed.value!.fields!.splice(embed.value?.fields?.indexOf(f), 1))
  dialog.value = false;
}
</script>

<style scoped>
.embed-actions {
  display: flex;
  justify-content: left;
  align-items: center;
}

.embed-switch {
  margin-left: 15px;
}

.btn-icon {
  margin-right: 5px;
}

.embed-settings {
  padding: 15px;
}

.subtitle {
  font-size: 1.2em;
  margin-top: 5px;
  margin-bottom: 10px;
}

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

.fields {
  margin-bottom: 10px;
}

.field-number {
  font-size: 1.1em;
  padding: 26px 26px!important;
}

.field-name {
  margin-top: 10px;
}

.field-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>