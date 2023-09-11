type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Extras {
  whiteSpaceStartsAt: null | number;
  whiteSpaceEndsAt: null | number;
  str: string;
}
interface CbObj extends Extras {
  suggested: Range;
}
type Callback = (cbObj: CbObj) => any;
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
  type Callback,
  type CbObj,
  type Extras,
  type Opts,
  type Range,
  type Ranges as RangesType,
  type Res,
  cbSchema,
  collapse,
  defaults,
  version,
};
