import {SubscriptionType} from "@/types/SubscriptionType";

export interface SubscriptionViewResponse {
    subscription: null | {
        id: string
        type: SubscriptionType
        ends: string
    }
}
