import { version as v } from "../package.json";

export const version: string = v;
export {
  type DecodeOptions,
  decode,
  type Reference,
  type ScanOptions,
  scanReference,
} from "./decode";
export { type EncodeOptions, encode } from "./encode";
export { encodeNumeric } from "./encode-numeric";
export {
  type EscapeAttributeOptions,
  escapeAttribute,
  escapeText,
} from "./escape";
export type { Completion, ObserveOptions } from "./observe";
