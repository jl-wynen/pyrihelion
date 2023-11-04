import { execSync } from "child_process"
import { readdirSync } from "fs"
import { join } from "path"

export function pyPackagePlugin(name, path) {
    const moduleId = `virtual:${name}-wheel`
    const resolvedModuleId = "\0" + moduleId
    const outDir = "dist/py_modules"
    return {
        name: `py-package-${name}`,
        resolveId(id: string) {
            if (id !== moduleId) {
                return null
            }
            return resolvedModuleId
        },
        load(id: string) {
            if (id !== resolvedModuleId) {
                return null
            }
            // Synchronous to avoid race conditions with other parts of the bundler.
            execSync(
                `python3 -m build -w -o ${outDir} ${path}`,
                (error: boolean, stdout: string, stderr: string) => {
                    if (error) {
                        return this.error(stdout + stderr)
                    }
                },
            )
            const wheels = readdirSync(outDir).filter((file: string) => {
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
