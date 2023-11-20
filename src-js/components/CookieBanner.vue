<script setup lang="ts">
import { ref } from "vue"
import { preferences } from "../preferences"

const show = ref(preferences.value.cookies === null)
function accept() {
    show.value = false
    preferences.value.cookies = true
}

function reject() {
    show.value = false
    preferences.value.cookies = false
}
</script>

<template>
    <Transition>
        <div class="cookie-banner modal-overlay" v-if="show">
            <div class="cookie-dialog">
                <h1>Privacy</h1>
                <p>
                    This site processes private data such as your IP address to
                    provide its service. This data is also shared with third
                    parties.
                </p>
                <p>
                    In addition, this site can use cookies and similar
                    technologies for the purposes listed below. This data is
                    never processed by the server or shared with third parties.
                </p>
                <div class="cookie-category cookie-category-functional">
                    <ul>
                        <li>Save your code</li>
                        <li>Save your preferences</li>
                    </ul>
                </div>
                <div>
                    <button @click="accept">Accept</button>
                    <button @click="reject">Reject</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.cookie-banner {
    display: flex;
    justify-content: center;
}

.cookie-dialog {
    background-color: var(--color-background0);
    color: var(--color-text0);
    border: 4px solid var(--color-background1);

    margin-top: auto;
    padding: 1rem;
    max-width: 75%;
}

.cookie-dialog h1 {
    font-size: 1.5rem;
    font-variant-caps: small-caps;
    margin-top: 0;
}

.cookie-banner button {
    font-size: 1.2rem;
    margin-right: 1em;
    width: 8em;
    background-color: var(--color-info0);
}

.v-leave-active > .cookie-dialog {
    transition: all 0.1s ease-in;
}

.v-leave-to > .cookie-dialog {
    transform: translateY(100ex);
}
</style>
