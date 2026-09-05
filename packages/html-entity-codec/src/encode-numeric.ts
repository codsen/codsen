import { encodeValue } from "./encode-value";
import { assertString, type ObserveOptions } from "./observe";

/** Numeric-only encoding; bundlers can omit the canonical named table. */
export function encodeNumeric(str: string, opts: ObserveOptions = {}): string {
  assertString(str, "encodeNumeric");
  return encodeValue(str, opts);
}
