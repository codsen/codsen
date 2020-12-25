import { version } from "../package.json";
import { JsonValue } from "type-fest";
declare function looseCompare(bigObj: JsonValue, smallObj: JsonValue): boolean | undefined;
export { looseCompare, version };
