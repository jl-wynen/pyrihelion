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

import { pythonState } from "./injectionKeys"
import { PythonState } from "./python"

library.add(faDownload, faPlay, faRotate, faRotateLeft, faStop, faUpload)

const app = createApp(App)
app.provide(pythonState, ref(PythonState.Loading))
app.component("font-awesome-icon", FontAwesomeIcon).mount("#app")
