import * as THREE from "three"

export class Scene {
    private readonly scene: THREE.Scene
    private userObjects: Map<number, THREE.Object3D>

    constructor() {
        this.scene = new THREE.Scene()
        this.userObjects = new Map()
    }

    add(id: number, object: THREE.Object3D) {
        if (this.userObjects.has(id)) {
            console.error("Scene already has an object with id, ", id)
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

    get underlying(): THREE.Scene {
        return this.scene
    }
}

function dispose(object: THREE.Object3D): void {
    object.geometry?.dispose()
    object.material?.dispose()
    // TODO lines and other objects
}
