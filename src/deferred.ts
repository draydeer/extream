export class Deferred<T> {

    protected _isResolved: boolean = false;
    protected _isRejected: boolean = false;
    protected _promise: Promise<T>;
    protected _resolve: (data?: T) => any;
    protected _reject: (error?: any) => any;

    constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public get isCompleted(): boolean {
        return this._isRejected || this._isResolved;
    }

    public get isResolved(): boolean {
        return this._isResolved;
    }

    public get isRejected(): boolean {
        return this._isRejected;
    }

    public get promise(): Promise<T> {
        return this._promise;
    }

    public resolve(data?: T): this {
        if (false === this.isCompleted) {
            this._resolve(data);

            this._isResolved = true;
        }

        return this;
    }

    public reject(error?: T): this {
        if (false === this.isCompleted) {
            this._reject(error);

            this._isRejected = true;
        }

        return this;
    }
}
