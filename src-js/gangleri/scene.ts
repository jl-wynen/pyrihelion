import * as THREE from "three"
import { Entity } from "./entity"

export class Scene {
    private readonly scene: THREE.Scene
    private userEntities: Map<number, Entity>
    private axesHelper: THREE.AxesHelper | undefined = undefined

    constructor() {
        this.scene = new THREE.Scene()
        this.userEntities = new Map()
    }

    add(id: number, entity: Entity) {
        if (this.userEntities.has(id)) {
            console.error("Scene already has an entity with id ", id)
            entity.dispose(this.scene)
            return
        }
        this.userEntities.set(id, entity)
        entity.addToScene(this.scene)
    }

    remove(id: number) {
        const entity = this.userEntities.get(id)
        if (entity) {
            this.userEntities.delete(id)
            entity.dispose(this.scene)
        }
    }

    get(id: number): Entity | undefined {
        return this.userEntities.get(id)
    }

    clear(): void {
        for (const entity of this.userEntities.values()) {
            entity.dispose(this.scene)
        }
        this.userEntities.clear()
    }

    toggleAxes(): void {
        console.log("toggle")
        if (this.axesHelper === undefined) {
            this.axesHelper = new THREE.AxesHelper(1)
            this.scene.add(this.axesHelper)
        } else {
            this.scene.remove(this.axesHelper)
            this.axesHelper.dispose()
            this.axesHelper = undefined
        }
    }

    get underlying(): THREE.Scene {
        return this.scene
    }
}
