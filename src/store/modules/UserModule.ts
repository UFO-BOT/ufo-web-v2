import {Module} from 'vuex'
import {User} from "@/types/User";
import Oauth2 from "@/utils/Oauth2";
import AvatarURL from "@/utils/AvatarURL";
import config from "@/config.json";

export const UserModule = {
    state: {
        user: {} as User
    },

    actions: {
        async getUser(ctx) {
            let token = localStorage.getItem('token')
            if(!token) return;
            let user = await Oauth2.getUser(token);
            if(!user) {
                let refreshToken = localStorage.getItem('refreshToken')
                if(!refreshToken) return;
                let token = await Oauth2.refreshToken(refreshToken);
                if(!token) return;
                localStorage.setItem('token', token.accessToken)
                localStorage.setItem('refreshToken', token.refreshToken)
                user = await Oauth2.getUser(token.accessToken);
            }
            if(!user) return;
            user.avatarURL = AvatarURL(user);
            ctx.commit('updateUser', user);
        },

        async getUserBadges(ctx) {
            let token = localStorage.getItem('token');
            if(!token) return;
            let response = await fetch(`${config.API}/private/badges`, {
                headers: {
                    Authorization: token
                }
            })
            let badges = await response.json()
            if(!response.ok) badges = [];
            ctx.commit('updateBadges', badges)
        }
    },

    mutations: {
        updateUser(state, user) {
            state.user = Object.assign(state.user, user)
        },

        updateBadges(state, badges) {
            state.user.botBadges = badges
        }
    },

    getters: {
        user(state) {
            return state.user
        }
    }
}