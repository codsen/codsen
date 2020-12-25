import { version } from "../package.json";
interface UnknownValueObj {
    [key: string]: any;
}
declare function getObj(originalAst: any, keyValPair: UnknownValueObj, replacementContentsArr?: UnknownValueObj[]): any;
export { getObj, version };
