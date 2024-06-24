import {Role} from "@/types/Role";
import {SelectItem} from "@/types/SelectItem";
import {Channel} from "@/types/Channel";

export default class SelectItems {
    public static roles(roles: Array<Role>, none = true): Array<SelectItem> {
        let rolesItems: Array<SelectItem> = roles.map(role => {return {
            title: role.name,
            value: role.id,
            props: {
                disabled: !role.memberManageable || !role.botManageable
            }
        }})
        rolesItems.push({
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
        if (none) channelsItems.push({
            title: '-',
            value: null
        })
        return channelsItems;
    }
}