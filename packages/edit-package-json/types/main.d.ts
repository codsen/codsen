declare const version: string;
declare function set(str: string, path: string, valToInsert: string | number): string;
declare function del(str: string, path: string): string;

export { del, set, version };
