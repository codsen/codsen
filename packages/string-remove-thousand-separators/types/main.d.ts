import { version } from "../package.json";
interface Opts {
    removeThousandSeparatorsFromNumbers: boolean;
    padSingleDecimalPlaceNumbers: boolean;
    forceUKStyle: boolean;
}
declare function remSep(str: string, originalOpts?: Opts): string;
export { remSep, version };
