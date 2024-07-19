import {Module} from 'vuex'
import {Guild} from "@/types/Guild";
import config from "@/config.json";

export const GuildsModule = {
    state: {
        guilds: [] as Array<Guild>
    },

    actions: {
        async getGuilds(ctx) {
            let token = localStorage.getItem('token');
            if(!token) return;
            let response = await fetch(`${config.API}/private/guilds`, {
                headers: {
                    Authorization: token
                }
            })
            let guilds = await response.json()
            if(!response.ok) guilds = [];
            ctx.commit('updateGuilds', guilds)
        },

        async getGuild(ctx, id) {
            let token = localStorage.getItem('token');
            if(!token) return;
            let response = await fetch(`${config.API}/private/guilds/${id}/info`, {
                headers: {
                    Authorization: token
                }
            })
            let guild = await response.json()
            if(!response.ok) return;
            ctx.commit('updateGuild', guild)
        },

        async updateSettings(ctx, {id, settings}) {
            ctx.commit('updateSettings', {id, settings})
        }
    },

    mutations: {
        updateGuilds(state, guilds) {
            state.guilds = guilds
        },

        updateGuild(state, guild) {
            let index = state.guilds.indexOf(state.guilds.find(g => g.id === guild.id) as Guild)
            if(index === -1) state.guilds.push(guild)
            else state.guilds[state.guilds.indexOf(state.guilds.find(g => g.id === guild.id) as Guild)] = guild
        },

        updateSettings(state, {id, settings}) {
            let guild = state.guilds.find(g => g.id === id)
            guild.settings = JSON.parse(JSON.stringify(settings))
        }
    },

    getters: {
        guilds(state) {
            return state.guilds
        }
    }
}