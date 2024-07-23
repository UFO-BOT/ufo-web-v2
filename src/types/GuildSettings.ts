import {Language} from "@/types/Language";
import {CommandSettings} from "@/types/CommandSettings";
import {Embed} from "@/types/Embed";

export interface GuildLanguage {
    commands: Language
    interface: Language
}

interface WarnsPunishment {
    warns: number
    punishment: {
        type: 'mute' | 'kick' | 'ban',
        duration: number
    }
}

interface AutoModMessage {
    enabled: boolean
    channel?: string | null
    template?: string
}

interface AutoModPunishment {
    enabled: boolean
    type?: 'warn' | 'mute' | 'kick' | 'ban'
    duration?: number
    reason?: string
}

interface AutoModWhitelist {
    roles: Array<string>
    channels: Array<string>
}

interface AutoModeration {
    enabled: boolean
    deleteMessages?: boolean
    message?: AutoModMessage
    punishment?: AutoModPunishment
    whitelist?: AutoModWhitelist
    options?: object
}

export interface GuildAutoModeration {
    invites: AutoModeration
    flood: AutoModeration
}

export interface AutoModInvitesOptions {
    whitelistGuilds: Array<string>
}

export interface AutoModFloodOptions {
    messages: number
    symbols: number
}

interface Greeting {
    enabled: boolean
    message?: string
    embed?: Embed
}

interface GuildGreeting extends Greeting {
    channel?: string
}

interface GuildGreetings {
    join: GuildGreeting
    leave: GuildGreeting
    dm: Greeting
    joinRoles: Array<string>
}

interface PunishmentMessage {
    enabled: boolean
    message?: string
    embed?: Embed
}

export interface GuildSettings {
    prefix: string
    language: GuildLanguage
    moneySymbol: string
    work: {
        min: number
        max: number
        cooldown: number
    }
    moneybags: {
        min: number
        max: number
        cooldown: number
    }
    commission: number
    minBet: number
    commands: Record<string, CommandSettings>
    muteRole: string
    useTimeout: boolean
    warnsPunishments: Array<WarnsPunishment>
    autoModeration: GuildAutoModeration
    logs: {
        list: Record<string, {
            enabled: boolean
            channel: string | null
        }>
        ignore: {
            channels: Array<string>
        }
    }
    greetings: GuildGreetings
    boost: boolean
    messageXp: {
        chance: number
        min: number
        max: number
    }
    moneyBonuses: {
        daily: number
        weekly: number
    }
    punishmentMessages: {
        kick: PunishmentMessage
        ban: PunishmentMessage
    }
}