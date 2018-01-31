export interface ResourceInterface<T> {
    resource: T;

    create(...args: any[]): this;
    close(): this;
}
