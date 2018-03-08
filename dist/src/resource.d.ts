/// <reference types="node" />
import { ResourceInterface } from './interfaces/resource_interface';
export declare class TimerResource implements ResourceInterface<NodeJS.Timer> {
    isClosed: boolean;
    resource: NodeJS.Timer;
    constructor();
    clear(): this;
    close(): this;
    open(cb: any, seconds: any): this;
}
