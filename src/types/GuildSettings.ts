import {Language} from "@/types/Language";
import {CommandSettings} from "@/types/CommandSettings";

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

interface AutoModPunishment {
    type: 'warn' | 'mute' | 'kick' | 'ban'
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

export interface GuildSettings {
    prefix: string
    language: GuildLanguage
    moneySymbol: string
    work: {
        low: number
        high: number
        cooldown: number
    }
    moneybags: {
        low: number
        high: number
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
    boost: boolean
}