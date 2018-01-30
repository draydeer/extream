export class Storage<T> {

    public lastScanIndex: number = 0;
    public removed: number = 0;
    public storage: T[];

    public constructor(size: number = 0) {
        this.storage = size > 0 ? new Array(size) : [];
    }

    public add(value: T) {
        if (this.storage.length > 4 && this.removed) {
            if (this.removed >= this.storage.length >> 1) {
                this.lastScanIndex = this.removed = 0;

                this.storage = this.storage.filter(this._filter);
            } else if (this.removed >= this.storage.length >> 2) {
                this.lastScanIndex = this.storage.indexOf(null, this.lastScanIndex);

                this.storage[this.lastScanIndex] = value;

                this.removed --;
            }
        } else {
            this.storage.push(value);
        }

        return value;
    }

    public clear() {
        this.lastScanIndex = 0;
        this.removed = 0;
        this.storage = [];

        return this;
    }

    public delete(value: T) {
        if (this.storage.length > 4 && this.removed && this.removed >= this.storage.length >> 1) {
            this.lastScanIndex = this.removed = 0;

            this.storage = this.storage.filter(this._filter);
        }

        const i = this.storage.indexOf(value);

        if (i !== - 1) {
            this.lastScanIndex = i < this.lastScanIndex ? i : this.lastScanIndex;

            this.storage[i] = null;

            this.removed ++;
        }

        return value;
    }

    protected _filter(value) {
        return value !== null;
    }

}
