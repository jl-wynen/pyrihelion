import * as THREE from "three"
import WebGL from "three/addons/capabilities/WebGL.js"
import { Ref } from "vue"

import { Scene } from "./scene"
import { connectToScene, setUpdateRateTracker } from "./message"
import { UpdateRate, UpdateRateTracker } from "./updateRate"

export type { UpdateRate } from "./updateRate"

let scene: Scene | undefined = undefined
let camera: THREE.PerspectiveCamera | undefined = undefined
let renderer: THREE.WebGLRenderer | undefined = undefined

let updateRateTracker: UpdateRateTracker | undefined = undefined

export function init(options: {
    renderElement: HTMLElement
    updateRate: Ref<UpdateRate>
}) {
    if (!WebGL.isWebGLAvailable()) {
        const warning = WebGL.getWebGLErrorMessage()
        options.renderElement.replaceChildren(warning)
        return
    }
    updateRateTracker = new UpdateRateTracker(options.updateRate)
    setUpdateRateTracker(updateRateTracker)

    scene = new Scene()
    connectToScene(scene)
    camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({ antialias: true })
    attachToElement(options.renderElement)
}

function attachToElement(element: HTMLElement) {
    if (renderer === undefined) {
        return
    }

    element.replaceChildren(renderer.domElement)
    resize(element.offsetWidth, element.offsetHeight)

    const obs = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        // TODO debounce or throttle
        const entry = entries[0]
        const r = entry.contentRect
        resize(r.width, r.height)
    })
    obs.observe(element)
}

function resize(width: number, height: number) {
    if (camera === undefined || renderer === undefined) {
        return
    }
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}

export function start() {
    camera!.position.z = 5

    function animate() {
        requestAnimationFrame(animate)
        renderer!.render(scene!.underlying, camera!)
        updateRateTracker?.newFrame()
    }
    animate()
}

export function toggleAxesHelper() {
    scene?.toggleAxes()
}
