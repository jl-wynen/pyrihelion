const DATABASE_NAME = "pyrihelion"
const DATABASE_VERSION = 1

function openDatabase(allowInit: boolean): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const dbRequest = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
        dbRequest.onerror = () => {
            reject(Error("Failed to open IndexedDB"))
        }
        dbRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            if (allowInit) {
                // @ts-ignore
                event.target.result.createObjectStore("code", {
                    keyPath: "id",
                })
            } else {
                // @ts-ignore
                event.target?.transaction?.abort()
                reject(Error("IndexedDB needs upgrade"))
            }
        }
        dbRequest.onsuccess = (event) => {
            if (event.target === null) {
                reject(Error("Failed to open IndexedDB: " + event))
            } else {
                // @ts-ignore
                const db = event.target.result
                db.onerror = (e: Event) => {
                    console.error("Database operation failed: ", e)
                }
                resolve(db)
            }
        }
    })
}

export async function loadFromDatabase(
    store: string,
    id: string,
): Promise<any> {
    const db = await openDatabase(false)

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readonly")
        const objectStore = transaction.objectStore(store)
        const request = objectStore.get(id)
        request.onerror = () => {
            reject(Error(`Failed to load object ${id}`))
        }
        request.onsuccess = () => {
            if (request.result) resolve(request.result)
            else reject(Error("Failed to get object"))
        }
    })
}

export async function saveToDatabase(
    store: string,
    object: any,
): Promise<void> {
    if (object.id === undefined)
        return Promise.reject(Error("object has no id"))
    const db = await openDatabase(true)

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite")
        const objectStore = transaction.objectStore(store)
        const request = objectStore.put(object)
        request.onerror = () => {
            reject(Error("Failed to save object"))
        }
        request.onsuccess = () => {
            resolve()
        }
    })
}
