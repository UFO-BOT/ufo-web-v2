import {Module} from 'vuex'
import {User} from "@/types/User";
import Oauth2 from "@/utils/Oauth2";
import AvatarURL from "@/utils/AvatarURL";
import store from "@/store";

export const UserModule: Module<User, User> = {
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
            user.tag = user.username + '#' + user.discriminator;
            user.avatarURL = AvatarURL(user);
            ctx.commit('updateUser', user);
        }
    },
    mutations: {
        updateUser(state, user) {
            Object.assign(state, user)
        }
    },
    getters: {
        user(state) {
            return state
        }
    }
}