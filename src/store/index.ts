import {createStore} from 'vuex'
import {CommandsModule} from "@/store/modules/CommandsModule";
import {UserModule} from "@/store/modules/UserModule";
import {GuildsModule} from "@/store/modules/GuildsModule";
import {User} from "@/types/User";
import {Guild} from "@/types/Guild";

export default createStore<User | Array<Guild>>({
  modules: {
    commands: CommandsModule,
    user: UserModule,
    guilds: GuildsModule
  }
})