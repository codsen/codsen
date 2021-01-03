import { flattenObject, flattenArr, arrayiffyString, Opts } from "./util";
import { version } from "../package.json";
declare const defaults: Opts;
declare function flattenReferencing(originalInput1: any, originalReference1: any, opts1?: Opts): any;
export { flattenReferencing, flattenObject, flattenArr, arrayiffyString, defaults, version, };
