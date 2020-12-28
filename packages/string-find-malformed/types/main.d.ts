import { version } from "../package.json";
interface Opts {
    stringOffset?: number;
    maxDistance?: number;
    ignoreWhitespace?: boolean;
}
declare const defaults: Opts;
interface DataObj {
    idxFrom: number;
    idxTo: number;
}
declare function findMalformed(str: string, refStr: string, cb: (obj: DataObj) => void, originalOpts?: Opts | undefined | null): void;
export { findMalformed, defaults, version };
