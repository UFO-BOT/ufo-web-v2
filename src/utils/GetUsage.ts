import {Command} from "@/types/Command";
import i18n from "@/plugins/i18n";

export default function GetUsage(cmd: Command): string {
    let usage = cmd.config[i18n.global.locale.value].name;
    cmd.options.forEach(option => {
        let config = option.config[i18n.global.locale.value]
        let name = config.choices?.length ? config.choices.map(c => c.name).join(" | ") : config.name
        usage += ` ${option.required ? "<" : "["}${name}${option.required ? ">" : "]"}`
    })
    return usage;
}