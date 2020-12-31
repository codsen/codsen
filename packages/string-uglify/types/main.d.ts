import { version } from "../package.json";
declare function uglifyArr(arr: string[]): string[];
declare function uglifyById(refArr: string[], idNum: number): string;
export { uglifyById, uglifyArr, version };
