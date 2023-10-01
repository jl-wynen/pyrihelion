import { createApp } from "vue"
import "./style.scss"
import App from "./App.vue"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons"

library.add(faPlay, faStop)

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app")
