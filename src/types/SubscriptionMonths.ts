import {Language} from "@/types/Language";

export interface SubscriptionMonths {
    count: 1 | 3 | 6 | 12
    price: number
    name: Record<Language, string>
}
