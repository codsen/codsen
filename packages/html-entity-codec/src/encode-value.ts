import { type ObserveOptions, observer } from "./observe";

function needsEncoding(code: number): boolean {
  return (
    code >= 160 ||
    (code >= 1 && code <= 9) ||
    code === 11 ||
    code === 12 ||
    (code >= 14 && code <= 31) ||
    code === 34 ||
    code === 38 ||
    code === 39 ||
    code === 60 ||
    code === 62 ||
    code === 96 ||
    code === 127 ||
    code === 129 ||
    code === 141 ||
    code === 143 ||
    code === 144 ||
    code === 157
  );
}

export function encodeValue(
  str: string,
  opts: ObserveOptions,
  named?: Record<string, string>,
): string {
  const observed =
    opts.reportProgressFunc || opts.reportCompletionFunc
      ? observer(str, opts)
      : undefined;
  let result = "";
  let from = 0;
  let replacements = 0;
  for (let index = 0; index < str.length; index++) {
    if (observed && !(index % 16384)) observed.advance?.(index);
    const code = str.codePointAt(index) as number;
    const width = code > 0xffff ? 2 : 1;
    let replacement = "";
    let consumed = width;
    // All official two-code-point values occupy two UTF-16 units. Test the
    // pair first; an ASCII first character can still form a named sequence.
    if (
      named &&
      index + 1 < str.length &&
      str.slice(index, index + 2) !== "fj"
    ) {
      const pair = named[str.slice(index, index + 2)];
      if (pair) {
        replacement = `&${pair}`;
        consumed = 2;
      }
    }
    if (!replacement && needsEncoding(code)) {
      const name = named?.[str.slice(index, index + width)];
      replacement = name
        ? `&${name}`
        : `&#x${code.toString(16).toUpperCase()};`;
    }
    if (replacement) {
      result += str.slice(from, index) + replacement;
      from = index + consumed;
      replacements++;
    }
    index += consumed - 1;
  }
  result = replacements ? result + str.slice(from) : str;
  return observed ? observed.finish(result, replacements) : result;
}
