import type { Ref } from "vue"
import type {
    LoadFinishedMessage,
    OutputMessage,
    RunFinishedMessage,
    WorkerMessage,
} from "./pythonWorker"
import { WorkerMessageKind } from "./pythonWorker"

import { GangleriMessage, sendMessage } from "../gangleri/message"

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
    error?: string
}

export class Python {
    private activeInterpreter: Interpreter
    private backupInterpreter?: Interpreter = undefined
    private readonly outputHandler: PythonOutputHandler
    private readonly interpreterState: Ref<PythonState>
    private readonly makeInterpreter: () => Interpreter

    constructor(
        outputHandler: PythonOutputHandler,
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
        state: Ref<PythonState>,
    ) {
        this.outputHandler = outputHandler
        this.interpreterState = state

        this.makeInterpreter = () => {
            return new Interpreter(
                this.workerMessageHandler(onLoaded, onFinished),
            )
        }
        this.activeInterpreter = this.makeInterpreter()
    }

    get state() {
        return this.interpreterState.value
    }

    private workerMessageHandler(
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
    ) {
        return (workerId: number, event: MessageEvent<WorkerMessage>) => {
            console.debug(`Worker ${workerId} sent message `, event.data)
            const data = event.data
            switch (data.what) {
                case WorkerMessageKind.gangleri:
                    this.forwardGangleriMessage(data.payload)
                    break
                case WorkerMessageKind.output:
                    this.onOutput(data)
                    break
                case WorkerMessageKind.finished:
                    this.onFinished(data, onFinished)
                    break
                case WorkerMessageKind.loadFinished:
                    this.onLoadFinished(workerId, data, onLoaded)
                    break
            }
        }
    }

    private forwardGangleriMessage(message: GangleriMessage) {
        sendMessage(message)
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
        this.interpreterState.value = PythonState.Ready
        const status = msg.success
            ? { success: true }
            : { success: false, error: msg.error }
        callback(status)
    }

    private onLoadFinished(
        workerId: number,
        msg: LoadFinishedMessage,
        callback: (s: PythonStatus) => void,
    ) {
        if (workerId !== this.activeInterpreter.id) {
            return // detect ready state when switching to the backup
        }

        this.interpreterState.value = PythonState.Ready
        const status = msg.success
            ? { success: true }
            : { success: false, error: msg.error }
        callback(status)
        this.makeBackup()
    }

    private makeBackup() {
        if (this.backupInterpreter === undefined) {
            this.backupInterpreter = this.makeInterpreter()
        }
    }

    private switchToBackup() {
        console.debug("Switching to backup interpreter")
        this.makeBackup()
        this.activeInterpreter = this.backupInterpreter!
        this.backupInterpreter = undefined

        if (this.activeInterpreter.ready) {
            this.activeInterpreter.reportReady()
        } else {
            this.interpreterState.value = PythonState.Loading
        }
        // else: The interpreter will send a message, and the regular
        // handler takes care of it.
    }

    run(code: string) {
        if (!this.activeInterpreter.ready) {
            console.error("Interpreter not ready")
            return
        }
        console.debug("Running Python code:\n", code)
        this.activeInterpreter.run(code)
        this.interpreterState.value = PythonState.Running
    }

    terminate() {
        if (!this.activeInterpreter.ready) {
            console.error("Interpreter not ready")
            return
        }

        console.debug("Terminating Python interpreter")
        this.activeInterpreter.terminate()
        this.switchToBackup()
    }
}

class Interpreter {
    private worker: Worker
    private readonly workerId: number
    private reportReadyImpl?: () => void = undefined

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
            if (event.data.what !== WorkerMessageKind.loadFinished) {
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
            this.reportReadyImpl = () => {
                messageHandler(event)
            }
            messageHandler(event)
        }
    }

    get ready() {
        return this.reportReadyImpl !== undefined
    }

    get id() {
        return this.workerId
    }

    reportReady() {
        this.reportReadyImpl?.()
    }

    run(code: string) {
        this.worker.postMessage({
            cmd: "run",
            code: code,
        })
    }

    terminate() {
        this.worker.terminate()
    }
}
