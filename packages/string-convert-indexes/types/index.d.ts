declare const version: string;
declare function nativeToUnicode(str: string, indexes: any): number | string;
declare function unicodeToNative(str: string, indexes: any): number | string;

export { nativeToUnicode, unicodeToNative, version };
