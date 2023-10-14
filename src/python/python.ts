import type { WorkerMessage } from "./pythonWorker"

export type PythonOutputHandler = {
    stdout: (msg: string) => void
    stderr: (msg: string) => void
}

export type PythonStatus = {
    success: boolean
    result?: string
    error?: string
}

export class Python {
    private worker: Worker
    private readonly outputHandler: PythonOutputHandler
    private readonly makeInterpreter: () => Worker

    constructor(
        outputHandler: PythonOutputHandler,
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
    ) {
        this.outputHandler = outputHandler

        this.makeInterpreter = () => {
            const worker = new Worker(
                new URL("./pythonWorker.ts", import.meta.url),
                { type: "module" },
            )
            worker.onmessage = this.workerMessageHandler(onLoaded, onFinished)
            return worker
        }
        this.worker = this.makeInterpreter()
    }

    private workerMessageHandler(
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
    ) {
        return (event: MessageEvent<WorkerMessage>) => {
            console.debug("Worker sent message: ", event.data)
            const data = event.data
            switch (data.event) {
                case "output":
                    if (data.which === "stdout") {
                        this.outputHandler.stdout(data.output)
                    } else {
                        this.outputHandler.stderr(data.output)
                    }
                    break
                case "finished":
                    if (data.success) {
                        onFinished({ success: true, result: data.result })
                    } else {
                        onFinished({ success: false, error: data.error })
                    }
                    break
                case "loadFinished":
                    if (data.success) {
                        onLoaded({ success: true })
                    } else {
                        onLoaded({ success: false, error: data.error })
                    }
            }
        }
    }

    run(code: string) {
        console.debug("Running Python code:\n", code)
        this.worker.postMessage({
            cmd: "run",
            code: code,
        })
    }

    terminate() {
        console.debug("Terminating Python interpreter")
        this.worker.terminate()
        console.debug("Reinitializing Python interpreter")
        this.worker = this.makeInterpreter()
    }
}
