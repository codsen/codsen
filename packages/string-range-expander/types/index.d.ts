type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  str: string;
  from: number;
  to: number;
  ifLeftSideIncludesThisThenCropTightly?: string;
  ifLeftSideIncludesThisCropItToo?: string;
  ifRightSideIncludesThisThenCropTightly?: string;
  ifRightSideIncludesThisCropItToo?: string;
  extendToOneSide?: false | "left" | "right";
  wipeAllWhitespaceOnLeft?: boolean;
  wipeAllWhitespaceOnRight?: boolean;
  addSingleSpaceToPreventAccidentalConcatenation?: boolean;
}
type ResolvedOpts = Required<Opts>;
declare const defaults: ResolvedOpts;
declare function expander(opts: Opts): Range;

export { defaults, expander, version };
export type { Opts, Range };
