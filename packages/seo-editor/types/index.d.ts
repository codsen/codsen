declare const version: string;
interface Opts {
  cb: () => string;
}
interface Res {
  result: {
    extracted: string;
    counts: number[];
    length: number;
    lengthCompensation: number;
  }[];
  chunkWordCounts: number[];
  todoTotal: number;
  completion: number[];
  log: {
    timeTakenInMilliseconds: number;
  };
}
declare function editor(
  todo?: string,
  copy?: string,
  opts?: Partial<Opts>
): Res;

export { Opts, editor, version };
