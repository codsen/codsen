declare const version: string;
interface Opts {
  removeThousandSeparatorsFromNumbers: boolean;
  padSingleDecimalPlaceNumbers: boolean;
  forceUKStyle: boolean;
}
declare const defaults: Opts;
declare function remSep(str: string, opts?: Partial<Opts>): string;

export { defaults, remSep, version };
