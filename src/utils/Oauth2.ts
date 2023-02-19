import {Oauth2Token} from "@/types/Oauth2Token";
import config from "@/config.json";
import {User} from "@/types/User";

export default class Oauth2 {
    public static async getToken(code: string): Promise<Oauth2Token | null> {
        let response = await fetch(config.API + '/oauth2/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                redirectURI: window.location.origin + window.location.pathname
            })
        });
        if(!response.ok) return null;
        return response.json();
    }

    public static async refreshToken(refreshToken: string): Promise<Oauth2Token | null> {
        let response = await fetch(config.API + '/oauth2/token/refresh', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken
            })
        });
        if(!response.ok) return null;
        return response.json();
    }

    public static async getUser(token: string): Promise<User | null> {
        let response = await fetch(config.DiscordAPI + '/users/@me', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        if(!response.ok) return null;
        return response.json();
    }
}