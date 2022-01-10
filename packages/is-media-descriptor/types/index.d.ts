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
declare function isMediaD(
  originalStr: string,
  originalOpts?: Partial<Opts>
): ResObj[];

export { defaults, isMediaD, version };
