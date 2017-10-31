import { Stream } from "../stream";
export declare class W3CWebSocketStream extends Stream<any> {
    protected _client: any;
    constructor(url: string);
    emit(data: any): this;
}
