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
    boost: boolean
}