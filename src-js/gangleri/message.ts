import * as THREE from "three"
import { Scene } from "./scene"
import { UpdateRateTracker } from "./updateRate"
import { Mesh } from "./entity"
import { LineSegments } from "./lineSegments"

export enum GangleriMessageKind {
    moveTo,
    create,
    lineSegments,
    destroy,
    clear,
}

export type MoveToMessage = {
    what: GangleriMessageKind.moveTo
    id: number
    pos: number[]
}

export type LineSegmentsMessage = {
    what: GangleriMessageKind.lineSegments
    id: number
    op: string
    pos?: number[]
    color?: number
}

export type CreateMessage = {
    what: GangleriMessageKind.create
    id: number
    pos: number[]
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
    | LineSegmentsMessage
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
            case GangleriMessageKind.lineSegments:
                lineSegments(message)
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

function lineSegments(message: LineSegmentsMessage) {
    if (message.op === "create") {
        const entity = new LineSegments(message.color!)
        scene?.add(message.id, entity)
    } else if (message.op === "add") {
        const entity = scene?.get(message.id)
        if (!(entity instanceof LineSegments)) {
            console.error(
                "Tried to add a line segment to a non-line segment entity",
            )
            return
        }
        entity.addPoint(message.pos!)
    } else {
        throw new Error("Unknown operation: " + message.op)
    }
}
