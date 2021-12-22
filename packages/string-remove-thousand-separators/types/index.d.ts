declare const version: string;
interface Opts {
    removeThousandSeparatorsFromNumbers: boolean;
    padSingleDecimalPlaceNumbers: boolean;
    forceUKStyle: boolean;
}
declare function remSep(str: string, originalOpts?: Partial<Opts>): string;

export { remSep, version };
