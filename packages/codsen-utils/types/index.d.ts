/**
 * Safely formats untrusted input for an error message.
 *
 * The result is JSON-like rather than JSON: values which JSON cannot express
 * use explicit diagnostic tokens. Object accessors are described without
 * running them, circular references are marked, and reflection failures are
 * contained. Output is capped at 2,000 UTF-16 code units, five object levels,
 * and 50 array items or object properties across the whole value.
 */
declare function formatDiagnosticValue(
  value: unknown,
  indentation?: 0 | 4,
): string;

declare const version: string;
declare const leftSingleQuote = "\u2018";
declare const rightSingleQuote = "\u2019";
declare const leftDoubleQuote = "\u201C";
declare const rightDoubleQuote = "\u201D";
declare const rawNDash = "\u2013";
declare const rawMDash = "\u2014";
declare const rawNbsp = "\u00A0";
declare const ellipsis = "\u2026";
declare const hairspace = "\u200A";
declare const thinSpace = "\u2009";
declare const singlePrime = "\u2032";
declare const doublePrime = "\u2033";
declare const backslash = "\\";
declare const rawReplacementMark = "\uFFFD";
declare const backtick = "`";
declare const multiplicationSign = "\u00D7";
declare const punctuationChars: string[];
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JsonObject = {
  [Key in string]?: JSONValue;
};
type JSONArray = JSONValue[];
interface JSONObject {
  [key: string]: JSONValue;
}
type Obj = JSONObject;
type EolChar = "\n" | "\r" | "\r\n";
type EolSetting = "lf" | "crlf" | "cr";
/** Clone nested data without retaining object or collection references. */
declare function deepClone<T>(value: T): T;
declare function isNumberChar(value: unknown): boolean;
declare function isCurrencyChar(value: unknown): boolean;
declare function isCurrencySymbol(value: unknown): boolean;
declare function isLetter(value: unknown): boolean;
declare function isLatinLetter(value: unknown): boolean;
declare function isQuote(value: unknown): boolean;
declare function isLowercaseLetter(value: unknown): boolean;
declare function isUppercaseLetter(value: unknown): boolean;
declare function isWhitespaceChar(value: unknown): boolean;
declare const removeTrailingSlash: <T>(value: T) => string | T;
/**
 * Tells, is given input a plain object (an object literal,
 * a container object Object.create(null) or created by new Object())
 * @param value unknown
 * @returns boolean
 */
declare function isPlainObject(value: unknown): value is JSONObject;
/**
 * @param str input string
 * @param index starting index
 * @param count how many characters to replace
 * @param add what string to insert
 * @returns string
 * Adapted from https://stackoverflow.com/a/21350614
 */
declare function stringSplice(
  str?: string,
  index?: number,
  count?: number,
  add?: string,
): string;
declare function isStr(something: unknown): something is string;
declare function isNum(something: unknown): something is number;
declare function isInt(something: unknown): something is number;
declare function isBool(something: unknown): something is boolean;
declare function isNull(something: unknown): something is null;
declare function isRegExp(something: any): something is RegExp;
/**
 * Gives array of indexes of all found substring occurrences
 * @param string source string
 * @param substring what to look for
 * @returns array of findings' position indexes
 * console.log(findAllIdx("scissors", "s"));
 * -> [0, 3, 4, 7]
 */
declare function findAllIdx(value: unknown, substring: unknown): number[];
/**
 * Unlike lodash equivalent, it does not mutate the input array
 * @param input
 * @param remove
 * @returns
 */
declare function pullAll<T, U>(input?: T[], remove?: U[]): T[];
declare function existy(x: unknown): boolean;
/**
 * Returns a shallow copy of input array, with only unique elements
 * @param input array
 * @returns de-duped array
 */
declare function uniq<T>(input: T[]): T[];
declare function detectEol(str: string | unknown): EolChar | undefined;
declare function resolveEolSetting(
  str: string | unknown,
  eolSetting: EolSetting | unknown,
  defaultEolChar?: EolChar,
): EolChar;
declare function hasOwnProp(obj: unknown, prop: string): boolean;
/**
 * Related to @typescript-eslint/require-array-sort-compare lint error
 */
declare function compareFn(a: string, b: string): number;
declare const voidTags: string[];
declare const inlineTags: Set<string>;
/**
 * Like Array.prototype.includes() but it takes a mix of strings and/or
 * regex'es, and matches that against a string. It's also a friendly API,
 * it will not throw if the inputs are wrong.
 * @param arr - array of zero or more strings or regex'es
 * @param whatToMatch - string to match
 * @returns boolean
 */
declare function includes(
  arr: (string | RegExp)[],
  whatToMatch: string,
): boolean;
/** Alternative to lodash.intersection */
declare function intersection<T, U>(a?: T[], b?: U[]): T[];
/** What a flag's value gets coerced to, once parsed */
type CliFlagType = "boolean" | "string" | "number";
interface CliFlag {
  /** Coercion applied to whatever the user typed. Undeclared - value is
   * passed through as a raw string (or `true` for a bare flag) */
  type?: CliFlagType;
  /** Single-letter alias, for example `p` to serve `--pad` as `-p` */
  shortFlag?: string;
  /** Used when the flag is absent from argv */
  default?: unknown;
  /** Collect every occurrence into an array instead of last-one-wins */
  isMultiple?: boolean;
}
interface CliPkg {
  name?: string;
  version?: string;
  description?: string;
  bin?: string | Record<string, string>;
  [key: string]: unknown;
}
interface CliOptions {
  /** The consuming program's package.json contents */
  pkg?: CliPkg;
  /** Flag schema, keyed by the flag's camelCase name */
  flags?: Record<string, CliFlag>;
  /** Defaults to `process.argv.slice(2)` */
  argv?: string[];
  /** Printed above the help text. Defaults to `pkg.description`,
   * set to `false` to omit it */
  description?: string | false;
  /** Defaults to `pkg.version` */
  version?: string;
  /** How many spaces the help text is indented by. Default: 2 */
  helpIndent?: number;
  /** Print help and exit when the only argument is `--help`. Default: true */
  autoHelp?: boolean;
  /** Print version and exit when the only argument is `--version`.
   * Default: true */
  autoVersion?: boolean;
  /** Value given to declared boolean flags the user didn't pass.
   * Default: `false`, set to `undefined` to leave them unset */
  booleanDefault?: boolean;
}
interface CliResult {
  /** Positional arguments, in the order they were given */
  input: string[];
  /** Parsed flags, keyed by their camelCase names */
  flags: Record<string, unknown>;
  pkg: CliPkg;
  /** The assembled help text, ready to print */
  help: string;
  /** Prints the help text, then exits (code 2 unless told otherwise) */
  showHelp: (exitCode?: number) => void;
  /** Prints the version, then exits with code 0 */
  showVersion: () => void;
}
/**
 * Parses argv the way a CLI expects: flags with values, short flags, bundles,
 * `--no-` negation, camelCase names and a `--` escape hatch. Prints help or
 * version on request. An in-house stand-in for "meow".
 * @param helpText what `--help` prints
 * @param options flag schema and the consuming program's package.json
 * @returns the parsed `input` and `flags`, plus `help`/`showHelp`/`showVersion`
 */
declare function codsenCLI(helpText?: string, options?: CliOptions): CliResult;
/** Alternative to lodash.omit */
declare function omit(obj: JSONObject, keysToRemove?: string[]): JSONObject;
interface MatchOptions {
  /** Match letter case exactly. Off by default. */
  caseSensitiveMatch?: boolean;
}
/**
 * Match a whole string against one or more wildcard patterns.
 *
 * Patterns are anchored — they must consume the whole input, not a part of
 * it. `*` stands for zero or more characters and does cross line breaks.
 * A leading `!` negates a pattern: any negative pattern which matches vetoes
 * the result outright, no matter what the positive ones did. Given only
 * negative patterns, anything they don't catch passes. An empty pattern
 * array matches nothing.
 *
 * `\` escapes the character after it, so `\*` means a literal asterisk and
 * `\\` means a literal backslash.
 *
 * Matching walks code points, not UTF-16 code units, so a wildcard can never
 * consume half of a surrogate pair.
 * @param input string to match
 * @param patterns one pattern or an array of them
 * @returns boolean
 * console.log(match("index.js", ["*.js", "!*.test.js"]));
 * -> true
 */
declare function match(
  input: string,
  patterns: string | readonly string[],
  options?: MatchOptions,
): boolean;

export {
  backslash,
  backtick,
  codsenCLI,
  compareFn,
  deepClone,
  detectEol,
  doublePrime,
  ellipsis,
  existy,
  findAllIdx,
  formatDiagnosticValue,
  hairspace,
  hasOwnProp,
  includes,
  inlineTags,
  intersection,
  isBool,
  isCurrencyChar,
  isCurrencySymbol,
  isInt,
  isLatinLetter,
  isLetter,
  isLowercaseLetter,
  isNull,
  isNum,
  isNumberChar,
  isPlainObject,
  isQuote,
  isRegExp,
  isStr,
  isUppercaseLetter,
  isWhitespaceChar,
  leftDoubleQuote,
  leftSingleQuote,
  match,
  multiplicationSign,
  omit,
  pullAll,
  punctuationChars,
  rawMDash,
  rawNDash,
  rawNbsp,
  rawReplacementMark,
  removeTrailingSlash,
  resolveEolSetting,
  rightDoubleQuote,
  rightSingleQuote,
  singlePrime,
  stringSplice,
  thinSpace,
  uniq,
  version,
  voidTags,
};
export type {
  CliFlag,
  CliFlagType,
  CliOptions,
  CliPkg,
  CliResult,
  EolChar,
  EolSetting,
  JSONArray,
  JSONObject,
  JSONValue,
  JsonObject,
  MatchOptions,
  Obj,
};
