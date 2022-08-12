declare const version: string;
interface Obj {
  [key: string]: any;
}
declare type Only = "array" | "object" | "any";
interface Opts {
  key: null | string;
  val: any;
  cleanup: boolean;
  only: Only;
}
declare const defaults: Opts;
declare function deleteKey(input: Obj, opts?: Partial<Opts>): Obj;

export { Obj, Opts, defaults, deleteKey, version };
