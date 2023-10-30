import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { pyPackagePlugin } from "./setup/vite-plugin-py-package.js"

const gangleriPlugin = pyPackagePlugin("gangleri", "src-py/gangleri")

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [gangleriPlugin, vue()],
    base: "/pyrihelion",
    worker: {
        format: "es",
        plugins: [gangleriPlugin],
    },
})
