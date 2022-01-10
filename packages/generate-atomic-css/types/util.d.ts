interface Obj {
  [key: string]: any;
}
declare function isStr(something: any): boolean;
declare const headsAndTails: {
  CONFIGHEAD: string;
  CONFIGTAIL: string;
  CONTENTHEAD: string;
  CONTENTTAIL: string;
};
declare function extractConfig(
  str: string
): [extractedConfig: string, rawContentAbove: string, rawContentBelow: string];
declare function extractFromToSource(
  str: string,
  fromDefault?: number,
  toDefault?: number
): [from: number, to: number, source: string];
declare function prepLine(
  str: string,
  progressFn: null | ((percDone: number) => void),
  subsetFrom: number,
  subsetTo: number,
  generatedCount: Obj,
  pad: boolean
): string;
declare function prepConfig(
  str: string,
  progressFn: null | ((percDone: number) => void),
  progressFrom: number,
  progressTo: number,
  trim: boolean | undefined,
  generatedCount: Obj,
  pad: boolean
): string;
export {
  Obj,
  prepLine,
  prepConfig,
  isStr,
  extractFromToSource,
  extractConfig,
  headsAndTails,
};
