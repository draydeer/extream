import {StreamInterface} from "./stream_interface";

export interface SubscriberInterface<T> {
    id: string;
    stream: StreamInterface<T>;

    doComplete(): this;
    doData(data: T): this;
    doError(error: any): this;
    once(): this;
    unsubscribe(): this;
}
