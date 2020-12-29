import { version } from "../package.json";
import { Ranges } from "../../../scripts/common";
interface Opts {
    classicTrim: boolean;
    cr: boolean;
    lf: boolean;
    tab: boolean;
    space: boolean;
    nbsp: boolean;
}
declare const defaults: Opts;
interface Res {
    res: string;
    ranges: Ranges;
}
declare function trimSpaces(str: string, originalOpts?: Opts): Res;
export { trimSpaces, defaults, version };
