// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, md } from 'vuetify/iconsets/md';

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        defaultTheme: localStorage.getItem('theme') as 'light' | 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    block: '#181a2b',
                    shadow: '#05050c',
                    background: '#0e0f1c',
                    code: '#efefef',
                    navbar: '#14152a',
                    footer: '#14152a',
                    mobileNav: '#191b31',
                    modal: '#16182a',
                    modalHeader: '#232740',
                    boostTab: '#0040ff',
                    description: '#adadaf',
                    footerLink: '#e3e3e3',
                    scrollbarTrack: '#151926',
                    scrollbarThumb: '#242940',
                    primary: '#6161fd',
                    secondary: '#232939'
                },
            },
            light: {
                dark: false,
                colors: {
                    block: '#ffffff',
                    shadow: '#909090',
                    background: '#F8F7FF',
                    code: '#eaeaea',
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
                    secondary: '#546E7A'
                }
            }
        }
    },
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {md}
    }
})
