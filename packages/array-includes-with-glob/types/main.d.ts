import { version } from "../package.json";
interface Opts {
    arrayVsArrayAllMustBeFound?: "any" | "all";
    caseSensitive?: boolean;
}
declare const defaults: Opts;
declare function includesWithGlob(originalInput: string | string[], stringToFind: string | string[], originalOpts?: Opts): boolean;
export { includesWithGlob, defaults, version };
