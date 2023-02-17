import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from "@/plugins/i18n";
import {loadFonts} from './plugins/webfontloader'

loadFonts().then()

createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .use(i18n)
    .mount('#app')
