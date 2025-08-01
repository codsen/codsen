declare const headsAndTails: {
  CONFIGHEAD: string;
  CONFIGTAIL: string;
  CONTENTHEAD: string;
  CONTENTTAIL: string;
};
declare function extractFromToSource(
  str: string,
  fromDefault?: number,
  toDefault?: number,
): [from: number, to: number, source: string];

declare const version: string;
interface Opts {
  includeConfig: boolean;
  includeHeadsAndTails: boolean;
  pad: boolean;
  configOverride: null | string;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
declare const defaults: Opts;
interface Res {
  log: {
    count: number;
  };
  result: string;
}
declare function genAtomic(str: string, opts?: Partial<Opts>): Res;

export { defaults, extractFromToSource, genAtomic, headsAndTails, version };
export type { Opts, Res };
