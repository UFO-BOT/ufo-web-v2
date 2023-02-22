import {Module} from 'vuex'
import {Guild} from "@/types/Guild";
import config from "@/config.json";

export const GuildsModule: Module<Array<Guild>, any> = {
    state: [],
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
        }
    },
    mutations: {
        updateGuilds(state, guilds) {
            Object.assign(state, guilds)
        }
    },
    getters: {
        guilds(state) {
            return state
        }
    }
}