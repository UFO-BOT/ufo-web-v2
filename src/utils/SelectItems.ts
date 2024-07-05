import {Role} from "@/types/Role";
import {SelectItem} from "@/types/SelectItem";
import {Channel} from "@/types/Channel";

export default class SelectItems {
    public static roles(roles: Array<Role>, none = true, checkManageable = true): Array<SelectItem> {
        let rolesItems: Array<SelectItem> = roles.map(role => {return {
            title: role.name,
            value: role.id,
            props: {
                disabled: checkManageable && (!role.memberManageable || !role.botManageable)
            }
        }})
        if (none) rolesItems.unshift({
            title: '-',
            value: null
        })
        return rolesItems;
    }

    public static channels(channels: Array<Channel>, none = true, checkBotManageable = true): Array<SelectItem> {
        let channelsItems: Array<SelectItem> = []
        channels.forEach(channel => {
            if (!channel.botManageable && checkBotManageable) return
            channelsItems.push({title: channel.name, value: channel.id})
        })
        if (none) channelsItems.unshift({
            title: '-',
            value: null
        })
        return channelsItems;
    }
}