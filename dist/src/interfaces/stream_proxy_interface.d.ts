export interface StreamMasterInterface<T> {
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
}
