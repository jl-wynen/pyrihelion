import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { pyPackagePlugin } from "./setup/vite-plugin-py-package.js"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [pyPackagePlugin("gangleri", "src-py/gangleri"), vue()],
    base: "/pyrihelion",
    worker: {
        format: "es",
    },
})
