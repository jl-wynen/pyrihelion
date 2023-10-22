import * as THREE from "three"
import { Scene } from "./scene"

export enum GangleriMessageKind {
    create,
}

export type CreateMessage = {
    what: GangleriMessageKind.create
    id: number
    geometry: string
}

export type GangleriMessage = CreateMessage

let scene: Scene | undefined = undefined

export function connectToScene(s: Scene) {
    scene = s
}

export function sendMessage(message: GangleriMessage) {
    switch (message.what) {
        case GangleriMessageKind.create:
            createMesh(message)
            break
    }
}

function createMesh(message: CreateMessage) {
    scene?.add(
        message.id,
        new THREE.Mesh(createGeometry(message.geometry), createMaterial()),
    )
}

function createGeometry(geometry: string): THREE.BufferGeometry {
    switch (geometry) {
        case "box":
            return new THREE.BoxGeometry(1, 1, 1)
        default:
            throw new Error("Unknown geometry: " + geometry)
    }
}

function createMaterial() {
    return new THREE.MeshBasicMaterial({ color: 0x00c000 })
}
