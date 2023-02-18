export interface BotStats {
    guilds: number
    users: number
    channels: number
    emojis: number
}

export interface Ping {
    bot: number
    database: number
}

export interface Shard extends BotStats {
    id: number
    memory: number
    ping: number
    ready: boolean
}

export interface Stats {
    stats: BotStats
    ping: Ping
    shards: Array<Shard>
}