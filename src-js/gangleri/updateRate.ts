import { Ref } from "vue"

export type UpdateRate = {
    fps: number
}

export class UpdateRateTracker {
    private frames: number = 0
    private intervalStartTime: number
    private rate: Ref<UpdateRate>

    constructor(rate: Ref<UpdateRate>) {
        this.intervalStartTime = performance.now()
        this.rate = rate
    }

    newFrame() {
        this.frames += 1
        this.update()
    }

    private update() {
        const now = performance.now()
        const delta = now - this.intervalStartTime
        if (delta >= 1000) {
            this.intervalStartTime = now
            this.rate.value.fps = Math.round((this.frames / delta) * 1000)
            this.frames = 0
        }
    }
}
