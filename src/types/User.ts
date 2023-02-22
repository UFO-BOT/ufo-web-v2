export interface User {
    id: string
    username: string
    discriminator: string
    tag?: string
    avatar: string | null
    avatarURL?: string
    mfa_enabled?: boolean
    banner?: string | null
    accent_color?: number | null
    locale?: string
    verified?: boolean
    email?: string | null
    flags?: number
    premium_type?: 0 | 1 | 2
    public_flags?: number

    botBadges?: []
}