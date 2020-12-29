import { version } from "../package.json";
import { Range } from "../../../scripts/common";
interface Opts {
    str: string;
    from: number;
    to: number;
    ifLeftSideIncludesThisThenCropTightly: string;
    ifLeftSideIncludesThisCropItToo: string;
    ifRightSideIncludesThisThenCropTightly: string;
    ifRightSideIncludesThisCropItToo: string;
    extendToOneSide: false | "left" | "right";
    wipeAllWhitespaceOnLeft: boolean;
    wipeAllWhitespaceOnRight: boolean;
    addSingleSpaceToPreventAccidentalConcatenation: boolean;
}
declare const defaults: Opts;
declare function expander(originalOpts: Opts): Range;
export { expander, defaults, version };
