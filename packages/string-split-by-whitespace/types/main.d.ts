import { version } from "../package.json";
import { Range } from "../../../scripts/common";
interface Opts {
    ignoreRanges: Range[];
}
declare function splitByW(str: string, originalOpts?: Opts): string[];
export { splitByW, version };
