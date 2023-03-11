import { Obj } from "codsen-utils";

declare const version: string;
interface Opts {
  placeholder: boolean;
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  useNullAsExplicitFalse: boolean;
}
declare const defaults: Opts;
declare function fillMissing(
  incomplete: Obj,
  schema: Obj,
  opts?: Partial<Opts>
): Obj;

export { Opts, defaults, fillMissing, version };
