import { JsonValue } from "type-fest";
import { version } from "../package.json";
interface Opts {
    mode: 1 | 2;
}
declare function noNewKeys(inputOuter: JsonValue, referenceOuter: JsonValue, originalOptsOuter: Opts): JsonValue;
export { noNewKeys, version };
