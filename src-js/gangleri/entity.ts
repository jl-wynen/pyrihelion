import * as THREE from "three"

export abstract class Entity {
    abstract addToScene(scene: THREE.Scene): void
    abstract dispose(scene: THREE.Scene): void

    moveTo(pos: Array<number>) {
        console.error(`Entity does not implement moveTo, pos=${pos}`)
    }
}

export class Mesh extends Entity {
    mesh: THREE.Mesh

    constructor(
        geometry: THREE.BufferGeometry,
        material: THREE.Material,
        position: Array<number>,
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
        this.mesh.geometry?.dispose()
        if (Array.isArray(this.mesh.material)) {
            for (const material of this.mesh.material) {
                material.dispose()
            }
        } else if (this.mesh.material !== undefined) {
            this.mesh.material.dispose()
        }
    }

    moveTo(position: Array<number>) {
        this.mesh.position.set(position[0], position[1], position[2])
    }
}
