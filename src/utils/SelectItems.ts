import {Role} from "@/types/Role";
import {SelectItem} from "@/types/SelectItem";

export default class SelectItems {
    public static roles(roles: Array<Role>): Array<SelectItem> {
        let rolesItems: Array<SelectItem> = roles.map(role => {return {
            title: role.name,
            value: role.id,
            props: {
                disabled: !role.memberManageable || !role.botManageable
            }
        }})
        rolesItems.push({
            title: '-',
            value: null
        })
        return rolesItems;
    }
}