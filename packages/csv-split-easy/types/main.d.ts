import { version } from "../package.json";
interface Opts {
    removeThousandSeparatorsFromNumbers: boolean;
    padSingleDecimalPlaceNumbers: boolean;
    forceUKStyle: boolean;
}
declare const defaults: Opts;
declare function splitEasy(str: string, originalOpts?: Opts): string[][];
export { splitEasy, defaults, version };
