declare const version: string;
interface Opts {
  stringOffset: number;
  maxDistance: number;
  ignoreWhitespace: boolean;
}
declare const defaults: Opts;
interface DataObj {
  idxFrom: number;
  idxTo: number;
}
declare function findMalformed(
  str: string,
  refStr: string,
  cb: (obj: DataObj) => void,
  opts?: Partial<Opts>,
): void;

export { type DataObj, type Opts, defaults, findMalformed, version };
