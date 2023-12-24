import * as THREE from "three"

export abstract class Entity {
    abstract addToScene(scene: THREE.Scene): void
    abstract dispose(scene: THREE.Scene): void

    moveTo(pos: number[]) {
        console.error(`Entity does not implement moveTo, pos=${pos}`)
    }
}

export class Mesh extends Entity {
    mesh: THREE.Mesh

    constructor(
        geometry: THREE.BufferGeometry,
        material: THREE.Material,
        position: number[],
    ) {
        super()
        this.mesh = new THREE.Mesh(geometry, material)
        this.moveTo(position)
    }

    addToScene(scene: THREE.Scene) {
        scene.add(this.mesh)
    }

    dispose(scene: THREE.Scene) {
        scene.remove(this.mesh)
        disposeObject(this.mesh)
    }

    moveTo(position: number[]) {
        this.mesh.position.set(position[0], position[1], position[2])
    }
}

interface Disposable {
    geometry?: THREE.BufferGeometry
    material?: THREE.Material | Array<THREE.Material>
}

export function disposeObject(object: Disposable) {
    object.geometry?.dispose()
    if (Array.isArray(object.material)) {
        for (const material of object.material) {
            material.dispose()
        }
    } else if (object.material !== undefined) {
        object.material.dispose()
    }
}
