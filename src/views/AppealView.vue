<template>
  <div class="appeal-content">
    <v-progress-circular v-if="loading" class="item-center" size="60" width="5" indeterminate/>
    <div v-else>
      <div v-if="message.length" class="message-text">
        <span v-if="message.includes('not banned')">{{ $t('Appeal.errors.notBanned') }}</span>
        <span v-else-if="message.includes('been submitted')">{{ $t('Appeal.errors.submitted') }}</span>
        <span v-else-if="message.includes('been declined')">{{ $t('Appeal.errors.declined') }}</span>
        <span v-else-if="message.includes('successfully')" class="success-message">{{ $t('Appeal.submitted') }}</span>
        <span v-else>{{ $t('Appeal.errors.submitError') }}</span>
      </div>
      <v-form v-else v-model="valid" class="questions">
        <div class="name">{{ $t('Appeal.name') }}</div>
        <div class="appeal-description">
          {{ $t('Appeal.description') }}
        </div>
        <div v-for="(question, i) in questions[$i18n.locale]">
          <div class="question">{{ i+1 }}. {{ question }}</div>
          <v-textarea v-model="answers[i]" :label="$t('Appeal.answer')" color="primary" :rules="answerRules"
                      :counter="500"/>
        </div>
        <v-btn class="submit" :disabled="valid === false || !answers.find(a => a.trim().length)" size="large"
               color="secondary" :loading="submitting" @click="submit">
          <v-icon class="save-icon">mail_outline</v-icon>
          {{ $t('Appeal.submit') }}
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import config from "@/config.json";
import i18n from "@/plugins/i18n";

let loading = ref(true)
let valid = ref(true)
let submitting = ref(false)
let message = ref('')
let questions = ref({})
let answers = ref(Array(4).fill(''))

const answerRules = [
  (answer: string) => ((answer.length > 0 && answer.length <= 500) || i18n.global.t('Appeal.errors.invalidAnswer'))
]

onMounted(async () => {
  let response = await fetch(`${config.API}/private/support/appeal`, {
    headers: {
      Authorization: localStorage.getItem('token') as string
    }
  })
  let body = await response.json()
  if (!response.ok) message.value = body.message
  else questions.value = body.questions
  loading.value = false
})

async function submit() {
  submitting.value = true
  console.log(answers.value)
  let response = await fetch(`${config.API}/private/support/appeal`,
      {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token') as string,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          answers: answers.value
        })
      })
  let body = await response.json()
  message.value = body.message
  submitting.value = false
}
</script>

<style scoped>
.appeal-content {
  padding: 15px;
}

.message-text {
  color: red;
  font-size: 1.6em;
  text-align: center;
}

.success-message {
  color: limegreen;
}

.name {
  font-size: 1.8em;
}

.appeal-description {
  font-size: 1.2em;
  color: rgb(var(--v-theme-description));
  margin-bottom: 15px;
}

.questions {
  max-width: 95%;
}

.question {
  color: grey;
  margin-bottom: 5px;
}

.save-icon {
  margin-right: 5px;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>