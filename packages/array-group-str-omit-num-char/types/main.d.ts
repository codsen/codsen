import { version } from "../package.json";
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    wildcard?: string;
    dedupePlease?: boolean;
}
declare function groupStr(originalArr: any[], originalOpts?: Opts): UnknownValueObj;
export { groupStr, version };
