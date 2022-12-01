declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Extras {
  whiteSpaceStartsAt: null | number;
  whiteSpaceEndsAt: null | number;
  str: string;
}
interface CbObj extends Extras {
  suggested: Range;
}
declare type Callback = (cbObj: CbObj) => any;
interface Opts {
  trimStart: boolean;
  trimEnd: boolean;
  trimLines: boolean;
  trimnbsp: boolean;
  removeEmptyLines: boolean;
  limitConsecutiveEmptyLinesTo: number;
  enforceSpacesOnly: boolean;
  cb: Callback;
}
declare const defaults: Opts;
interface Res {
  result: string;
  ranges: Ranges;
}
declare const cbSchema: string[];
declare function collapse(str: string, opts?: Partial<Opts>): Res;

export {
  Callback,
  CbObj,
  Extras,
  Opts,
  Range,
  Ranges as RangesType,
  Res,
  cbSchema,
  collapse,
  defaults,
  version,
};
