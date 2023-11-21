import { Ref } from "vue"

export type UpdateRate = {
    fps: number
    ups: number
}

export class UpdateRateTracker {
    private frames: number = 0
    private updates: number = 0
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

    newUpdate() {
        this.updates += 1
    }

    private update() {
        const now = performance.now()
        const delta = now - this.intervalStartTime
        if (delta >= 1000) {
            this.intervalStartTime = now
            const rate = this.rate.value
            rate.fps = Math.round((this.frames / delta) * 1000)
            rate.ups = Math.round((this.updates / delta) * 1000)
            this.frames = 0
            this.updates = 0
        }
    }
}
