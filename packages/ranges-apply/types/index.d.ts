declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;

declare function rApply(str: string, originalRangesArr: Ranges, progressFn?: (percentageDone: number) => void): string;

export { rApply, version };
