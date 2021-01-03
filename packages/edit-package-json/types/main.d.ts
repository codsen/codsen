import { version } from "../package.json";
declare function set(str: string, path: string, valToInsert: string | number): string;
declare function del(str: string, path: string): string;
export { set, del, version };
