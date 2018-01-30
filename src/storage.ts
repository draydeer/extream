export class Storage<T> {

    public deletedCount: number = 0;
    public lastScanIndex: number = 0;
    public storage: T[];

    public constructor(size: number = 0) {
        this.storage = size > 0 ? new Array(size) : [];
    }

    public add(value: T) {
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

        return value;
    }

    public addUnique(value: T) {
        return this.storage.indexOf(value) === - 1 ? this.add(value) : value;
    }

    public clear() {
        this.deletedCount = 0;
        this.lastScanIndex = 0;
        this.storage = [];

        return this;
    }

    public delete(value: T) {
        if (this.storage.length > 4 && this.deletedCount && this.deletedCount >= this.storage.length >> 1) {
            this.lastScanIndex = this.deletedCount = 0;

            this.storage = this.storage.filter(this._filter);
        }

        const i = this.storage.indexOf(value);

        if (i !== - 1) {
            this.lastScanIndex = i < this.lastScanIndex ? i : this.lastScanIndex;

            this.storage[i] = null;

            this.deletedCount ++;
        }

        return value;
    }

    protected _filter(value) {
        return value !== null;
    }

}
