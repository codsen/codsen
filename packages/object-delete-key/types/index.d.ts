declare const version: string;
interface Obj {
  [key: string]: any;
}
type Only = "array" | "object" | "any";
interface Opts {
  key: null | string;
  val: any;
  cleanup: boolean;
  only: Only;
}
declare const defaults: Opts;
declare function deleteKey(input: Obj, opts?: Partial<Opts>): Obj;

export { type Obj, type Opts, defaults, deleteKey, version };
