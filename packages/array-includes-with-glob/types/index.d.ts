declare const version: string;
interface Opts {
    arrayVsArrayAllMustBeFound?: "any" | "all";
    caseSensitive?: boolean;
}
declare const defaults: Opts;
/**
 * Like _.includes but with wildcards
 */
declare function includesWithGlob(originalInput: string | string[], stringToFind: string | string[], originalOpts?: Opts): boolean;

export { defaults, includesWithGlob, version };
