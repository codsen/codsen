declare const version: string;
interface Obj {
  [key: string]: any;
}
declare function setAllValuesTo(inputOriginal: Obj, valueOriginal?: any): Obj;

export { setAllValuesTo, version };
