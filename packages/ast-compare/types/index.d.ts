declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
declare type JsonObject = {
    [Key in string]?: JsonValue;
};
declare type JsonArray = Array<JsonValue>;
interface Opts {
    hungryForWhitespace?: boolean;
    matchStrictly?: boolean;
    verboseWhenMismatches?: boolean;
    useWildcards?: boolean;
}
/**
 * Compare anything: AST, objects, arrays, strings and nested thereof
 */
declare function compare(b: JsonValue, s: JsonValue, originalOpts?: Opts): boolean | string;

export { compare };
