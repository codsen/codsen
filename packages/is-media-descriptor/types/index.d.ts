declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

interface Opts {
  offset: number;
}
interface ResObj {
  idxFrom: number;
  idxTo: number;
  message: string;
  fix: {
    ranges: Ranges;
  } | null;
}

declare const version: string;
declare const defaults: {
  offset: number;
};
declare function isMediaD(str: string, opts?: Partial<Opts>): ResObj[];

export { Opts, ResObj, defaults, isMediaD, version };
