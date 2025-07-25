type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
declare const allRules: string[];
interface Obj {
  [key: string]: any;
}
interface cbObj {
  rangeFrom: number;
  rangeTo: number;
  rangeValEncoded: string | null;
  rangeValDecoded: string | null;
  ruleName: string;
  entityName: string | null;
}
interface Opts {
  decode: boolean;
  cb: null | ((obj: cbObj) => void);
  entityCatcherCb: null | ((from: number, to: number) => void);
  textAmpersandCatcherCb: null | ((idx: number) => void);
  progressFn: null | ((percDone: number) => void);
}
declare function fixEnt(str: string, opts?: Partial<Opts>): Ranges;

export { allRules, fixEnt, version };
export type { Obj, Opts, Ranges, cbObj };
