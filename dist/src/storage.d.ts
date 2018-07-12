export declare class Storage<T> {
    size: number;
    taggedSize: number;
    deletedCount: number;
    lastScanIndex: number;
    storage: T[];
    tagged: Storage<T>[];
    constructor(size?: number, taggedSize?: number);
    getTagged(tag: number): void | Storage<T>;
    add(value: T, tag?: number): T;
    addUnique(value: T, tag?: number): T;
    byTag(tag: number): Storage<T>;
    clear(): this;
    delete(value: T, tag?: number): T;
    protected _filter(value: any): boolean;
}
