import config from "@/config.json";

export function loginUrl() {
    return `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&redirect_uri=`
        + `${encodeURIComponent(window.location.origin + '/login')}&response_type=`
        + `code&scope=identify+guilds+applications.commands.permissions.update`
}