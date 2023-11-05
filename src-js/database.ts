export type DatabaseOperation = {
    op: (store: IDBObjectStore) => void
    onerror: (transaction: IDBTransaction) => void
}

export function accessDatabase(
    operation: DatabaseOperation,
    store: string,
    mode: IDBTransactionMode,
) {
    openDatabase(makeTransaction(operation, store, mode))
}

function openDatabase(transactionFn: (db: IDBDatabase) => void) {
    const request = window.indexedDB.open("pyrihelion", 1)
    request.onerror = (event) => {
        console.error("Failed to open IndexedDB: ", event)
    }
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        if (event.target !== null) {
            // @ts-ignore
            initDatabase((event.target as IDBVersion).result)
        }
    }
    request.onsuccess = (event: Event) => {
        if (event.target === null) {
            throw new Error("Failed to open IndexedDB: " + event)
        }
        // @ts-ignore
        const db = event.target.result
        db.onerror = (e: Event) => {
            console.error("Database operation failed: ", e)
        }
        transactionFn(db)
    }
}

function initDatabase(db: IDBDatabase) {
    db.createObjectStore("code", { keyPath: "id" })
}

function makeTransaction(
    operation: DatabaseOperation,
    store: string,
    mode: IDBTransactionMode,
) {
    return (db: IDBDatabase) => {
        const transaction = db.transaction(store, mode)
        transaction.onerror = (event) => {
            // @ts-ignore
            operation.onerror(event.target)
        }
        operation.op(transaction.objectStore(store))
    }
}
