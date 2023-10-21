import * as THREE from "three"
import WebGL from "three/addons/capabilities/WebGL.js"
import { Ref } from "vue"

import { UpdateRate, UpdateRateTracker } from "./updateRate"

// export type {UpdateRate as default} from "./updateRate"
// export type UpdateRate
export type { UpdateRate } from "./updateRate"

let scene: THREE.Scene | undefined = undefined
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

    scene = new THREE.Scene()
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
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene!.add(cube)

    camera!.position.z = 5

    function animate() {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer!.render(scene!, camera!)
        updateRateTracker?.newFrame()
    }
    animate()
}
