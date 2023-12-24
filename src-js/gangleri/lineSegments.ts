import * as THREE from "three"
import { Entity, disposeObject } from "./entity"

export class LineSegments extends Entity {
    private readonly MAX_POINTS = 5000
    private positions: Float32Array
    private geometry: THREE.BufferGeometry
    private line: THREE.Line // TODO use THREE.LineSegments?
    private nPoints = 0

    constructor(color: number) {
        super()
        this.positions = new Float32Array(this.MAX_POINTS * 3)
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(this.positions, 3),
        )
        this.setDrawRange()
        const material = new THREE.LineBasicMaterial({ color })
        this.line = new THREE.Line(this.geometry, material)
    }

    addToScene(scene: THREE.Scene) {
        scene.add(this.line)
    }

    dispose(scene: THREE.Scene) {
        scene.remove(this.line)
        disposeObject(this.line)
    }

    addPoint(position: number[]) {
        if (this.nPoints >= this.MAX_POINTS) {
            return
        }
        this.positions[this.nPoints * 3] = position[0]
        this.positions[this.nPoints * 3 + 1] = position[1]
        this.positions[this.nPoints * 3 + 2] = position[2]
        this.nPoints += 1
        this.setDrawRange()
    }

    private setDrawRange() {
        this.geometry.setDrawRange(0, this.nPoints)
        this.geometry.attributes.position.needsUpdate = true
    }
}
