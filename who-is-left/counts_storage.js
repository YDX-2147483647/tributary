export class CountsStorage {

    /**
     * @param {Storage} storage 
     */
    constructor(storage = window.localStorage) {
        /** @type {Storage} */
        this._storage = storage

        /** @type {{names: string, counts: string}} */
        this._key = {
            names: 'names',
            counts: 'counts'
        }

        /** @type {Map<string,number>} */
        this.counts = null
        this.load()
    }


    /**
     * `this._storage` → `this.counts`
     */
    load() {
        /** @type {Array|null} */
        const raw_names = JSON.parse(this._storage.getItem(this._key.names))
        /** @type {Array|null} */
        const raw_counts = JSON.parse(this._storage.getItem(this._key.counts))

        let is_valid = raw_names != null && Array.isArray(raw_names)
        is_valid = is_valid && raw_counts != null && Array.isArray(raw_counts)
        is_valid = is_valid && raw_names.length === raw_counts.length


        if (is_valid) {
            this.counts = new Map(raw_names.map(
                (name, index) => [name, raw_counts[index]]
            ))
        } else {
            this.counts = new Map()
        }
    }

    /**
     * `this.counts` → `this._storage`
     */
    save() {
        this._storage.setItem(
            this._key.names,
            JSON.stringify(Array.from(this.counts.keys()))
        )
        this._storage.setItem(
            this._key.counts,
            JSON.stringify(Array.from(this.counts.values()))
        )
    }


    /**
     * Reset count (with or without names)
     * @param {Array<string> | null} names
     */
    reset(names = null) {
        if (names === null) {
            names = Array.from(this.counts.keys())
        }

        this.counts = new Map(names.map(name => [name, 0]))
        this.save()
    }

    /**
     * @param {string} name 
     */
    increment(name) {
        this.counts.set(name, this.counts.get(name) + 1)
        this.save()
    }
}
