import * as THREE from "three"
import { Scene } from "./scene"

export enum GangleriMessageKind {
    moveTo,
    create,
    destroy,
    clear,
}

export type MoveToMessage = {
    what: GangleriMessageKind.moveTo
    id: number
    pos: Array<number>
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

export type DestroyMessage = {
    what: GangleriMessageKind.destroy
    id: number
}

export type ClearMessage = {
    what: GangleriMessageKind.clear
}

export type GangleriMessage =
    | MoveToMessage
    | CreateMessage
    | DestroyMessage
    | ClearMessage

let scene: Scene | undefined = undefined

export function connectToScene(s: Scene) {
    scene = s
}

export function sendMessage(message_queue: Array<GangleriMessage>) {
    for (const message of message_queue) {
        switch (message.what) {
            case GangleriMessageKind.moveTo:
                moveTo(message)
                break
            case GangleriMessageKind.create:
                createMesh(message)
                break
            case GangleriMessageKind.destroy:
                scene?.remove(message.id)
                break
            case GangleriMessageKind.clear:
                scene?.clear()
                break
        }
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
        case "sphere":
            return new THREE.SphereGeometry(...params)
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

function moveTo(message: MoveToMessage) {
    const object = scene?.get(message.id)
    if (object) {
        object.position.set(message.pos[0], message.pos[1], message.pos[2])
    }
}
