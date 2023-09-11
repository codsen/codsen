import { Ranges } from "ranges-crop";
export { Ranges } from "ranges-crop";

declare const version: string;
type OffsetValueCb = (amountToOffset: number) => void;
type Callback = (
  fromIdx: number,
  toIdx: number,
  offsetValueCb: OffsetValueCb,
) => void;
declare function rProcessOutside(
  originalStr: string,
  originalRanges: Ranges,
  cb: Callback,
  skipChecks?: boolean,
): void;

export { type Callback, type OffsetValueCb, rProcessOutside, version };
