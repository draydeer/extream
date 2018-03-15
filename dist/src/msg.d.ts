export interface Msg<T = any> {
    data?: T;
    region?: any;
    type?: any;
}
export declare function make<T = any>(data?: T, type?: any, region?: any): Msg<T>;
export declare function makeBy<T = any>(msg: Msg, data?: T, type?: any, region?: any): Msg<T>;
