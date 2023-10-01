import { createApp } from "vue"
import "./style.scss"
import App from "./App.vue"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons"

import { loadPyodide } from "pyodide"

async function hello_python() {
    let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full",
    })
    return pyodide.runPythonAsync("1+2")
}

hello_python().then((result) => {
    console.log("python says " + result)
})

library.add(faPlay, faStop)

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app")
