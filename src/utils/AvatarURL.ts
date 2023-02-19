import {User} from "@/types/User";

export default function AvatarURL(user: User) {
    if(user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.` +
        `${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`
    else return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator, 10)%5}.png`
}