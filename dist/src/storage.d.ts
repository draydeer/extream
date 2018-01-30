export declare class Storage<T> {
    deletedCount: number;
    lastScanIndex: number;
    storage: T[];
    constructor(size?: number);
    add(value: T): T;
    addUnique(value: T): T;
    clear(): this;
    delete(value: T): T;
    protected _filter(value: any): boolean;
}
