import * as THREE from "three"
import { Scene } from "./scene"
import { UpdateRateTracker } from "./updateRate"
import { Mesh } from "./entity"

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
let updateRateTracker: UpdateRateTracker | undefined = undefined

export function connectToScene(s: Scene) {
    scene = s
}

export function setUpdateRateTracker(t: UpdateRateTracker) {
    updateRateTracker = t
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
    updateRateTracker?.newUpdate()
}

function createMesh(message: CreateMessage) {
    scene?.add(
        message.id,
        new Mesh(
            createGeometry(message.geometry, message.geometry_params),
            createMaterial(message.material, message.material_params),
            message.pos,
        ),
    )
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
    const entity = scene?.get(message.id)
    if (entity) {
        entity.moveTo(message.pos)
    }
}
