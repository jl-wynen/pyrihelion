import { createApp, ref } from "vue"
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

library.add(faDownload, faPlay, faRotate, faRotateLeft, faStop, faUpload)

const app = createApp(App)

import { pythonRunning } from "./injectionKeys"
;(() => {
    app.provide(pythonRunning, ref(false))
})()
app.component("font-awesome-icon", FontAwesomeIcon).mount("#app")
