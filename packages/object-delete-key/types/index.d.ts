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
declare function deleteKey(
  originalInput: Obj,
  originalOpts?: Partial<Opts>
): Obj;

export { deleteKey, version };
