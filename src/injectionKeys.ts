import type { InjectionKey, Ref } from "vue"
import { PythonState } from "./python"

export const pythonState = Symbol("pythonState") as InjectionKey<
    Ref<PythonState>
>
