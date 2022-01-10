import { Ranges } from "ranges-merge";

declare const version: string;
interface Opts {
  isAttributeValue: boolean;
  strict: boolean;
}
declare const defaults: Opts;
declare function rEntDecode(str: string, originalOpts?: Partial<Opts>): Ranges;

export { defaults, rEntDecode, version };
