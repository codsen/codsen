type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Obj {
  i: number;
  val: any;
}
type Callback = (obj: Obj) => void;
declare function rIterate(
  str: string,
  input: Ranges,
  cb: Callback,
  offset?: number,
): void;

export { type Callback, type Obj, rIterate, version };
