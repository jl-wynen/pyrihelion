import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"
import { pyPackagePlugin } from "./setup/vite-plugin-py-package"

const gangleriPlugin = pyPackagePlugin("gangleri", "src-py/gangleri")

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [gangleriPlugin, vue(), svgLoader()],
    base: "/pyrihelion",
    worker: {
        format: "es",
        plugins: [gangleriPlugin],
    },
})
