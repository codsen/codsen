import { version } from "../package.json";
interface Obj {
    [key: string]: any;
}
interface Opts {
    flattenArraysContainingStringsToBeEmpty: boolean;
}
declare function flattenAllArrays(originalIncommingObj: Obj, originalOpts?: Opts): Obj;
export { flattenAllArrays, version };
