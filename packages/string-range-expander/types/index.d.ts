declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  str: string;
  from: number;
  to: number;
  ifLeftSideIncludesThisThenCropTightly: string;
  ifLeftSideIncludesThisCropItToo: string;
  ifRightSideIncludesThisThenCropTightly: string;
  ifRightSideIncludesThisCropItToo: string;
  extendToOneSide: false | "left" | "right";
  wipeAllWhitespaceOnLeft: boolean;
  wipeAllWhitespaceOnRight: boolean;
  addSingleSpaceToPreventAccidentalConcatenation: boolean;
}
declare const defaults: Opts;
declare function expander(opts: Partial<Opts>): Range;

export { Opts, Range, defaults, expander, version };
