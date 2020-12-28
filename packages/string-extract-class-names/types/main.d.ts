import { Ranges } from "../../../scripts/common";
import { version } from "../package.json";
interface Result {
    res: string[];
    ranges: Ranges;
}
declare function extract(str: string): Result;
export { extract, version };
