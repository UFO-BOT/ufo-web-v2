<template>
  <div>
    <v-form v-model="valid">
      <div class="subtitle">{{ $t('GuildGeneral.subtitles.prefix') }}</div>
      <v-text-field v-model="settings.prefix" class="prefix" color="primary" counter="20" :rules="prefixRules"
                    :label="$t('GuildGeneral.subtitles.prefix')"/>
      <div class="subtitle">{{ $t('GuildGeneral.subtitles.language') }}</div>
      <v-select v-model="settings.language.commands" class="language" color="primary" :items="languageItems"
                :label="$t('GuildGeneral.subtitles.commands')"/>
      <v-select v-model="settings.language.interface" class="language" color="primary" :items="languageItems"
                :label="$t('GuildGeneral.subtitles.interface')"/>
      <v-btn class="submit" :disabled="valid === false" :loading="submitting" size="large" color="secondary"
             @click="submit">
        <v-icon class="save-icon">save</v-icon>
        {{ $t('GuildGeneral.submit') }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import {computed, Reactive, reactive, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {GuildSettings} from "@/types/GuildSettings";
import config from "@/config.json";
import i18n from "@/plugins/i18n";

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute();
let settings: Reactive<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let valid = ref(true);
let submitting = ref(false);
const languageItems = computed(() => [
  {title: i18n.global.t('GuildGeneral.ru'), value: 'ru'},
  {title: i18n.global.t('GuildGeneral.en'), value: 'en'}
]);

const prefixRules = [
  (prefix: string) => !!prefix || i18n.global.t('GuildGeneral.errors.noPrefix'),
  (prefix: string) => prefix.length < 20 || i18n.global.t('GuildGeneral.errors.prefixLength'),
  (prefix: string) => !prefix.match(/[`| ]/gmi) || i18n.global.t('GuildGeneral.errors.invalidChars'),
]

async function submit() {
  submitting.value = true;
  let response = await fetch(`${config.API}/private/guilds/${route.params.id}/general`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          prefix: settings.prefix,
          language: settings.language
        })
      })
  if(response.ok) emit('submitted', 'success', settings)
  else emit('submitted', 'error')
  submitting.value = false;
}
</script>

<style scoped>
.subtitle {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.prefix {
  width: 80%;
}

.language {
  width: 250px;
}

.save-icon {
  margin-right: 5px;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>