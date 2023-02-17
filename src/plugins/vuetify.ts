// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, md } from 'vuetify/iconsets/md';

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        defaultTheme: localStorage.getItem('theme') as 'light' | 'dark'
    },
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {md}
    }
})
