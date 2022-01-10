declare const version: string;
interface Opts {
  arraysMustNotContainPlaceholders: boolean;
}
declare function allEq(
  inputOriginal: any,
  valueOriginal: any,
  originalOpts?: Partial<Opts>
): boolean;

export { allEq, version };
