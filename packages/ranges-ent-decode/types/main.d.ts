import { Ranges } from "../../../scripts/common";
import { version } from "../package.json";
interface Opts {
    isAttributeValue?: boolean;
    strict?: boolean;
}
declare function rEntDecode(str: string, originalOpts?: Opts): Ranges;
export { rEntDecode, version };
