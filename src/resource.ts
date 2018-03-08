import {ResourceInterface} from './interfaces/resource_interface';

export class TimerResource implements ResourceInterface<NodeJS.Timer> {

    public isClosed: boolean;
    public resource: NodeJS.Timer;

    public constructor() {

    }

    public clear(): this {
        clearTimeout(this.resource);

        return this;
    }

    public close(): this {
        this.isClosed = true;

        return this.clear();
    }

    public open(cb, seconds): this {
        if (this.isClosed || this.resource) {
            return this;
        }

        this.resource = setTimeout(() => {
            this.resource = null;

            cb();
        }, seconds * 1000);

        return this;
    }

}
