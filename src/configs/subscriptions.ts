import {SubscriptionMonths} from "@/types/SubscriptionMonths";
import {SubscriptionType} from "@/types/SubscriptionType";

const subscriptions: Record<SubscriptionType, {boosts: number, months: Array<SubscriptionMonths>}> = {
    standard: {
        boosts: 2,
        months: [
            {count: 1, price: 59, name: {ru: '1 месяц', en: '1 month'}},
            {count: 3, price: 168, name: {ru: '3 месяца', en: '3 months'}},
            {count: 6, price: 318, name: {ru: '6 месяцев', en: '6 months'}},
            {count: 12, price: 602, name: {ru: '1 год', en: '1 year'}}
        ]
    },
    premium: {
        boosts: 4,
        months: [
            {count: 1, price: 99, name: {ru: '1 месяц', en: '1 month'}},
            {count: 3, price: 282, name: {ru: '3 месяца', en: '3 months'}},
            {count: 6, price: 534, name: {ru: '6 месяцев', en: '6 months'}},
            {count: 12, price: 1010, name: {ru: '1 год', en: '1 year'}}
        ]
    }
}

export default subscriptions
