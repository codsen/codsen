import { JSONValue } from "codsen-utils";

declare const version: string;
interface Opts {
  mode: 1 | 2;
}
declare const defaults: Opts;
declare function noNewKeys(
  input: JSONValue,
  reference: JSONValue,
  opts?: Partial<Opts>,
): string[];

export { Opts, defaults, noNewKeys, version };
