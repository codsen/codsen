declare const version: string;
interface BoolObj {
  [key: string]: boolean;
}
interface Obj {
  [key: string]: any;
}
declare function combinations(
  input: Obj,
  Override?: undefined | Obj
): BoolObj[];

export { combinations, version };
