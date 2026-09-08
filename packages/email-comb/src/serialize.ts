import { escapeAttribute } from "html-entity-codec";

export type Quote = '"' | "'" | null;

// CSSOM identifier serialization; callers supply the class/ID marker.
export function serializeCssIdentifier(value: string): string {
  if (/^[a-zA-Z_][a-zA-Z_0-9-]*$/.test(value)) return value;
  let result = "";
  let index = 0;
  for (const character of value) {
    const code = character.codePointAt(0) as number;
    if (code === 0) {
      result += "\uFFFD";
    } else if (
      code <= 31 ||
      code === 127 ||
      (code >= 48 &&
        code <= 57 &&
        (index === 0 || (index === 1 && value[0] === "-")))
    ) {
      result += `\\${code.toString(16)} `;
    } else if (character === "-" && value.length === 1) {
      result += "\\-";
    } else if (
      code >= 128 ||
      character === "-" ||
      character === "_" ||
      (code >= 48 && code <= 57) ||
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122)
    ) {
      result += character;
    } else {
      result += `\\${character}`;
    }
    index++;
  }
  return result;
}

// Preserve the existing CSS quote delimiter and return only its content.
export function serializeCssString(
  value: string,
  quote: Exclude<Quote, null>,
): string {
  if (/^[a-zA-Z_0-9-]+$/.test(value)) return value;
  let result = "";
  for (const character of value) {
    const code = character.codePointAt(0) as number;
    if (code === 0) {
      result += "\uFFFD";
    } else if (code <= 31 || code === 127 || character === "<") {
      // Escaping '<' also prevents an emitted literal HTML </style> end tag.
      result += `\\${code.toString(16)} `;
    } else if (character === quote || character === "\\") {
      result += `\\${character}`;
    } else {
      result += character;
    }
  }
  return result;
}

export function serializeHtmlAttribute(value: string, quote: Quote): string {
  if (/^[a-zA-Z_0-9-]+$/.test(value)) return value;
  const escaped = escapeAttribute(value, {
    quote: quote === '"' ? "double" : quote === "'" ? "single" : "both",
  });
  return quote
    ? escaped
    : escaped.replace(
        /[\t\n\f\r =`<>]/g,
        (character) => `&#${character.charCodeAt(0)};`,
      );
}
