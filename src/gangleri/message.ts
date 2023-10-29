import * as THREE from "three"
import { Scene } from "./scene"

export enum GangleriMessageKind {
    create,
}

export type CreateMessage = {
    what: GangleriMessageKind.create
    id: number
    pos: Array<number>
    geometry: string
    geometry_params: Iterable<never>
    material: string
    material_params: object
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
    const mesh = new THREE.Mesh(
        createGeometry(message.geometry, message.geometry_params),
        createMaterial(message.material, message.material_params),
    )
    mesh.position.set(message.pos[0], message.pos[1], message.pos[2])
    scene?.add(message.id, mesh)
}

function createGeometry(
    geometry: string,
    params: Iterable<never>,
): THREE.BufferGeometry {
    switch (geometry) {
        case "box":
            return new THREE.BoxGeometry(...params)
        default:
            throw new Error("Unknown geometry: " + geometry)
    }
}

function createMaterial(material: string, params: object): THREE.Material {
    switch (material) {
        case "basic":
            return new THREE.MeshBasicMaterial(params)
        default:
            throw new Error("Unknown material: " + material)
    }
}
