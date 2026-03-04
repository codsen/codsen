import { version as v } from "../package.json";

export const version: string = v;

export const leftSingleQuote = "\u2018";
export const rightSingleQuote = "\u2019";
export const leftDoubleQuote = "\u201C";
export const rightDoubleQuote = "\u201D";
export const rawNDash = "\u2013"; // https://www.fileformat.info/info/unicode/char/2013/index.htm
export const rawMDash = "\u2014"; // https://www.fileformat.info/info/unicode/char/2014/index.htm
export const rawNbsp = "\u00A0"; // https://www.fileformat.info/info/unicode/char/00a0/index.htm
export const ellipsis = "\u2026"; // https://www.fileformat.info/info/unicode/char/2026/index.htm
export const hairspace = "\u200A"; // https://www.fileformat.info/info/unicode/char/200a/index.htm
export const thinSpace = "\u2009"; // https://www.fileformat.info/info/unicode/char/2009/index.htm
export const singlePrime = "\u2032";
export const doublePrime = "\u2033";
export const backslash = "\u005C";
export const rawReplacementMark = "\uFFFD";
export const backtick = "\x60";
export const multiplicationSign = "\u00D7"; // https://www.fileformat.info/info/unicode/char/00d7/index.htm

export const punctuationChars = [".", ",", ";", "!", "?"];

const currencySymbols = new Set([
  ..."؋$₼៛¥₡₱£€¢₹﷼₪₩₭₨₮₦₽₫฿₩₺₴",
  "$U",
  "$b",
  "B/.",
  "BZ$",
  "Br",
  "Bs",
  "C$",
  "CHF",
  "Ft",
  "Gs",
  "J$",
  "KM",
  "Kč",
  "L",
  "MT",
  "NT$",
  "P",
  "Q",
  "R",
  "R$",
  "RD$",
  "RM",
  "Rp",
  "S",
  "S/.",
  "TT$",
  "Z$",
  "kn",
  "kr",
  "lei",
  "zł",
  "ƒ",
  "Дин.",
  "ден",
  "лв",
  "د.إ",
  "Lek",
]);

// From "type-fest" by Sindre Sorhus:
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;
export type JsonObject = { [Key in string]?: JSONValue };
export type JSONArray = JSONValue[];
export interface JSONObject {
  [key: string]: JSONValue;
}

export type Obj = JSONObject;

export type EolChar = "\n" | "\r" | "\r\n";
export type EolSetting = "lf" | "crlf" | "cr";

type CloneMemo = WeakMap<object, unknown>;
type CloneableArrayBuffer = ArrayBuffer | SharedArrayBuffer;

function cloneArrayBuffer(
  value: CloneableArrayBuffer,
  memo: CloneMemo,
): CloneableArrayBuffer {
  const existing = memo.get(value);
  if (existing !== undefined) {
    return existing as CloneableArrayBuffer;
  }

  const result = value.slice(0) as CloneableArrayBuffer;
  memo.set(value, result);
  return result;
}

function cloneArrayBufferView(
  value: ArrayBufferView,
  memo: CloneMemo,
): ArrayBufferView {
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    const result = Buffer.from(value);
    memo.set(value, result);
    return result;
  }

  const clonedBuffer = cloneArrayBuffer(
    value.buffer as CloneableArrayBuffer,
    memo,
  );

  if (value instanceof DataView) {
    const result = new DataView(
      clonedBuffer,
      value.byteOffset,
      value.byteLength,
    );
    memo.set(value, result);
    return result;
  }

  const TypedArray = value.constructor as new (
    buffer: ArrayBufferLike,
    byteOffset: number,
    length: number,
  ) => ArrayBufferView;

  const result = new TypedArray(
    clonedBuffer,
    value.byteOffset,
    (value as ArrayBufferView & { length: number }).length,
  );
  memo.set(value, result);
  return result;
}

/**
 * Copies every own enumerable string key across, cloning as it goes. Values
 * which can't hold references are assigned straight, skipping a call each.
 */
function cloneOwnKeys(
  result: Record<string, unknown>,
  input: Record<string, unknown>,
  keys: string[],
  memo: CloneMemo,
): void {
  for (const key of keys) {
    const item = input[key];
    result[key] =
      typeof item !== "object" || item === null ? item : cloneValue(item, memo);
  }
}

function cloneValue<T>(value: T, memo: CloneMemo): T {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  const existing = memo.get(value);
  if (existing !== undefined) {
    return existing as T;
  }

  if (Array.isArray(value)) {
    const len = value.length;
    const result = new Array(len) as unknown[] & Record<string, unknown>;
    memo.set(value, result);
    const input = value as unknown[] & Record<string, unknown>;
    const keys = Object.keys(value);
    // A dense array carrying no extra own keys - by far the common case - can
    // be walked by index. Its last key being the last index proves it: string
    // keys always sort after index keys, so none are present.
    if (keys.length === len && (len === 0 || keys[len - 1] === `${len - 1}`)) {
      for (let i = 0; i < len; i++) {
        const item = input[i];
        result[i] =
          typeof item !== "object" || item === null
            ? item
            : cloneValue(item, memo);
      }
    } else {
      // holes and/or extra properties - go through the keys, preserving both
      cloneOwnKeys(result, input, keys, memo);
    }
    return result as T;
  }

  if (value instanceof Date) {
    const result = new Date(value.getTime());
    memo.set(value, result);
    return result as T;
  }

  if (ArrayBuffer.isView(value)) {
    return cloneArrayBufferView(value, memo) as T;
  }

  if (
    value instanceof ArrayBuffer ||
    (typeof SharedArrayBuffer !== "undefined" &&
      value instanceof SharedArrayBuffer)
  ) {
    return cloneArrayBuffer(value, memo) as T;
  }

  if (value instanceof Map) {
    const result = new Map();
    memo.set(value, result);
    for (const [mapKey, mapValue] of value) {
      result.set(cloneValue(mapKey, memo), cloneValue(mapValue, memo));
    }
    return result as T;
  }

  if (value instanceof Set) {
    const result = new Set();
    memo.set(value, result);
    for (const setValue of value) {
      result.add(cloneValue(setValue, memo));
    }
    return result as T;
  }

  const result: Record<string, unknown> = {};
  memo.set(value, result);
  cloneOwnKeys(
    result,
    value as Record<string, unknown>,
    Object.keys(value),
    memo,
  );
  return result as T;
}

/** Clone nested data without retaining object or collection references. */
export function deepClone<T>(value: T): T {
  return cloneValue(value, new WeakMap());
}

export function isNumberChar(value: unknown): boolean {
  if (!isStr(value)) {
    return false;
  }
  const code = value.charCodeAt(0);
  return code >= 48 && code <= 57;
}

export function isCurrencyChar(value: unknown): boolean {
  return isStr(value) && value.length === 1 && currencySymbols.has(value);
}

export function isCurrencySymbol(value: unknown): boolean {
  return isStr(value) && currencySymbols.has(value);
}

export function isLetter(value: unknown): boolean {
  if (!isStr(value) || value.length !== 1) {
    return false;
  }
  const code = value.charCodeAt(0);
  if (code < 128) {
    // ASCII settles without the two case conversions below, each of which
    // would allocate a string
    return (code > 64 && code < 91) || (code > 96 && code < 123);
  }
  return value.toUpperCase() !== value.toLowerCase();
}

export function isLatinLetter(value: unknown): boolean {
  // A-Z, a-z
  if (!value || !isStr(value)) {
    return false;
  }
  const code = value.charCodeAt(0);
  return (code > 64 && code < 91) || (code > 96 && code < 123);
}

export function isQuote(value: unknown): boolean {
  return (
    isStr(value) &&
    (value === '"' ||
      value === "'" ||
      value === leftSingleQuote ||
      value === rightSingleQuote ||
      value === leftDoubleQuote ||
      value === rightDoubleQuote)
  );
}

export function isLowercaseLetter(value: unknown): boolean {
  if (!isStr(value) || value.length !== 1) {
    return false;
  }
  const code = value.charCodeAt(0);
  if (code < 128) {
    return code > 96 && code < 123;
  }
  return value === value.toLowerCase() && value !== value.toUpperCase();
}

export function isUppercaseLetter(value: unknown): boolean {
  if (!isStr(value) || value.length !== 1) {
    return false;
  }
  const code = value.charCodeAt(0);
  if (code < 128) {
    return code > 64 && code < 91;
  }
  return value === value.toUpperCase() && value !== value.toLowerCase();
}

export function isWhitespaceChar(value: unknown): boolean {
  if (!isStr(value) || !value) {
    return false;
  }
  const code = value.charCodeAt(0);
  if (code < 128) {
    // space, plus tab/LF/VT/FF/CR - the only ASCII characters String#trim()
    // strips - without slicing and allocating to ask it
    return code === 32 || (code > 8 && code < 14);
  }
  return !value[0].trim();
}

// -----------------------------------------------------------------

export const removeTrailingSlash = <T>(value: T) => {
  if (isStr(value) && value.length && value.endsWith("/")) {
    return value.slice(0, -1).trim();
  }
  // else, does nothing
  return value;
};

// -----------------------------------------------------------------

/**
 * Tells, is given input a plain object (an object literal,
 * a container object Object.create(null) or created by new Object())
 * @param value unknown
 * @returns boolean
 */
export function isPlainObject(value: unknown): value is JSONObject {
  if (value == null || typeof value !== "object") {
    return false;
  }
  let proto: unknown = Object.getPrototypeOf(value);
  if (
    proto !== null &&
    proto !== Object.prototype &&
    Object.getPrototypeOf(proto) !== null
  ) {
    return false;
  }
  return !(Symbol.iterator in value) && !(Symbol.toStringTag in value);
}

// ----------------------------------------------------------------

/**
 * @param str input string
 * @param index starting index
 * @param count how many characters to replace
 * @param add what string to insert
 * @returns string
 * Adapted from https://stackoverflow.com/a/21350614
 */
export function stringSplice(str = "", index = 0, count = 0, add = "") {
  if (index < 0) {
    index += str.length;
    if (index < 0) {
      index = 0;
    }
  }
  return str.slice(0, index) + (add || "") + str.slice(index + count);
}

// ----------------------------------------------------------------

export function isStr(something: unknown): something is string {
  return typeof something === "string";
}

// ----------------------------------------------------------------

export function isNum(something: unknown): something is number {
  return Number.isFinite(something);
}

// ----------------------------------------------------------------

export function isInt(something: unknown): something is number {
  return Number.isSafeInteger(something) && (something as number) >= 0;
}

// ----------------------------------------------------------------

export function isBool(something: unknown): something is boolean {
  return typeof something === "boolean";
}

// ----------------------------------------------------------------

export function isNull(something: unknown): something is null {
  return something === null;
}

// ----------------------------------------------------------------

export function isRegExp(something: any): something is RegExp {
  return something instanceof RegExp;
}

// ----------------------------------------------------------------

/**
 * Gives array of indexes of all found substring occurrences
 * @param string source string
 * @param substring what to look for
 * @returns array of findings' position indexes
 * console.log(findAllIdx("scissors", "s"));
 * -> [0, 3, 4, 7]
 */
export function findAllIdx(value: unknown, substring: unknown): number[] {
  if (!isStr(value) || !isStr(substring) || substring.length === 0) {
    return [];
  }

  const indexes: number[] = [];
  let index = value.indexOf(substring);

  while (index !== -1) {
    indexes.push(index);
    index = value.indexOf(substring, index + 1);
  }

  return indexes;
}

// ----------------------------------------------------------------

/**
 * Unlike lodash equivalent, it does not mutate the input array
 * @param input
 * @param remove
 * @returns
 */
export function pullAll<T, U>(input: T[] = [], remove: U[] = []) {
  // early exit
  if (!input || !Array.isArray(input) || !input.length) {
    // always return an array:
    return [];
  }
  if (!remove || !Array.isArray(remove) || !remove.length) {
    // does nothing
    return input;
  }
  // Array#includes is faster for very short removal lists. A Set avoids the
  // quadratic scan once the list grows.
  if (input.length < 128 || remove.length < 5) {
    return input.filter((val) => !remove.includes(val as any));
  }
  const removals = new Set<unknown>(remove);
  return input.filter((val) => !removals.has(val));
}

// ----------------------------------------------------------------

// from Michael Fogus "Functional JavaScript"
export function existy(x: unknown): boolean {
  return x != null;
}

// ----------------------------------------------------------------

/**
 * Returns a shallow copy of input array, with only unique elements
 * @param input array
 * @returns de-duped array
 */
export function uniq<T>(input: T[]): T[] {
  return [...new Set(input)];
}

// ----------------------------------------------------------------

export function detectEol(str: string | unknown): EolChar | undefined {
  if (typeof str !== "string" || !str) {
    return;
  }
  // windows ending
  if (str.includes("\r\n")) {
    return "\r\n";
  }
  // modern mac ending
  if (str.includes("\n")) {
    return "\n";
  }
  // old mac ending
  if (str.includes("\r")) {
    return "\r";
  }
  return;
}

// ----------------------------------------------------------------

export function resolveEolSetting(
  str: string | unknown,
  eolSetting: EolSetting | unknown,
  defaultEolChar: EolChar = "\n",
): EolChar {
  // insurance
  if (
    defaultEolChar !== "\n" &&
    defaultEolChar !== "\r\n" &&
    defaultEolChar !== "\r"
  ) {
    throw new Error(
      `codsen-utils/resolveEolSetting(): [THROW_ID_01] the input argument defaultEolChar should be one of EOL values: "\\n", "\\r", or "\\r\\n", but it was given as ${JSON.stringify(
        defaultEolChar,
        null,
        0,
      )}`,
    );
  }

  // explicit setting requests take priority:
  if (eolSetting === "crlf") {
    return "\r\n";
  } else if (eolSetting === "cr") {
    return "\r";
  } else if (eolSetting === "lf") {
    return "\n";
  } else {
    // in all other cases...
    // we try to detect the EOL in the input string first, then fall back to default:
    return detectEol(str) || defaultEolChar;
  }
}

// ----------------------------------------------------------------

export function hasOwnProp(obj: unknown, prop: string): boolean {
  return isPlainObject(obj) && isStr(prop) && Object.hasOwn(obj, prop);
}

// ----------------------------------------------------------------

/**
 * Related to @typescript-eslint/require-array-sort-compare lint error
 */
export function compareFn(a: string, b: string) {
  return a.localeCompare(b);
}

// ----------------------------------------------------------------

// https://html.spec.whatwg.org/multipage/syntax.html#elements-2
export const voidTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Inline_text_semantics
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Image_and_multimedia
export const inlineTags = new Set([
  "a",
  "abbr",
  "acronym",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "br",
  "button",
  "canvas",
  "cite",
  "code",
  "data",
  "datalist",
  "del",
  "dfn",
  "em",
  "embed",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "map",
  "mark",
  "meter",
  "noscript",
  "object",
  "output",
  "picture",
  "progress",
  "q",
  "ruby",
  "s",
  "samp",
  "script",
  "select",
  "slot",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "svg",
  "template",
  "textarea",
  "time",
  "u",
  "tt",
  "var",
  "video",
  "wbr",
]);

// -----------------------------------------------------------------

/**
 * Like Array.prototype.includes() but it takes a mix of strings and/or
 * regex'es, and matches that against a string. It's also a friendly API,
 * it will not throw if the inputs are wrong.
 * @param arr - array of zero or more strings or regex'es
 * @param whatToMatch - string to match
 * @returns boolean
 */
export function includes(
  arr: (string | RegExp)[],
  whatToMatch: string,
): boolean {
  if (!Array.isArray(arr) || !arr.length || !isStr(whatToMatch)) {
    return false;
  }

  for (const value of arr) {
    if (typeof value === "string") {
      if (whatToMatch === value) {
        return true;
      }
      continue;
    }

    if (isRegExp(value)) {
      if (value.global) {
        value.lastIndex = 0;
      }
      const matched = value.test(whatToMatch);
      if (value.global) {
        value.lastIndex = 0;
      }
      if (matched) {
        return true;
      }
    }
  }

  return false;
}

/** Alternative to lodash.intersection */
export function intersection<T, U>(a: T[] = [], b: U[] = []): T[] {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
    return [];
  }

  const result: T[] = [];
  // Two Sets cost more to build than a pair of linear scans saves, until
  // there's enough work to amortise them.
  if (a.length * b.length < 64) {
    for (const value of a) {
      if (b.includes(value as any) && !result.includes(value)) {
        result.push(value);
      }
    }
    return result;
  }

  const valuesInB = new Set<unknown>(b);
  const seen = new Set<T>();
  for (const value of a) {
    if (valuesInB.has(value) && !seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }
  return result;
}

// ----------------------------------------------------------------
//
//                            codsenCLI
//
// ----------------------------------------------------------------

/** What a flag's value gets coerced to, once parsed */
export type CliFlagType = "boolean" | "string" | "number";

export interface CliFlag {
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

export interface CliPkg {
  name?: string;
  version?: string;
  description?: string;
  bin?: string | Record<string, string>;
  [key: string]: unknown;
}

export interface CliOptions {
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

export interface CliResult {
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

interface ResolvedFlag {
  key: string;
  type?: CliFlagType;
  isMultiple: boolean;
  source: CliFlag;
}

/** Matches a token which is entirely a number, so that `-3` is read as input
 * rather than as a bundle of the flags `-3` */
const numericToken = /^-?\d+(?:\.\d*)?(?:e[+-]?\d+)?$/i;

/** "line-ending" -> "lineEnding" */
function camelise(input: string): string {
  return input.replace(/-+([^-])/g, (_match, chr: string) => chr.toUpperCase());
}

/** "lineEnding" -> "line-ending", so that both spellings resolve to one flag */
function decamelise(input: string): string {
  return input.replace(/([\da-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function trimNewlines(input: string): string {
  return input.replace(/^[\r\n]+/, "").replace(/[\r\n]+$/, "");
}

/** Strips the common indentation off every line, then indents the lot by
 * `count` spaces - so help texts can be written as indented template literals */
function redent(input: string, count: number): string {
  let smallest = Number.POSITIVE_INFINITY;
  const lines = input.split("\n");
  for (const line of lines) {
    const indent = /^[ \t]*(?=\S)/.exec(line);
    if (indent) {
      smallest = Math.min(smallest, indent[0].length);
    }
  }
  const padding = " ".repeat(count);
  return lines
    .map((line) => (line.trim() ? padding + line.slice(smallest) : line))
    .join("\n");
}

function buildHelp(
  helpText: string,
  description: string | false | undefined,
  helpIndent: number,
): string {
  let help = "";
  if (helpText) {
    help = trimNewlines(helpText.replace(/\t+\n*$/, ""));
    if (help.includes("\n")) {
      help = redent(help, helpIndent);
    }
    help = `\n${help}`;
  }
  if (description) {
    help = help
      ? `${redent(`\n${description}\n`, helpIndent)}${help}`
      : `\n${description}`;
  }
  return `${help}\n`;
}

/** What `ps` should call this program - the first bin name, ideally */
function processTitle(pkg: CliPkg): string {
  const name = isStr(pkg.name) ? pkg.name : "";
  const { bin } = pkg;
  if (isStr(bin)) {
    // an unscoped name is what lands on the PATH
    return name.slice(name.startsWith("@") ? name.indexOf("/") + 1 : 0);
  }
  if (bin && typeof bin === "object") {
    return Object.keys(bin)[0] ?? name;
  }
  return name;
}

function coerceValue(
  def: ResolvedFlag | undefined,
  raw: string | undefined,
): unknown {
  const type = def ? def.type : undefined;
  if (raw === undefined) {
    // a bare flag, with no value attached
    if (type === "string") {
      return "";
    }
    if (type === "number") {
      return undefined;
    }
    return true;
  }
  if (type === "boolean") {
    return raw === "true";
  }
  if (type === "number") {
    return Number(raw);
  }
  return raw;
}

/**
 * Parses argv the way a CLI expects: flags with values, short flags, bundles,
 * `--no-` negation, camelCase names and a `--` escape hatch. Prints help or
 * version on request. An in-house stand-in for "meow".
 * @param helpText what `--help` prints
 * @param options flag schema and the consuming program's package.json
 * @returns the parsed `input` and `flags`, plus `help`/`showHelp`/`showVersion`
 */
export function codsenCLI(helpText = "", options: CliOptions = {}): CliResult {
  const { process: proc } = globalThis;
  const pkg = options.pkg ?? {};
  const argv = options.argv ?? proc.argv.slice(2);
  const helpIndent = options.helpIndent ?? 2;
  const autoHelp = options.autoHelp ?? true;
  const autoVersion = options.autoVersion ?? true;
  const version = options.version ?? pkg.version ?? "No version found";
  const booleanDefault = Object.hasOwn(options, "booleanDefault")
    ? options.booleanDefault
    : false;

  const help = buildHelp(
    helpText,
    options.description ?? pkg.description,
    helpIndent,
  );

  function showHelp(exitCode?: number): void {
    console.log(help);
    // 2 is the conventional "you used this wrong" code
    proc.exit(isNum(exitCode) ? exitCode : 2);
  }

  function showVersion(): void {
    console.log(version);
    proc.exit(0);
  }

  // 1. resolve the schema into a lookup covering every spelling of each flag
  // ---------------------------------------------------------------------------

  const declared: ResolvedFlag[] = [];
  const byName = new Map<string, ResolvedFlag>();
  for (const [key, source] of Object.entries(options.flags ?? {})) {
    const flag: ResolvedFlag = {
      key,
      type: source.type,
      isMultiple: !!source.isMultiple,
      source,
    };
    declared.push(flag);
    byName.set(key, flag);
    byName.set(decamelise(key), flag);
    if (source.shortFlag) {
      byName.set(source.shortFlag, flag);
    }
  }

  // 2. walk argv
  // ---------------------------------------------------------------------------

  const input: string[] = [];
  const flags: Record<string, unknown> = {};

  function setValue(name: string, value: unknown): void {
    const def = byName.get(name);
    const key = def ? def.key : camelise(name);
    if (def?.isMultiple) {
      const soFar = flags[key];
      if (Array.isArray(soFar)) {
        soFar.push(value);
      } else {
        flags[key] = [value];
      }
      return;
    }
    flags[key] = value;
  }

  function store(name: string, raw: string | undefined): void {
    setValue(name, coerceValue(byName.get(name), raw));
  }

  /** Should the token after this flag be eaten as its value? */
  function wantsNextToken(
    def: ResolvedFlag | undefined,
    next: string | undefined,
  ): boolean {
    if (next === undefined) {
      return false;
    }
    if (def?.type === "boolean") {
      // only an explicit "--flag false" can talk a boolean out of being true
      return next === "true" || next === "false";
    }
    return !(
      next.startsWith("-") &&
      next.length > 1 &&
      !numericToken.test(next)
    );
  }

  /** Handles one `-abc`-shaped token, returns the index to carry on from */
  function parseShortFlags(arg: string, index: number): number {
    const body = arg.slice(1);
    for (let j = 0; j < body.length; j++) {
      const letter = body[j];
      const rest = body.slice(j + 1);

      // "-p=2"
      if (rest.startsWith("=")) {
        store(letter, rest.slice(1));
        return index;
      }
      // "-p2", and "-i 3" arriving as a single argument
      if (numericToken.test(rest) || (rest && /\W/.test(rest[0]))) {
        store(letter, rest);
        return index;
      }
      const def = byName.get(letter);
      // "-lcr" - a value glued onto a flag which takes one
      if (rest && def?.type && def.type !== "boolean") {
        store(letter, rest);
        return index;
      }
      if (rest) {
        // a boolean in the middle of a bundle, keep unpacking
        store(letter, undefined);
        continue;
      }
      // the last letter is the one allowed to claim the next token
      if (wantsNextToken(def, argv[index + 1])) {
        store(letter, argv[index + 1]);
        return index + 1;
      }
      store(letter, undefined);
    }
    return index;
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    // everything past "--" is input, however flag-shaped it looks
    if (arg === "--") {
      input.push(...argv.slice(i + 1));
      break;
    }

    if (arg.startsWith("--")) {
      const name = arg.slice(2);
      const equals = name.indexOf("=");
      if (equals !== -1) {
        store(name.slice(0, equals), name.slice(equals + 1));
        continue;
      }
      if (name.startsWith("no-")) {
        setValue(name.slice(3), false);
        continue;
      }
      const def = byName.get(name);
      if (wantsNextToken(def, argv[i + 1])) {
        store(name, argv[i + 1]);
        i++;
        continue;
      }
      store(name, undefined);
      continue;
    }

    if (arg.startsWith("-") && arg.length > 1 && !numericToken.test(arg)) {
      i = parseShortFlags(arg, i);
      continue;
    }

    input.push(arg);
  }

  // 3. fill in the flags the user didn't mention
  // ---------------------------------------------------------------------------

  for (const def of declared) {
    if (Object.hasOwn(flags, def.key)) {
      continue;
    }
    if (Object.hasOwn(def.source, "default")) {
      flags[def.key] = def.source.default;
    } else if (def.isMultiple) {
      flags[def.key] = [];
    } else if (def.type === "boolean" && booleanDefault !== undefined) {
      flags[def.key] = booleanDefault;
    }
  }

  // 4. "prog --help" and "prog --version", and nothing else, answer themselves
  // ---------------------------------------------------------------------------

  if (!input.length && argv.length === 1) {
    if (autoVersion && flags.version === true) {
      showVersion();
    } else if (autoHelp && flags.help === true) {
      showHelp(0);
    }
  }

  const title = processTitle(pkg);
  if (title) {
    proc.title = title;
  }

  return { input, flags, pkg, help, showHelp, showVersion };
}

// ----------------------------------------------------------------

/** Alternative to lodash.omit */
export function omit(obj: JSONObject, keysToRemove: string[] = []): JSONObject {
  if (!obj) return obj;
  if (!isPlainObject(obj))
    throw new Error(
      `codsen-utils/omit(): [THROW_ID_02] Input must be a plain object! It was given as ${JSON.stringify(
        obj,
        null,
        4,
      )} (typeof is "${typeof obj}")`,
    );
  const result: JSONObject = {};
  const memo: CloneMemo = new WeakMap([[obj, result]]);
  const keys = Object.keys(obj);
  const removals =
    keys.length < 128 || keysToRemove.length < 5
      ? undefined
      : new Set(keysToRemove);

  for (const key of keys) {
    if (removals ? removals.has(key) : keysToRemove.includes(key)) {
      continue;
    }
    result[key] = cloneValue(obj[key], memo);
  }
  return result;
}
