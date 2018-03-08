export interface ResourceInterface<T> {
    isClosed: boolean;
    resource: T;
    clear(): this;
    close(): this;
    open(...args: any[]): this;
}
