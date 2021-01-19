declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;

declare function rCrop(arrOfRanges: Ranges, strLen: number): Ranges;

export { rCrop, version };
