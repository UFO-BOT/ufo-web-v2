export interface Item {
    name: string
    newName?: string
    description: string
    iconUrl?: string
    requiredRoles: Array<string>
    requiredXp: number
    price: number
    xp: {
        min: number
        max: number
    }
    addRole: string | null
    removeRole: string | null
}