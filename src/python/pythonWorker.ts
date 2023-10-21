import { loadPyodide as loadPyodideOrig, PyodideInterface } from "pyodide"

export type RunCommand = {
    cmd: "run"
    code: string
}

export type LoadCommand = {
    cmd: "load"
}

export type WorkerCommand = RunCommand | LoadCommand

export type RunFinishedMessage = {
    event: "finished"
    success: boolean
    error?: string
}

export type OutputMessage = {
    event: "output"
    which: "stdout" | "stderr"
    output: string
}

export type LoadFinishedMessage = {
    event: "loadFinished"
    success: boolean
    error?: string
}

export type WorkerMessage =
    | RunFinishedMessage
    | OutputMessage
    | LoadFinishedMessage

async function loadPyodide() {
    await loadPyodideOrig({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full",
    }).then(
        (py) => {
            configurePyodide(py)
            postMessage({ event: "loadFinished", success: true })
            pyodide = py
        },
        (error: string) => {
            postMessage({ event: "loadFinished", success: false, error: error })
        },
    )
}

let pyodideReadyPromise: Promise<void> | undefined = undefined
let pyodide: PyodideInterface | undefined = undefined

function configurePyodide(pyodide: PyodideInterface) {
    pyodide.setStdout({
        batched: handleStdout,
    })
    pyodide.setStderr({
        batched: handleStderr,
    })
}

function handleStdout(msg: string) {
    postMessage({ event: "output", which: "stdout", output: msg })
}

function handleStderr(msg: string) {
    postMessage({ event: "output", which: "stderr", output: msg })
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
function preprocessCode(rawCode: string): string {
    return `import itertools
import traceback

from pyodide.code import eval_code


code = '''${rawCode}'''

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
    __user_error__ = head + "".join(frames)
`
}

async function handleRunCommand(command: RunCommand) {
    if (pyodideReadyPromise === undefined) {
        return
    }
    await pyodideReadyPromise
    if (pyodide === undefined) {
        return
    }

    const namespace = pyodide.globals.get("dict")()
    let errorMessage: string | undefined = undefined
    try {
        await pyodide.runPythonAsync(preprocessCode(command.code), {
            globals: namespace,
        })
        errorMessage = namespace.get("__user_error__")
    } catch (error) {
        errorMessage = (error as Error).message
    }

    if (errorMessage !== undefined) {
        postMessage({
            event: "finished",
            success: false,
            error: errorMessage,
        })
    } else {
        postMessage({ event: "finished", success: true })
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
