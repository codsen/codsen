import { version } from "../package.json";
interface Obj {
    [key: string]: any;
}
interface Opts {
    key: null | string;
    val: any;
    cleanup: boolean;
    only: "array" | "object" | "any";
}
declare function deleteKey(originalInput: Obj, originalOpts: Opts): Obj;
export { deleteKey, version };
