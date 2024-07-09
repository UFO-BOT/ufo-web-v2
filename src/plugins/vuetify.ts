// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, md } from 'vuetify/iconsets/md';
import { en, ru } from 'vuetify/locale'
import {Language} from "@/types/Language";

// Vuetify
import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
    locale: {
        locale: localStorage.getItem("language") as Language,
        fallback: 'en',
        messages: { en, ru },
    },
    theme: {
        defaultTheme: localStorage.getItem('theme') ?? 'dark' as 'light' | 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    surface: '#30344d',
                    block: '#1c1f34',
                    shadow: '#05050c',
                    background: '#0e0f1c',
                    codeBG: '#efefef',
                    tooltip: '#616161e6',
                    navbar: '#18193a',
                    footer: '#18193a',
                    mobileNav: '#191b31',
                    modal: '#16182a',
                    modalHeader: '#232740',
                    boostTab: '#0040ff',
                    description: '#adadaf',
                    footerLink: '#e3e3e3',
                    scrollbarTrack: '#151926',
                    scrollbarThumb: '#242940',
                    primary: '#6161fd',
                    secondary: '#242c46',
                    alert: '#8c8cf1'
                },
            },
            light: {
                dark: false,
                colors: {
                    block: '#ffffff',
                    shadow: '#909090',
                    background: '#F8F7FF',
                    codeBG: '#eaeaea',
                    tooltip: '#616161e6',
                    navbar: '#6161fd',
                    footer: '#6161fd',
                    mobileNav: '#ffffff',
                    modal: '#ffffff',
                    modalHeader: '#bcc3c7',
                    boostTab: '#0040ff',
                    description: '#898989',
                    footerLink: '#ffffff',
                    scrollbarTrack: '#d0d0d0',
                    scrollbarThumb: '#b8b8b8',
                    primary: '#6161fd',
                    secondary: '#546E7A',
                    alert: '#1b1be7'
                }
            }
        }
    },
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {md}
    },
    components: {
        VDateInput,
    }
})
