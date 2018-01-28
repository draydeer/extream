import {StreamInterface} from "./stream_interface";

export interface SubscriberInterface<T> {
    readonly id: string;
    readonly isIsolated: boolean;
    readonly stream: StreamInterface<T>;

    doComplete(): this;
    doData(data: T): this;
    doError(error: any): this;
    isolated(): this;
    once(): this;
    unsubscribe(): this;
}
