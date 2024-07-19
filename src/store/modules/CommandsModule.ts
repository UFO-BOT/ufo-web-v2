import {Module} from 'vuex'
import {Command} from "@/types/Command";
import config from "@/config.json";

export const CommandsModule = {
    state: {
        commands: [] as Array<Command>
    },

    actions: {
        async getCommands(ctx) {
            let response = await fetch(config.API + '/public/commands');
            if (!response.ok) return
            let commands = await response.json();
            ctx.commit('updateCommands', commands);
        }
    },

    mutations: {
        updateCommands(state, commands) {
            state.commands = commands
        }
    },

    getters: {
        commands(state) {
            return state.commands
        }
    }
}