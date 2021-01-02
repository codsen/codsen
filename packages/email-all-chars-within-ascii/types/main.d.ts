import { version } from "../package.json";
interface Res {
    type: "character" | "line length";
    line: number;
    column: number;
    positionIdx: number;
    value: number | string;
    codePoint?: undefined | number;
}
interface Opts {
    lineLength: number;
}
declare const defaults: Opts;
declare function within(str: string, originalOpts?: Opts): Res[];
export { within, defaults, version };
