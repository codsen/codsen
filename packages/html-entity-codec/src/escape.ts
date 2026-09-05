import { assertString, type ObserveOptions, observer } from "./observe";

export interface EscapeAttributeOptions extends ObserveOptions {
  /** Match the surrounding HTML quote delimiter; default: double. */
  quote?: "single" | "double" | "both";
}

function escapeValue(
  str: string,
  opts: EscapeAttributeOptions,
  attribute: boolean,
): string {
  const quote = opts.quote;
  const observed =
    opts.reportProgressFunc || opts.reportCompletionFunc
      ? observer(str, opts)
      : undefined;
  let result = "";
  let from = 0;
  let replacements = 0;
  for (let index = 0; index < str.length; index++) {
    if (observed && !(index % 16384)) observed.advance?.(index);
    const char = str[index];
    let replacement = "";
    if (char === "&") replacement = "&amp;";
    else if (char === "\u00a0") replacement = "&nbsp;";
    else if (attribute && char === '"' && quote !== "single")
      replacement = "&quot;";
    else if (
      attribute &&
      char === "'" &&
      (quote === "single" || quote === "both")
    )
      replacement = "&#39;";
    else if (!attribute && char === "<") replacement = "&lt;";
    else if (!attribute && char === ">") replacement = "&gt;";
    if (replacement) {
      result += str.slice(from, index) + replacement;
      from = index + 1;
      replacements++;
    }
  }
  result = replacements ? result + str.slice(from) : str;
  return observed ? observed.finish(result, replacements) : result;
}

/** Escape a quoted HTML attribute value. The caller supplies surrounding quotes. */
export function escapeAttribute(
  str: string,
  opts: EscapeAttributeOptions = {},
): string {
  assertString(str, "escapeAttribute");
  return escapeValue(str, opts, true);
}

/** Escape an ordinary HTML text node; raw-text elements have different rules. */
export function escapeText(str: string, opts: ObserveOptions = {}): string {
  assertString(str, "escapeText");
  return escapeValue(str, opts, false);
}
