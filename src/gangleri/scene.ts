import * as THREE from "three"

export class Scene {
    private readonly scene: THREE.Scene
    private userObjects: Map<number, THREE.Object3D>

    constructor() {
        this.scene = new THREE.Scene()
        this.userObjects = new Map()
    }

    add(id: number, object: THREE.Object3D) {
        this.userObjects.set(id, object)
        this.scene.add(object)
    }

    get underlying(): THREE.Scene {
        return this.scene
    }
}
