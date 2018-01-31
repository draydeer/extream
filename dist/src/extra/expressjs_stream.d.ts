import { Stream } from "../stream";
export declare class ExpressjsStream<T> extends Stream<T> {
}
export declare class ExpressjsRequestStream<T> extends Stream<T> {
    constructor();
    end(): this;
}
