import type { App, InjectionKey, Ref } from "vue"
import { PythonState } from "./python"
import { UpdateRate } from "./gangleri"
import { ref } from "vue"

export const pythonState = Symbol("pythonState") as InjectionKey<
    Ref<PythonState>
>
export const updateRate = Symbol("updateRate") as InjectionKey<Ref<UpdateRate>>

export function provideGlobals(app: App) {
    app.provide(pythonState, ref(PythonState.Loading))
    app.provide(updateRate, ref({ fps: 0 }))
}
