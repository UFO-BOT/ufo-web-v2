import { createI18n } from "vue-i18n"

import en from "@/locales/en.json"
import ru from "@/locales/ru.json"
import {Language} from "@/types/Language";

export default createI18n({
    legacy: false,
    fallbackLocale: "en",
    locale: localStorage.getItem("language") as Language,
    messages: {
        en, ru
    }
})