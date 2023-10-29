import { GangleriMessageKind } from "./message"

function create(
    id: number,
    pos: Array<number>,
    geometry: string,
    geometry_params: Array<never>,
    material: string,
    material_params: object,
): void {
    postMessage({
        event: "gangleri",
        payload: {
            what: GangleriMessageKind.create,
            id: id,
            pos: pos,
            geometry: geometry,
            geometry_params: geometry_params,
            material: material,
            material_params: material_params,
        },
    })
}

function destroy(id: number): void {
    postMessage({
        event: "gangleri",
        payload: {
            what: GangleriMessageKind.destroy,
            id: id,
        },
    })
}

export function pyModule() {
    return { create, destroy }
}
