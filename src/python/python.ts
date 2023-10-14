import type { Ref } from "vue"
import type {
    LoadFinishedMessage,
    OutputMessage,
    RunFinishedMessage,
    WorkerMessage,
} from "./pythonWorker"

export type PythonOutputHandler = {
    stdout: (msg: string) => void
    stderr: (msg: string) => void
}

export enum PythonState {
    Ready,
    Running,
    Loading,
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
    private readonly state: Ref<PythonState>

    constructor(
        outputHandler: PythonOutputHandler,
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
        state: Ref<PythonState>,
    ) {
        this.outputHandler = outputHandler
        this.state = state

        this.makeInterpreter = () => {
            this.state.value = PythonState.Loading
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
                    this.onOutput(data)
                    break
                case "finished":
                    this.onFinished(data, onFinished)
                    break
                case "loadFinished":
                    this.onLoadFinished(data, onLoaded)
                    break
            }
        }
    }

    private onOutput(msg: OutputMessage) {
        if (msg.which === "stdout") {
            this.outputHandler.stdout(msg.output)
        } else {
            this.outputHandler.stderr(msg.output)
        }
    }

    private onFinished(
        msg: RunFinishedMessage,
        callback: (s: PythonStatus) => void,
    ) {
        this.state.value = PythonState.Ready
        const status = msg.success
            ? { success: true, result: msg.result }
            : { success: false, error: msg.error }
        callback(status)
    }

    private onLoadFinished(
        msg: LoadFinishedMessage,
        callback: (s: PythonStatus) => void,
    ) {
        this.state.value = PythonState.Ready
        const status = msg.success
            ? { success: true }
            : { success: false, error: msg.error }
        callback(status)
    }

    run(code: string) {
        console.debug("Running Python code:\n", code)
        this.worker.postMessage({
            cmd: "run",
            code: code,
        })
        this.state.value = PythonState.Running
    }

    terminate() {
        console.debug("Terminating Python interpreter")
        this.worker.terminate()
        console.debug("Reinitializing Python interpreter")
        this.worker = this.makeInterpreter()
    }
}
