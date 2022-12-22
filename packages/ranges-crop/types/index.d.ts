import { Ranges } from "ranges-merge";
export { Range, Ranges } from "ranges-merge";

declare const version: string;
declare function rCrop(arrOfRanges: Ranges, strLen: number): Ranges;

export { rCrop, version };
