import {BufferIsEmptyError, BufferIsFullError} from './errors';

const iteratorDone = { done: true };
const iteratorNext = { done: false, value: void 0 };

export class StreamBuffer<T> implements Iterator<T> {

    protected _buffer: T[];
    protected _headIndex: number = 0;
    protected _size: number;
    protected _tailIndex: number = 0;

    public constructor(size: number = 10, preallocate?: boolean) {
        if (size < 1) {
            throw new Error('Size must be >= 0');
        }

        this._size = size;

        if (preallocate) {
            this._buffer = new Array<T>(size);
        }
    }

    public get isEmpty(): boolean {
        return this._headIndex === this._tailIndex;
    }

    public next(): IteratorResult<T> {
        if (this.isEmpty) {
            return iteratorDone;
        }

        iteratorNext.value = this.shift();

        return iteratorNext;
    }

    public flush(): this {
        this._buffer = [];
        this._headIndex = this._tailIndex = 0;

        return this;
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

        this._headIndex ++;

        return this;
    }

    public shift(): T {
        if (this._headIndex === this._tailIndex) {
            throw new BufferIsEmptyError();
        }

        const data = this._buffer[this._tailIndex % this._size];

        this._buffer[this._tailIndex % this._size] = null;
        this._tailIndex ++;

        return data;
    }

}
