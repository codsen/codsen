import { version } from "../package.json";
interface Obj {
    [key: string]: any;
}
declare function sortAllObjectsSync(input: any): any;
declare function getKeyset<ValueType>(arrOfPromises: Iterable<PromiseLike<ValueType> | ValueType>, originalOpts?: {
    placeholder?: boolean;
}): Promise<Obj>;
declare function getKeysetSync(arrOriginal: Obj[], originalOpts?: {
    placeholder?: any;
}): {};
interface EnforceKeysetOpts {
    doNotFillThesePathsIfTheyContainPlaceholders: string[];
    placeholder: boolean;
    useNullAsExplicitFalse: boolean;
}
declare function enforceKeyset(obj: Obj, schemaKeyset: Obj, originalOpts?: EnforceKeysetOpts): Promise<Obj>;
declare function enforceKeysetSync(obj: Obj, schemaKeyset: Obj, originalOpts?: EnforceKeysetOpts): any;
declare function noNewKeysSync(obj: Obj, schemaKeyset: Obj): import("type-fest").JsonValue;
declare function findUnusedSync(arrOriginal: any[], originalOpts?: {
    placeholder?: boolean;
    comments?: string;
}): string[];
export { getKeysetSync, getKeyset, enforceKeyset, enforceKeysetSync, sortAllObjectsSync, noNewKeysSync, findUnusedSync, version, };
