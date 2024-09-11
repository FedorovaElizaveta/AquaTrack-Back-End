import { type RequestInit } from 'node-fetch';
export declare const DEFAULT_FETCH_TIMEOUT = 3000;
export type FetchWithTimeoutOptions = RequestInit & {
    timeout?: number;
};
declare const _default: (url: string, { timeout, ...options }?: FetchWithTimeoutOptions) => Promise<import("node-fetch").Response>;
export default _default;
