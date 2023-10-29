import { exec } from "child_process"
import { readdirSync } from "fs"
import { join } from "path"

export function pyPackagePlugin(name, path) {
    const moduleId = `virtual:${name}-wheel`
    const resolvedModuleId = "\0" + moduleId
    const outDir = "py_modules"
    return {
        name: `py-package-${name}`,
        resolveId(id) {
            if (id !== moduleId) {
                return null
            }
            return resolvedModuleId
        },
        async load(id) {
            if (id !== resolvedModuleId) {
                return null
            }
            await exec(
                `python3 -m build -w -o ${outDir} ${path}`,
                (error, stdout, stderr) => {
                    if (error) {
                        return this.error(stdout + stderr)
                    }
                },
            )
            const wheels = readdirSync(outDir).filter((file) => {
                return file.startsWith(name)
            })
            if (wheels.length !== 1) {
                return this.error(
                    `Unable to identify wheel for ${name}, got wheels ${wheels}`,
                )
            }
            const wheelDir = join(outDir, wheels[0])
            return `export const wheel = "/${wheelDir}"`
        },
    }
}
