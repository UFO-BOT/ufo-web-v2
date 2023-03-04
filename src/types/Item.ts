export interface Item {
    name: string
    newName?: string
    description: string
    price: number
    xp: number
    addRole: string | null
    removeRole: string | null
}