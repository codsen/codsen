import { version } from "../package.json";
interface Obj {
    [key: string]: any;
}
interface Opts {
    placeholder: boolean;
    doNotFillThesePathsIfTheyContainPlaceholders: string[];
    useNullAsExplicitFalse: boolean;
}
declare function fillMissing(originalIncompleteWrapper: Obj, originalSchemaWrapper: Obj, originalOptsWrapper?: Opts): Obj;
export { fillMissing, version };
