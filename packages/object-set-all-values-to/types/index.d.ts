declare const version: string;
interface Obj {
  [key: string]: any;
}
declare function setAllValuesTo(input: Obj, value?: any): Obj;

export { setAllValuesTo, version };
export type { Obj };
