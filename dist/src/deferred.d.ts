export declare class Deferred<T> {
    protected _isResolved: boolean;
    protected _isRejected: boolean;
    protected _promise: Promise<T>;
    protected _resolve: (data?: T) => any;
    protected _reject: (error?: any) => any;
    constructor();
    readonly isCompleted: boolean;
    readonly isResolved: boolean;
    readonly isRejected: boolean;
    readonly promise: Promise<T>;
    resolve(data?: T): this;
    reject(error?: T): this;
}
