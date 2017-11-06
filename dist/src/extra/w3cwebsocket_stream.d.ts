import { Stream } from "../stream";
export declare class W3CWebSocketStream<T> extends Stream<T> {
    protected _client: any;
    constructor(url: string);
    emit(data: T): this;
    protected init(url: string): void;
    protected onComplete(): void;
    protected onData(data: any): void;
    protected onError(error: any): void;
}
