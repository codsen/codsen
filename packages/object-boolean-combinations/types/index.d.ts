import { Obj } from "codsen-utils";

declare const version: string;
interface BoolObj {
  [key: string]: boolean;
}
declare function combinations(input: Obj, Override?: undefined | Obj): Obj[];

export { type BoolObj, combinations, version };
