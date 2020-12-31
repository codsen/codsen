import { version } from "../package.json";
interface Opts {
    arraysMustNotContainPlaceholders: boolean;
}
declare function allEq(inputOriginal: any, valueOriginal: any, originalOpts?: Opts): boolean;
export { allEq, version };
