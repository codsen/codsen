declare const version: string;
declare function uglifyArr(arr: string[]): string[];
declare function uglifyById(refArr: string[], idNum: number): string;

export { uglifyArr, uglifyById, version };
