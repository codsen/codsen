import { version } from "../package.json";
declare function nativeToUnicode(str: string, indexes: any): number | string;
declare function unicodeToNative(str: string, indexes: any): number | string;
export { nativeToUnicode, unicodeToNative, version };
