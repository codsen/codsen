import { JsonValue } from "type-fest";
interface Opts {
    hungryForWhitespace?: boolean;
    matchStrictly?: boolean;
    verboseWhenMismatches?: boolean;
    useWildcards?: boolean;
}
declare function compare(b: JsonValue, s: JsonValue, originalOpts?: Opts): boolean | string;
export { compare };
