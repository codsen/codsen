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
declare function isLetter(str: unknown): boolean;
declare function setLengthCompensation(
  resultArr: Res["result"],
  receivedMaxLen: number
): {
  extracted: string;
  counts: number[];
  length: number;
  lengthCompensation: number;
}[];
declare function editor(
  todo?: string,
  copy?: string,
  opts?: Partial<Opts>
): Res;

export { Opts, Res, editor, isLetter, setLengthCompensation, version };
