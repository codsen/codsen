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
interface Opts<T = unknown> {
  decode: boolean;
  cb: null | ((obj: cbObj) => T);
  entityCatcherCb: null | ((from: number, to: number) => void);
  textAmpersandCatcherCb: null | ((idx: number) => void);
  /** Reports increasing integer percentages, ending at 100 after result callbacks. */
  progressFn: null | ((percDone: number) => void);
}
declare function fixEnt<T>(
  str: string,
  opts: Partial<Opts<T>> & {
    cb: (obj: cbObj) => T;
  },
): T[];
declare function fixEnt(
  str: string,
  opts: Partial<Opts> & {
    cb: null | undefined;
  },
): cbObj[];
declare function fixEnt(
  str: string,
  opts?: Partial<Omit<Opts, "cb">> & {
    cb?: never;
  },
): Ranges;
declare function fixEnt<T>(
  str: string,
  opts: Partial<Opts<T>>,
): Ranges | cbObj[] | T[];

export { allRules, fixEnt, version };
export type { Obj, Opts, Ranges, cbObj };
