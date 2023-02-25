import {Role} from "@/types/Role";
import {Channel} from "@/types/Channel";
import {GuildSettings} from "@/types/GuildSettings";

export interface Guild {
    id: string
    name: string
    icon: string
    invited: boolean
    manageable: boolean

    roles?: Array<Role>
    channels?: Array<Channel>
    settings?: GuildSettings
}