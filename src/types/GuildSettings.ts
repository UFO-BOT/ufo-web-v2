import {Language} from "@/types/Language";

export interface GuildLanguage {
    commands: Language
    interface: Language
}

export interface GuildSettings {
    prefix: string
    language: GuildLanguage
    moneySymbol: string
    muteRole: string
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
    duelCommission: boolean
    minBet: number
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