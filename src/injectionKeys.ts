import type { InjectionKey, Ref } from "vue"

export const pythonRunning = Symbol("pythonRunning") as InjectionKey<
    Ref<boolean>
>
