declare const version: string;
interface Opts {
  removeThousandSeparatorsFromNumbers: boolean;
  padSingleDecimalPlaceNumbers: boolean;
  forceUKStyle: boolean;
}
declare const defaults: Opts;
declare function splitEasy(str: string, opts?: Partial<Opts>): string[][];

export { Opts, defaults, splitEasy, version };
