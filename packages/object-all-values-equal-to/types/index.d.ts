declare const version: string;
interface Opts {
  arraysMustNotContainPlaceholders: boolean;
}
declare const defaults: Opts;
declare function allEq(
  inputOriginal: any,
  valueOriginal: any,
  originalOpts?: Partial<Opts>
): boolean;

export { allEq, defaults, version };
