import { version } from "../package.json";
interface Obj {
    [key: string]: any;
}
declare function setAllValuesTo(inputOriginal: Obj, valueOriginal?: any): Obj;
export { setAllValuesTo, version };
