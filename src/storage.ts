export class Storage<T> {

    public deletedCount: number = 0;
    public lastScanIndex: number = 0;
    public storage: T[] = void 0;
    public tagged: Storage<T>[] = void 0;

    public constructor(public size: number = 0, public taggedSize: number = 1) {
        this.storage = size > 0 ? new Array(size) : [];
    }

    public getTagged(tag: number): void|Storage<T> {
        return this.tagged && tag < this.tagged.length ? this.tagged[tag] : void 0;
    }

    public add(value: T, tag?: number) {
        if (this.storage.length > 4 && this.deletedCount) {
            if (this.deletedCount >= this.storage.length >> 1) {
                this.lastScanIndex = this.deletedCount = 0;

                this.storage = this.storage.filter(this._filter);
            } else if (this.deletedCount >= this.storage.length >> 2) {
                this.lastScanIndex = this.storage.indexOf(null, this.lastScanIndex);

                this.storage[this.lastScanIndex] = value;

                this.deletedCount --;
            }
        } else {
            this.storage.push(value);
        }

        if (tag !== void 0) {
            this.byTag(tag).add(value);
        }

        return value;
    }

    public addUnique(value: T, tag?: number) {
        return this.storage.indexOf(value) === - 1 ? this.add(value, tag) : value;
    }

    public byTag(tag: number): Storage<T> {
        if (this.tagged === void 0) {
            this.tagged = new Array(this.taggedSize);
        }

        let storage = this.tagged[tag];

        if (storage === void 0) {
            storage = this.tagged[tag] = new Storage<T>();
        }

        return storage;
    }

    public clear() {
        this.deletedCount = 0;
        this.lastScanIndex = 0;
        this.storage = [];

        if (this.tagged) {
            for (const tagged of this.tagged) {
                tagged.clear();
            }

            this.tagged = void 0;
        }

        return this;
    }

    public delete(value: T, tag?: number) {
        if (this.storage.length > 4 && this.deletedCount && this.deletedCount >= this.storage.length >> 1) {
            this.lastScanIndex = this.deletedCount = 0;

            this.storage = this.storage.filter(this._filter);
        }

        const i = this.storage.indexOf(value);

        if (i !== - 1) {
            this.lastScanIndex = i < this.lastScanIndex ? i : this.lastScanIndex;

            this.storage[i] = null;

            this.deletedCount ++;

            if (this.tagged && tag !== void 0 && tag < this.tagged.length) {
                this.tagged[tag].delete(value);
            }
        }

        return value;
    }

    protected _filter(value) {
        return value !== null;
    }

}
