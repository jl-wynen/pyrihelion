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
    private activeInterpreter: Interpreter
    private readonly outputHandler: PythonOutputHandler
    private readonly state: Ref<PythonState>
    private readonly makeInterpreter: () => Interpreter

    constructor(
        outputHandler: PythonOutputHandler,
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
        state: Ref<PythonState>,
    ) {
        this.outputHandler = outputHandler
        this.state = state

        this.makeInterpreter = () => {
            return new Interpreter(
                this.workerMessageHandler(onLoaded, onFinished),
            )
        }
        this.activeInterpreter = this.makeInterpreter()
    }

    private workerMessageHandler(
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
    ) {
        return (workerId: number, event: MessageEvent<WorkerMessage>) => {
            console.debug(`Worker ${workerId} sent message `, event.data)
            const data = event.data
            switch (data.event) {
                case "output":
                    this.onOutput(data)
                    break
                case "finished":
                    this.onFinished(data, onFinished)
                    break
                case "loadFinished":
                    this.onLoadFinished(workerId, data, onLoaded)
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
        workerId: number,
        msg: LoadFinishedMessage,
        callback: (s: PythonStatus) => void,
    ) {
        if (workerId !== this.activeInterpreter.id) {
            console.error(`Worker ${workerId} reported ready but is not active`)
            return // TODO
        }

        this.state.value = PythonState.Ready
        const status = msg.success
            ? { success: true }
            : { success: false, error: msg.error }
        callback(status)
    }

    run(code: string) {
        if (!this.activeInterpreter.ready) {
            console.error("Interpreter not ready")
            return // TODO
        }
        console.debug("Running Python code:\n", code)
        this.activeInterpreter.run(code)
        this.state.value = PythonState.Running
    }

    terminate() {
        if (!this.activeInterpreter.ready) {
            console.error("Interpreter not ready")
            return // TODO
        }

        console.debug("Terminating Python interpreter")
        this.activeInterpreter.terminate()
        this.state.value = PythonState.Loading
        console.debug("Reinitializing Python interpreter")
        this.activeInterpreter = this.makeInterpreter()
    }
}

class Interpreter {
    private worker: Worker
    private readonly workerId: number
    private workerReady: boolean = false
    private static interpreterCount: number = 0

    constructor(
        messageHandler: (
            id: number,
            event: MessageEvent<WorkerMessage>,
        ) => void,
    ) {
        this.workerId = Interpreter.interpreterCount++
        this.worker = new Worker(
            new URL("./pythonWorker.ts", import.meta.url),
            { type: "module" },
        )
        this.worker.onmessage = this.readyMessageHandler(messageHandler)
        this.worker.postMessage({
            cmd: "load",
        })
    }

    readyMessageHandler(
        userMessageHandler: (
            id: number,
            event: MessageEvent<WorkerMessage>,
        ) => void,
    ) {
        return (event: MessageEvent<WorkerMessage>) => {
            if (event.data.event !== "loadFinished") {
                console.error(
                    "Unexpected message from Python worker during initialisation: ",
                    event.data,
                )
                return
            }
            const messageHandler = (event: MessageEvent<WorkerMessage>) => {
                userMessageHandler(this.workerId, event)
            }
            this.worker.onmessage = messageHandler
            this.workerReady = true
            messageHandler(event)
        }
    }

    get ready() {
        return this.workerReady
    }

    get id() {
        return this.workerId
    }

    run(code: string) {
        this.worker.postMessage({
            cmd: "run",
            code: code,
        })
    }

    terminate() {
        this.worker.terminate()
        this.workerReady = false
    }
}
