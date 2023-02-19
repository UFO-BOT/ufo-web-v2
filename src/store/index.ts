import {createStore} from 'vuex'
import {UserModule} from "@/store/modules/UserModule";

export default createStore({
  modules: {
    user: UserModule
  }
})