declare const version: string;
interface Res {
  todoLines: {
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
  resultArr: Res["todoLines"],
  receivedMaxLen: number
): {
  extracted: string;
  counts: number[];
  length: number;
  lengthCompensation: number;
}[];
declare function editor(todo?: string, copy?: string): Res;

export { Res, editor, isLetter, setLengthCompensation, version };
