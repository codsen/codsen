import { Ranges } from "ranges-merge";
export { Ranges } from "ranges-merge";

declare const version: string;
interface Opts {
  isAttributeValue: boolean;
  strict: boolean;
}
declare const defaults: Opts;
declare function rEntDecode(str: string, opts?: Partial<Opts>): Ranges;

export { type Opts, defaults, rEntDecode, version };
