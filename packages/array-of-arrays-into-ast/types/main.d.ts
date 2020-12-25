import { version } from "../package.json";
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    dedupe?: boolean;
}
declare const defaults: Opts;
declare function generateAst(input: any[], originalOpts?: Opts): UnknownValueObj;
export { generateAst, defaults, version };
