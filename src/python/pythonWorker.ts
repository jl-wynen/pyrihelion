import { loadPyodide as loadPyodideOrig, PyodideInterface } from "pyodide"

async function loadPyodide() {
    await loadPyodideOrig({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full",
    }).then(
        (py) => {
            configurePyodide(py)
            postMessage({ loadFinished: { success: true } })
            pyodide = py
        },
        (error) => {
            postMessage({ loadFinished: { success: false, error: error } })
        },
    )
}

const pyodideReadyPromise = loadPyodide()
let pyodide: PyodideInterface | null = null

function configurePyodide(pyodide: PyodideInterface) {
    pyodide.setStdout({
        batched: handleStdout,
    })
    pyodide.setStderr({
        batched: handleStderr,
    })
}

function handleStdout(msg: string) {
    postMessage({ stdout: msg })
}

function handleStderr(msg: string) {
    postMessage({ stderr: msg })
}

onmessage = async (event) => {
    console.log("Worker, got event ", event.data)
    await pyodideReadyPromise
    if (pyodide === null) {
        return
    }

    // TODO do we need a context?
    // const { code, ...context } = event.data
    // for (const key of Object.keys(context)) {
    //     self[key] = context[key]
    // }
    const code = event.data.code

    try {
        const results = await pyodide.runPythonAsync(code)
        postMessage({ runFinished: { success: results } })
    } catch (error) {
        postMessage({ runFinished: { error: (error as Error).message } })
    }
}
