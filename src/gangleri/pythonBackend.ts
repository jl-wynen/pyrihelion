import { GangleriMessageKind } from "./message"

function create(
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
            id: 0,
            pos: pos,
            geometry: geometry,
            geometry_params: geometry_params,
            material: material,
            material_params: material_params,
        },
    })
}

export function pyModule() {
    return { create: create }
}
