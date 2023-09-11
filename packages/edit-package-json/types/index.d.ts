declare const version: string;
interface Inputs {
  str: string;
  path: string;
  valToInsert?: string | number;
  mode: "set" | "del";
}
declare function set(
  str: string,
  path: string,
  valToInsert: string | number,
): string;
declare function del(str: string, path: string): string;

export { type Inputs, del, set, version };
