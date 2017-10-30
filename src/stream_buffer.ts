export class StreamBuffer<T> {

    protected _buffer: T[] = [];
    protected _maxLength: number = 0;

    public constructor(maxLength: number = 0) {
        this._maxLength = maxLength;
    }

    public get isMaxReached(): boolean {
        return this._maxLength === 0 || this._maxLength === this._buffer.length;
    }

    public get buffer(): T[] {
        return this._buffer;
    }

    public push(data: T): boolean {
        if (this.isMaxReached) {
            return false;
        }

        this._buffer.push(data);

        return true;
    }

    public flush(): this {
        this._buffer = [];

        return this;
    }

}
