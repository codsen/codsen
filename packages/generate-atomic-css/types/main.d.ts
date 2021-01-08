import { version } from "../package.json";
import { extractFromToSource, headsAndTails } from "./util";
interface Opts {
    includeConfig: boolean;
    includeHeadsAndTails: boolean;
    pad: boolean;
    configOverride: null | string;
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
}
declare const defaults: Opts;
declare function genAtomic(str: string, originalOpts?: Opts): {
    log: {
        count: number;
    };
    result: string;
};
export { genAtomic, defaults, version, headsAndTails, extractFromToSource };
