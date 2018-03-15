export interface Msg<T=any> {
    data?: T;
    region?: any;
    type?: any;
}

export function make<T=any>(data?: T, type?: any, region?: any): Msg<T> {
    return {data, region, type};
}

export function makeBy<T=any>(msg: Msg, data?: T, type?: any, region?: any): Msg<T> {
    const copy = Object.assign({}, msg);

    if (data) {
        copy.data = data;
    }

    if (region) {
        copy.region = region;
    }

    if (type) {
        copy.type = type;
    }

    return copy;
}
