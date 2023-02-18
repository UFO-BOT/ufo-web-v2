import {Language} from "@/types/Language";

export enum CommandCategory {
    General = 'general',
    Economy = 'economy',
    Moderation = 'moderation',
    Utilities = 'utilities',
    Games = 'games'
}

export interface CommandOptionChoiceConfig {
    name: string
    value: string
}

export interface CommandOptionConfig {
    name: string
    description: string
    choices?: Array<CommandOptionChoiceConfig>
}

export interface CommandOption {
    type: any
    validationType?: any
    name: string
    config: Record<Language, CommandOptionConfig>
    minValue?: number
    maxValue?: number
    minLength?: number
    maxLength?: number
    options?: Array<CommandOption>
    required?: boolean
}

export interface CommandConfig {
    name: string
    description: string
    aliases: Array<string>
}

export interface Command {
    config: Record<Language, CommandConfig>
    options: Array<CommandOption>
    category: CommandCategory
    defaultMemberPermissions?: Array<string>
    botPermissions?: Array<string>
    deferReply?: boolean
    boostRequired?: boolean
}