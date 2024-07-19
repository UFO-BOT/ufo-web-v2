<template>
  <div class="commands">
    <v-progress-circular  v-if="!commands.length" class="item-center" size="60" width="5" indeterminate/>
    <v-alert v-if="unauthorized" class="alert" border="start" color="error" variant="tonal"
             :title="$t(`GuildCommands.errors.title`)">
      {{$t(`GuildCommands.errors.description1`)}}
      <a :href="`https://discord.com/api/oauth2/authorize?client_id=${config.botID}&redirect_uri=` +
      `${encodeURIComponent(location + '/login')}&response_type=`+
      `code&scope=identify+guilds+applications.commands.permissions.update`"
         target="_blank" class="link">{{$t(`GuildCommands.errors.link`)}}</a>
      {{$t(`GuildCommands.errors.description2`)}}
    </v-alert>
    <v-expansion-panels v-if="commands.length" variant="accordion">
      <v-expansion-panel v-for="(category, i) of categories" bg-color="block">
        <v-expansion-panel-title class="category" ripple>
          <v-icon class="category-icon">{{ icons[i] }}</v-icon>
          {{ $t(`GuildCommands.categories.${category}`) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div v-for="(command, j) in commands.filter(cmd => cmd.category === category)">
            <div  class="command">
              <div>{{settings.prefix}}{{ command.config[settings.language.commands].name }}</div>
              <GuildCommand :name="settings.prefix + command.config[settings.language.commands].name"
                            :command="settings.commands[command.config.en.name]" @update="commandUpdated"/>
            </div>
            <v-divider v-if="j < commands.filter(c => c.category === category).length-1"/>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import GuildCommand from "@/components/commands/GuildCommand"
import SelectItems from "@/utils/SelectItems";
import {computed, onMounted, Reactive, reactive, Ref, ref} from "vue";
import {Guild} from "@/types/Guild";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import { GuildSettings} from "@/types/GuildSettings";
import {Command} from "@/types/Command";
import {SubmitResult} from "@/types/SubmitResult";
import config from "@/config.json";
import {CommandSettings} from "@/types/CommandSettings";

const props = defineProps<{ settings: GuildSettings }>()
const emit = defineEmits(['submitted'])
const route = useRoute()
const store = useStore()
const location = window.location.origin
let guild = computed(() => (store.getters.guilds as Array<Guild>).find(g => g.id === route.params.id));
let roles = SelectItems.roles(guild.value!.roles!, false)
let commands = computed(() => (store.getters.commands as Array<Command>));
let settings: Reactive<GuildSettings> = reactive(JSON.parse(JSON.stringify(props.settings)));
let unauthorized = ref(false);
const categories = ['general', 'economy', 'games', 'utilities', 'moderation'];
const icons = ['public', 'attach_money', 'phone_iphone', 'build', 'security'];

function commandUpdated(result: SubmitResult, status: number, command: CommandSettings) {
  if(result === 'success') {
    settings.commands[command.name] = command
    emit('submitted', result, settings)
  }
  else emit('submitted', 'error')
  unauthorized.value = status === 401
}

onMounted(async () => {
  if (!commands.value?.length) await store.dispatch('getCommands')
  commands.value.forEach(command => {
    if (!settings.commands[command.config.en.name]) settings.commands[command.config.en.name] = {
      name: command.config.en.name,
      enabled: true,
      deleteUsage: false,
      allowedRoles: [],
      forbiddenRoles: [],
      allowedChannels: [],
      forbiddenChannels: []
    }
  })
})
</script>

<style scoped>
.alert {
  margin-bottom: 15px;
  text-align: justify;
}

.link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.category {
  font-size: 1.4em;
  padding: 26px 26px!important;
}

.category-icon {
  margin-right: 10px;
}

.commands {
  width: 95%;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 10px;
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
</style>