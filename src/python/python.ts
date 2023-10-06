import { loadPyodide, PyodideInterface } from "pyodide"

export type PythonOutputHandler = {
    stdout: (msg: string) => void
    stderr: (msg: string) => void
}

// Use loadPyodide.inProgress to check if still loading
export async function loadPython(
    outputHandler: PythonOutputHandler,
): Promise<PyodideInterface> {
    const promise = loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full",
    })
    promise.then((py) => {
        configurePyodide(py, outputHandler)
    })
    return promise
}

function configurePyodide(
    py: PyodideInterface,
    outputHandler: PythonOutputHandler,
) {
    py.setStdout({
        batched: outputHandler.stdout,
    })
    py.setStderr({
        batched: outputHandler.stderr,
    })
}
