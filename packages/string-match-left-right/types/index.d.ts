declare const version: string;
interface Opts {
  cb:
    | undefined
    | null
    | ((
        wholeCharacterOutside?: string | undefined,
        theRemainderOfTheString?: string,
        firstCharOutsideIndex?: number,
      ) => string | boolean);
  i: boolean;
  trimBeforeMatching: boolean;
  trimCharsBeforeMatching: string | string[];
  maxMismatches: number;
  firstMustMatch: boolean;
  lastMustMatch: boolean;
  hungry: boolean;
}
declare const defaults: Opts;
declare const defaultGetNextIdx: (index: number) => number;
declare function matchLeftIncl(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>,
): boolean | string;
declare function matchLeft(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>,
): boolean | string;
declare function matchRightIncl(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>,
): boolean | string;
declare function matchRight(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>,
): boolean | string;

export {
  type Opts,
  defaultGetNextIdx,
  defaults,
  matchLeft,
  matchLeftIncl,
  matchRight,
  matchRightIncl,
  version,
};
