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
    result?: string
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
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full",
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

async function handleRunCommand(command: RunCommand) {
    if (pyodideReadyPromise === undefined) {
        return
    }
    await pyodideReadyPromise
    if (pyodide === undefined) {
        return
    }

    // TODO do we need a context?
    // const { code, ...context } = event.data
    // for (const key of Object.keys(context)) {
    //     self[key] = context[key]
    // }

    try {
        const result = await pyodide.runPythonAsync(command.code)
        postMessage({ event: "finished", success: true, result: result })
    } catch (error) {
        postMessage({
            event: "finished",
            success: false,
            error: (error as Error).message,
        })
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
