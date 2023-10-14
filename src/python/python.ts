import type { Ref } from "vue"
import type { WorkerMessage, RunFinishedMessage } from "./pythonWorker"

export type PythonOutputHandler = {
    stdout: (msg: string) => void
    stderr: (msg: string) => void
}

export type PythonState = {
    running: Ref<boolean>
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
    private readonly state: PythonState

    constructor(
        outputHandler: PythonOutputHandler,
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
        state: PythonState,
    ) {
        this.outputHandler = outputHandler
        this.state = state

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
                    this.onFinished(data, onFinished)
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

    private onFinished(
        msg: RunFinishedMessage,
        callback: (s: PythonStatus) => void,
    ) {
        this.state.running.value = false
        const status = msg.success
            ? { success: true, result: msg.result }
            : { success: false, error: msg.error }
        callback(status)
    }

    run(code: string) {
        console.debug("Running Python code:\n", code)
        this.worker.postMessage({
            cmd: "run",
            code: code,
        })
        this.state.running.value = true
    }

    terminate() {
        console.debug("Terminating Python interpreter")
        this.worker.terminate()
        this.state.running.value = false
        console.debug("Reinitializing Python interpreter")
        this.worker = this.makeInterpreter()
    }
}
