<template>
  <div class="center">
    <div class="header"><b>{{ $t('Commands.name') }}</b></div>
    <v-progress-circular v-if="!commands.length" size="60" width="5" indeterminate/>
    <v-expansion-panels v-if="commands.length" class="commands item-center" variant="accordion">
      <v-expansion-panel v-for="(category, i) of categories" bg-color="block">
        <v-expansion-panel-title class="category">
          <v-icon class="category-icon">{{ icons[i] }}</v-icon>
          {{ $t(`Commands.categories.${category}`) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div v-for="(command, j) in commands.filter(cmd => cmd.category === category)">
            <div  class="command">
              <div>{{ command.config[$i18n.locale].name }}</div>
              <v-icon class="info-icon" @click="dialogs[command.config.en.name] = !dialogs[command.config.en.name]">
                info
              </v-icon>
              <v-dialog v-model="dialogs[command.config.en.name]" width="500" scrollable>

                <v-card color="modal">

                  <v-card-title class="cmd-name">
                    {{ command.config[$i18n.locale].name }}
                    <v-btn icon variant="text" v-if="command.boostRequired">
                      <v-tooltip content-class="tooltip" activator="parent" location="top">
                        {{ $t('Commands.boostRequired') }}
                      </v-tooltip>
                      <v-icon size="30" color="#7777ff">favorite</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text class="cmd-info">
                    <div class="cmd-info-title">{{ $t('Commands.description') }}</div>
                    <div class="cmd-info-text">{{ command.config[$i18n.locale].description }}</div>
                    <div class="cmd-info-title">{{ $t('Commands.usage') }}</div>
                    <div class="cmd-info-text"><code>{{ GetUsage(command) }}</code></div>
                    <div class="cmd-info-title">{{ $t('Commands.aliases') }}</div>
                    <div class="cmd-info-text">
                      <v-chip v-for="a in command.config[$i18n.locale].aliases" class="alias" variant="elevated"
                              color="secondary">
                        {{ a }}
                      </v-chip>
                    </div>
                    <div v-if="command.defaultMemberPermissions?.length">
                      <div class="cmd-info-title">{{ $t('Commands.permissions') }}</div>
                      <div class="cmd-info-text" v-html="ParsePerms(command)"></div>
                    </div>
                  </v-card-text>

                  <v-divider class="blue-grey darken-3"></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogs[command.config.en.name] = false">{{ $t('Commands.close') }}</v-btn>
                  </v-card-actions>

                </v-card>

              </v-dialog>
            </div>
            <v-divider v-if="j < commands.filter(c => c.category === category).length-1"/>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, Ref, ref} from "vue";
import config from "@/config.json";
import {Command} from "@/types/Command";
import {ReactiveVariable} from "vue/macros";
import GetUsage from "@/utils/GetUsage";
import ParsePerms from "@/utils/ParsePerms";

const categories = ['general', 'economy', 'games', 'utilities', 'moderation'];
const icons = ['public', 'attach_money', 'phone_iphone', 'build', 'security'];
let commands: Ref<Array<Command>> = ref([]);
let dialogs: ReactiveVariable<Record<string, boolean>> = reactive({a: false});

onMounted(async () => {
  let response = await fetch(config.API + '/public/commands');
  commands.value = await response.json();
})
</script>

<style scoped>
.header {
  margin: 7px 0 12px 0;
  font-size: 2.5em;
}

.category {
  font-size: 1.9em;
  padding: 26px 26px!important;
}

.category-icon {
  margin-right: 10px;
}

.commands {
  max-width: 1000px;
  width: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.command {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4em;
  margin-top: 5px;
  margin-bottom: 5px;
  word-break: break-all;
}

.info-icon {
  cursor: pointer;
}

.cmd-name {
  font-size: 1.8em;
  background-color: rgb(var(--v-theme-modalHeader));
  padding: 15px 20px 10px;
}

.cmd-info {
  padding-top: 10px;
  font-size: 1.4em!important;
  color: rgb(var(--v-theme-description));
}

.cmd-info-title {
  font-weight: bold;
}

.cmd-info-text {
  margin-bottom: 12px;
}

.alias {
  margin-right: 5px;
  font-size: 0.7em!important;
}
</style>