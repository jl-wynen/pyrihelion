import { loadPyodide as loadPyodideOrig, PyodideInterface } from "pyodide"

import { GangleriMessage } from "../gangleri/message"
import { pyModule } from "../gangleri/pythonBackend"

import { wheel } from "virtual:gangleri-wheel"

export type RunCommand = {
    cmd: "run"
    code: string
}

export type LoadCommand = {
    cmd: "load"
}

export type WorkerCommand = RunCommand | LoadCommand

export enum WorkerMessageKind {
    gangleri,
    output,
    finished,
    loadFinished,
}

export type RunFinishedMessage = {
    what: WorkerMessageKind.finished
    success: boolean
    error?: string
}

export type OutputMessage = {
    what: WorkerMessageKind.output
    which: "stdout" | "stderr"
    output: string
}

export type LoadFinishedMessage = {
    what: WorkerMessageKind.loadFinished
    success: boolean
    error?: string
}

export type WorkerGangleriMessage = {
    what: WorkerMessageKind.gangleri
    payload: Array<GangleriMessage>
}

export type WorkerMessage =
    | WorkerGangleriMessage
    | RunFinishedMessage
    | OutputMessage
    | LoadFinishedMessage

async function loadPyodide() {
    await loadPyodideOrig({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full",
    }).then(
        async (py) => {
            await configurePyodide(py)
            postMessage({ what: WorkerMessageKind.loadFinished, success: true })
            pyodide = py
        },
        (error: string) => {
            postMessage({
                what: WorkerMessageKind.loadFinished,
                success: false,
                error: error,
            })
        },
    )
}

let pyodideReadyPromise: Promise<void> | undefined = undefined
let pyodide: PyodideInterface | undefined = undefined

function outputHandler(which: string) {
    const decoder = new TextDecoder()
    return {
        write: (buffer: Uint8Array) => {
            postMessage({
                what: WorkerMessageKind.output,
                which: which,
                output: decoder.decode(buffer),
            })
            return buffer.length
        },
    }
}

async function configurePyodide(pyodide: PyodideInterface) {
    pyodide.setStdout(outputHandler("stdout"))
    pyodide.setStderr(outputHandler("stderr"))

    console.debug("Loading python wheel:", wheel)
    const engineUrl = new URL(wheel, import.meta.url)
    await pyodide.loadPackage(engineUrl.href)
}

/** Generate code that wraps the given Python code.
 *
 * The code catches all exceptions, strips non-user-facing frames,
 * and assigns the exception message to `__user_error__`.
 */
// The `not_user_frame` filter is applied twice, first to drop frames
// from pyodide, and second to drop frames from our wrapping code.
// The output should only contain frames that the user wrote or from
// functions they called themselves.
function pythonEntryCode(): string {
    return `import itertools
import traceback
from pyodide.code import eval_code
def not_user_frame(frame):
 return 'File "<exec>"' not in frame
try:
 eval_code(code)
except Exception as exc:
 it = iter(traceback.format_exception(exc))
 head = next(it)
 it = itertools.dropwhile(not_user_frame, it)
 next(it)
 frames = itertools.dropwhile(not_user_frame, it)
 __user_error__ = head + "".join(frames)`
}

async function handleRunCommand(command: RunCommand) {
    if (pyodideReadyPromise === undefined) {
        return
    }
    await pyodideReadyPromise
    if (pyodide === undefined) {
        return
    }

    pyodide.registerJsModule("gangleri_backend", pyModule())

    const namespace = pyodide.globals.get("dict")()
    namespace.set("code", command.code)

    let errorMessage: string | undefined
    try {
        await pyodide.runPythonAsync(pythonEntryCode(), {
            globals: namespace,
        })
        errorMessage = namespace.get("__user_error__")
    } catch (error) {
        errorMessage = (error as Error).message
    }

    if (errorMessage !== undefined) {
        postMessage({
            what: WorkerMessageKind.finished,
            success: false,
            error: errorMessage,
        })
    } else {
        postMessage({ what: WorkerMessageKind.finished, success: true })
    }
}

onmessage = async (event: MessageEvent<WorkerCommand>) => {
    console.debug("Worker, got event ", event.data)

    switch (event.data.cmd) {
        case "run":
            await handleRunCommand(event.data)
            break
        case "load":
            pyodideReadyPromise = loadPyodide()
            await pyodideReadyPromise
            break
    }
}
