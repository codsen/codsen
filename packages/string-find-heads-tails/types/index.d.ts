declare const version: string;
interface Opts {
  fromIndex?: number;
  throwWhenSomethingWrongIsDetected?: boolean;
  allowWholeValueToBeOnlyHeadsOrTails?: boolean;
  source?: string;
  matchHeadsAndTailsStrictlyInPairsByTheirOrder?: boolean;
  relaxedAPI?: boolean;
}
declare const defaults: {
  fromIndex: number;
  throwWhenSomethingWrongIsDetected: boolean;
  allowWholeValueToBeOnlyHeadsOrTails: boolean;
  source: string;
  matchHeadsAndTailsStrictlyInPairsByTheirOrder: boolean;
  relaxedAPI: boolean;
};
interface ResObj {
  headsStartAt: number;
  headsEndAt: number;
  tailsStartAt: number;
  tailsEndAt: number;
}
declare function strFindHeadsTails(
  str: string,
  heads: string | string[],
  tails: string | string[],
  originalOpts?: Opts
): ResObj[];

export { defaults, strFindHeadsTails, version };
