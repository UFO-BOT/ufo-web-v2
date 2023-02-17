import { createI18n } from "vue-i18n"

import en from "@/locales/en.json"
import ru from "@/locales/ru.json"

export default createI18n({
    legacy: false,
    fallbackLocale: "en",
    locale: localStorage.getItem("language") as "en" | "ru",
    messages: {
        en, ru
    }
})