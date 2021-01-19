declare const version: string;
interface Res {
    type: "character" | "line length";
    line: number;
    column: number;
    positionIdx: number;
    value: number | string;
    codePoint?: undefined | number;
    UTF32Hex?: undefined | string;
}
interface Opts {
    lineLength: number;
}
declare const defaults: Opts;
declare function within(str: string, originalOpts?: Partial<Opts>): Res[];

export { defaults, version, within };
