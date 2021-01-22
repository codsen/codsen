declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;

declare type OffsetValueCb = (amountToOffset: number) => void;
declare type Callback = (fromIdx: number, toIdx: number, offsetValueCb: OffsetValueCb) => void;
declare function rProcessOutside(originalStr: string, originalRanges: Ranges, cb: Callback, skipChecks?: boolean): void;

export { rProcessOutside, version };
