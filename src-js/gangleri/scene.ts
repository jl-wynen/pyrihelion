import * as THREE from "three"

export class Scene {
    private readonly scene: THREE.Scene
    private userObjects: Map<number, THREE.Mesh>
    private axesHelper: THREE.AxesHelper | undefined = undefined

    constructor() {
        this.scene = new THREE.Scene()
        this.userObjects = new Map()
    }

    add(id: number, object: THREE.Mesh) {
        if (this.userObjects.has(id)) {
            console.error("Scene already has an object with id ", id)
            dispose(object)
            return
        }
        this.userObjects.set(id, object)
        this.scene.add(object)
    }

    remove(id: number) {
        const object = this.userObjects.get(id)
        if (object) {
            this.scene.remove(object)
            this.userObjects.delete(id)
            dispose(object)
        }
    }

    get(id: number): THREE.Mesh | undefined {
        return this.userObjects.get(id)
    }

    clear(): void {
        for (const object of this.userObjects.values()) {
            this.scene.remove(object)
            dispose(object)
        }
        this.userObjects.clear()
    }

    toggleAxes(): void {
        console.log("toggle")
        if (this.axesHelper === undefined) {
            this.axesHelper = new THREE.AxesHelper(1)
            this.scene.add(this.axesHelper)
        } else {
            this.scene.remove(this.axesHelper)
            this.axesHelper.dispose()
            this.axesHelper = undefined
        }
    }

    get underlying(): THREE.Scene {
        return this.scene
    }
}

function dispose(object: THREE.Mesh): void {
    object.geometry?.dispose()

    if (Array.isArray(object.material)) {
        for (const material of object.material) {
            material.dispose()
        }
    } else if (object.material !== undefined) {
        object.material.dispose()
    }
    // TODO lines and other objects
}
