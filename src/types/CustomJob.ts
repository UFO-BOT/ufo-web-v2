export interface CustomJob {
    name: string
    newName?: string
    description: string
    message: string
    hideOptions?: boolean
    thumbnailUrl?: string
    salary: {
        min: number
        max: number
    }
    cooldown: number
    requiredXp: number
    requiredRoles: Array<string>
}