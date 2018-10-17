import {BufferIsEmptyError, BufferIsFullError} from './errors';
import {BufferInterface} from "./interfaces/buffer_interface";

const iteratorDone = { done: true, value: void 0 };
const iteratorNext = { done: false, value: void 0 };

export class CyclicBuffer<T> implements BufferInterface<T> {

    protected _buffer: T[];
    protected _headIndex: number = 0;
    protected _tailIndex: number = 0;

    public constructor(protected _size: number = 10, protected _preallocate?: boolean) {
        if (_size < 1) {
            throw new Error('Size must be >= 1');
        }

        if (_preallocate) {
            this._buffer = new Array<T>(_size);
        }
    }

    public get current(): T {
        if (this._headIndex === this._tailIndex) {
            throw new BufferIsEmptyError();
        }

        return this._buffer[this._tailIndex % this._size];
    }

    public get isEmpty(): boolean {
        return this._headIndex === this._tailIndex;
    }

    public add(data: T): this {
        if (this._buffer === void 0) {
            this._buffer = [];
        }

        if (this._buffer.length < this._size) {
            this._buffer.push(data);
        } else {
            if (this._headIndex - this._tailIndex === this._size) {
                throw new BufferIsFullError();
            }

            this._buffer[this._headIndex % this._size] = data;
        }

        this._headIndex += 1;

        return this;
    }

    public flush(): this {
        this._buffer = this._preallocate ? new Array<T>(this._size) : [];
        this._headIndex = 0;
        this._tailIndex = 0;

        return this;
    }

    public next(): IteratorResult<T> {
        if (this._headIndex === this._tailIndex) {
            return iteratorDone;
        }

        iteratorNext.value = this.shift();

        return iteratorNext;
    }

    public shift(): T {
        if (this._headIndex === this._tailIndex) {
            throw new BufferIsEmptyError();
        }

        const data = this._buffer[this._tailIndex % this._size];

        this._buffer[this._tailIndex % this._size] = null;
        this._tailIndex += 1;

        return data;
    }

}
