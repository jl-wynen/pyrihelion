import { ref, watch, Ref } from "vue"

export type Preferences = {
    cookies: boolean | null
}

export const preferences: Ref<Preferences> = ref(load())

watch(
    preferences,
    (newPreferences: Preferences) => {
        console.debug("Updated preferences: ", newPreferences)
        if (newPreferences.cookies === true) {
            save(newPreferences)
        }
    },
    { deep: true },
)

function load(): Preferences {
    const cookies = localStorage.getItem("cookies")
    return {
        cookies: cookies === null ? null : cookies === "true",
    }
}

function save(preferences: Preferences) {
    localStorage.setItem("cookies", String(preferences.cookies))
}
