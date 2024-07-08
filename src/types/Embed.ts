export interface EmbedAuthor {
    name: string
    url?: string
    iconUrl?: string
}

export interface EmbedField {
    name: string
    value: string
    inline?: boolean
}

export interface EmbedFooter {
    text: string
    iconUrl?: string
}

export interface EmbedTimestamp {
    type: "custom" | "current" | "template"
    date?: Date
    template?: string
}

export interface Embed {
    enabled: boolean
    color?: `#${string}`
    author?: EmbedAuthor
    title?:  string
    url?: string
    description?: string
    fields?: Array<EmbedField>
    image?: string
    thumbnail?: string
    footer?: EmbedFooter
    timestamp?: EmbedTimestamp
}