import { GangleriMessageKind } from "./message"
import { WorkerMessageKind } from "../python/pythonWorker"

function update(queue: Array<object>): void {
    postMessage({
        what: WorkerMessageKind.gangleri,
        payload: queue,
    })
}

export function pyModule() {
    return {
        update,
        MessageKind: GangleriMessageKind,
    }
}
