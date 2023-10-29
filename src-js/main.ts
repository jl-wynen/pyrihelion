import { createApp } from "vue"
import "./style.scss"
import App from "./App.vue"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
    faDownload,
    faPlay,
    faRotate,
    faRotateLeft,
    faStop,
    faUpload,
} from "@fortawesome/free-solid-svg-icons"

import { provideGlobals } from "./injection"

library.add(faDownload, faPlay, faRotate, faRotateLeft, faStop, faUpload)

const app = createApp(App)
provideGlobals(app)
app.component("font-awesome-icon", FontAwesomeIcon).mount("#app")
