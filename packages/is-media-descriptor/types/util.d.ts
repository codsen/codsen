import { Ranges } from "../../../scripts/common";
interface Opts {
    offset: number;
}
declare const recognisedMediaTypes: string[];
declare const lettersOnlyRegex: RegExp;
interface LoopOpts extends Opts {
    idxFrom: number;
    idxTo: number;
}
interface ResObj {
    idxFrom: number;
    idxTo: number;
    message: string;
    fix: {
        ranges: Ranges;
    } | null;
}
declare function loop(str: string, opts: LoopOpts, res: ResObj[]): void;
export { loop, recognisedMediaTypes, lettersOnlyRegex, Opts, ResObj };
