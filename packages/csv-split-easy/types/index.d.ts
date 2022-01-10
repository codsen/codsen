declare const version: string;
interface Opts {
  removeThousandSeparatorsFromNumbers: boolean;
  padSingleDecimalPlaceNumbers: boolean;
  forceUKStyle: boolean;
}
declare const defaults: Opts;
declare function splitEasy(
  str: string,
  originalOpts?: Partial<Opts>
): string[][];

export { defaults, splitEasy, version };
