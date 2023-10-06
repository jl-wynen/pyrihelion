export type PythonOutputHandler = {
    stdout: (msg: string) => void
    stderr: (msg: string) => void
}

export type PythonStatus = {
    success: boolean
    error?: string
}

export class Python {
    private worker: Worker
    private outputHandler: PythonOutputHandler

    constructor(
        outputHandler: PythonOutputHandler,
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
    ) {
        this.outputHandler = outputHandler
        this.worker = new Worker(
            new URL("./pythonWorker.ts", import.meta.url),
            { type: "module" },
        )
        this.worker.onmessage = this.workerMessageHandler(onLoaded, onFinished)
    }

    private workerMessageHandler(
        onLoaded: (s: PythonStatus) => void,
        onFinished: (s: PythonStatus) => void,
    ) {
        return (event: MessageEvent) => {
            console.debug("Worker sent message: ", event.data)
            const data = event.data
            if (data.stdout !== undefined) {
                this.outputHandler.stdout(data.stdout)
            } else if (data.stderr !== undefined) {
                this.outputHandler.stderr(data.stderr)
            } else if (data.runFinished !== undefined) {
                onFinished({
                    success: data.runFinished.success,
                    error: data.runFinished.error,
                })
            } else if (data.loadFinished !== undefined) {
                onLoaded({
                    success: data.loadFinished.success,
                    error: data.loadFinished.error,
                })
            }
        }
    }

    run(code: string) {
        console.debug("Running python code:\n", code)
        this.worker.postMessage({
            code: code,
        })
    }
}
