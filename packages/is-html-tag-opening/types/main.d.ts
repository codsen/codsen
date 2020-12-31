import { defaultOpts as defaults } from "./util";
import { version } from "../package.json";
interface Opts {
    allowCustomTagNames: boolean;
    skipOpeningBracket: boolean;
}
declare function isOpening(str: string, idx?: number, originalOpts?: Opts): boolean;
export { isOpening, defaults, version };
