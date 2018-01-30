export declare class Storage<T> {
    lastScanIndex: number;
    removed: number;
    storage: T[];
    constructor(size?: number);
    add(value: T): T;
    clear(): this;
    delete(value: T): T;
    protected _filter(value: any): boolean;
}
