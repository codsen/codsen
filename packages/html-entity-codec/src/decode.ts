import {
  maxNamedReferenceLength,
  namedReferencePrefixes,
  namedReferences,
} from "./generated";
import { assertString, type ObserveOptions, observer } from "./observe";

export interface ScanOptions {
  /** Attribute context rejects legacy names followed by ASCII letters, digits, or =. */
  context?: "text" | "attribute";
  /** Leave references without a trailing semicolon unchanged. */
  requireSemicolon?: boolean;
  /** Throw a SyntaxError for HTML character-reference parse errors. */
  strict?: boolean;
}

export interface DecodeOptions extends ScanOptions, ObserveOptions {}

export interface Reference {
  /** Exclusive UTF-16 offset in the original string. */
  end: number;
  value: string;
}

// HTML's numeric-reference end-state recovery table, indexed from U+0080.
const c1 = [
  0x20ac, 0x81, 0x201a, 0x192, 0x201e, 0x2026, 0x2020, 0x2021, 0x2c6, 0x2030,
  0x160, 0x2039, 0x152, 0x8d, 0x17d, 0x8f, 0x90, 0x2018, 0x2019, 0x201c, 0x201d,
  0x2022, 0x2013, 0x2014, 0x2dc, 0x2122, 0x161, 0x203a, 0x153, 0x9d, 0x17e,
  0x178,
];

const decimalDigits = /[0-9]+/y;
const hexadecimalDigits = /[0-9a-fA-F]+/y;
const decimalSignificantDigits = /0*([0-9]*)/y;
const hexadecimalSignificantDigits = /0*([0-9a-fA-F]*)/y;

function scanLongDigits(
  str: string,
  start: number,
  radix: number,
  code: number,
): { end: number; code: number } {
  if (code <= 0x10ffff) {
    const digits =
      radix === 10 ? decimalSignificantDigits : hexadecimalSignificantDigits;
    digits.lastIndex = start;
    // A digit run has already been established by the caller. Capture its
    // significant suffix while consuming leading zeroes in the same pass.
    const match = digits.exec(str) as RegExpExecArray;
    // Eight significant decimal or hexadecimal digits already exceed the
    // Unicode ceiling. Conversion therefore stays bounded even after millions
    // of leading zeroes; an all-zero run produces the required zero value.
    return {
      end: digits.lastIndex,
      code: Number.parseInt(match[1].slice(0, 8), radix) || 0,
    };
  }
  const digits = radix === 10 ? decimalDigits : hexadecimalDigits;
  digits.lastIndex = start;
  digits.test(str);
  return { end: digits.lastIndex, code };
}

function alphanumeric(code: number): boolean {
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122)
  );
}

function parseError(reason: string): never {
  throw new SyntaxError(`Parse error: ${reason}`);
}

function scan(
  str: string,
  index: number,
  opts: ScanOptions,
  advance?: (offset: number) => void,
): Reference | null {
  if (str.charCodeAt(index) !== 38) return null;
  let cursor = index + 1;
  if (str.charCodeAt(cursor) === 35) {
    cursor++;
    let radix = 10;
    if (str[cursor] === "x" || str[cursor] === "X") {
      radix = 16;
      cursor++;
    }
    const digitsStart = cursor;
    let code = 0;
    for (; cursor < str.length; cursor++) {
      const unit = str.charCodeAt(cursor);
      let digit = -1;
      if (unit >= 48 && unit <= 57) digit = unit - 48;
      else if (radix === 16 && unit >= 65 && unit <= 70) digit = unit - 55;
      else if (radix === 16 && unit >= 97 && unit <= 102) digit = unit - 87;
      if (digit < 0) break;
      // Saturate after overflow, but consume the entire digit run. Leading
      // zeroes remain valid even when the reference has millions of digits.
      if (code <= 0x10ffff) code = code * radix + digit;
      if (cursor - digitsStart === 32 && !advance) {
        // Keep ordinary references on the scalar path. Native scanning and
        // bounded conversion avoid a JavaScript iteration for each digit.
        // Progress observers retain scalar scanning and its periodic updates.
        const long = scanLongDigits(str, digitsStart, radix, code);
        cursor = long.end;
        code = long.code;
        break;
      }
      if (advance && !(cursor % 16384)) advance(cursor);
    }
    if (cursor === digitsStart) {
      if (opts.strict)
        parseError("absence-of-digits-in-numeric-character-reference");
      return null;
    }
    if (str[cursor] === ";") cursor++;
    else {
      if (opts.strict)
        parseError("missing-semicolon-after-character-reference");
      if (opts.requireSemicolon) return null;
    }
    if (!code || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
      if (opts.strict) parseError("invalid-numeric-character-reference");
      code = 0xfffd;
    } else if (
      (code >= 0xfdd0 && code <= 0xfdef) ||
      (code & 0xffff) >= 0xfffe ||
      code === 13 ||
      (code < 32 && code !== 9 && code !== 10 && code !== 12) ||
      (code >= 0x7f && code <= 0x9f)
    ) {
      if (opts.strict) parseError("disallowed-numeric-character-reference");
    }
    if (code >= 0x80 && code <= 0x9f) code = c1[code - 0x80];
    return { end: cursor, value: String.fromCodePoint(code) };
  }

  const legacyNames = namedReferencePrefixes[str.slice(cursor, cursor + 2)];
  let end = 0;
  let value = "";
  if (legacyNames) {
    // Bound the native semicolon search, then let the canonical dictionary
    // validate the whole spelling. Only legacy spellings accept prefixes.
    const possibleName = str.slice(cursor, cursor + maxNamedReferenceLength);
    const semicolon = possibleName.indexOf(";");
    if (semicolon !== -1) {
      const candidate = namedReferences[possibleName.slice(0, semicolon + 1)];
      if (typeof candidate === "string")
        return { end: cursor + semicolon + 1, value: candidate };
    }
    if (opts.requireSemicolon && !opts.strict) return null;
    for (const name of legacyNames) {
      if (str.startsWith(name, cursor)) {
        end = cursor + name.length;
        value = namedReferences[name];
        break;
      }
    }
  }
  if (!end) {
    if (opts.strict && alphanumeric(str.charCodeAt(index + 1))) {
      while (alphanumeric(str.charCodeAt(cursor))) cursor++;
      if (str[cursor] === ";") {
        parseError("unknown-named-character-reference");
      }
    }
    return null;
  }
  if (
    opts.context === "attribute" &&
    (str[end] === "=" || alphanumeric(str.charCodeAt(end)))
  )
    return null;
  if (opts.strict) parseError("missing-semicolon-after-character-reference");
  if (opts.requireSemicolon) return null;
  return { end, value };
}

/** Read one reference beginning at an ampersand, without decoding its output again. */
export function scanReference(
  str: string,
  index: number,
  opts: ScanOptions = {},
): Reference | null {
  assertString(str, "scanReference");
  if (!Number.isInteger(index) || index < 0) {
    throw new TypeError(
      "html-entity-codec/scanReference(): [THROW_ID_02] The index must be a nonnegative integer.",
    );
  }
  return scan(str, index, opts);
}

/** Decode HTML references in one pass. Repeated decoding belongs to the caller. */
export function decode(str: string, opts: DecodeOptions = {}): string {
  assertString(str, "decode");
  const policy = {
    context: opts.context,
    requireSemicolon: opts.requireSemicolon,
    strict: opts.strict,
  };
  const observed =
    opts.reportProgressFunc || opts.reportCompletionFunc
      ? observer(str, opts)
      : undefined;
  let index = str.indexOf("&");
  let from = 0;
  let result = "";
  let replacements = 0;
  while (index !== -1) {
    observed?.advance?.(index);
    const reference = scan(str, index, policy, observed?.advance);
    if (reference) {
      result += str.slice(from, index) + reference.value;
      from = reference.end;
      replacements++;
    }
    index = str.indexOf("&", reference ? reference.end : index + 1);
  }
  result = replacements ? result + str.slice(from) : str;
  return observed ? observed.finish(result, replacements) : result;
}
