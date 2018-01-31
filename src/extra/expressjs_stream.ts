import * as fetch from "node-fetch";
import {StreamInterface} from "../interfaces/stream_interface";
import {Stream} from "../stream";

export class ExpressjsStream<T> extends Stream<T> {

}

export class ExpressjsRequestStream<T> extends Stream<T> {

    public constructor() {
        super();
    }

    public end(): this {
        return this;
    }

}
