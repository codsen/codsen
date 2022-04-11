declare const version: string;
interface Opts {
  arrayVsArrayAllMustBeFound: "any" | "all";
  caseSensitive: boolean;
}
declare const defaults: Opts;
/**
 * Like _.includes but with wildcards
 */
declare function includesWithGlob(
  input: string | string[],
  findThis: string | string[],
  opts?: Partial<Opts>
): boolean;

export { defaults, includesWithGlob, version };
