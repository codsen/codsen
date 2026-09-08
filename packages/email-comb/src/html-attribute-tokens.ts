import { scanReference } from "html-entity-codec";

export interface HtmlAttributeToken {
  value: string;
  from: number;
  to: number;
}

function isAsciiWhitespace(code: number): boolean {
  return code === 32 || code === 9 || code === 10 || code === 12 || code === 13;
}

// Bounds exclude the attribute's quotes. Offsets always refer to the original
// HTML; decoded references are appended atomically and never decoded again.
export function readHtmlAttributeTokens(
  str: string,
  start: number,
  end: number,
  name: "class" | "id",
): HtmlAttributeToken[] {
  const raw = str.slice(start, end);
  const tokens: HtmlAttributeToken[] = [];
  const isClass = name === "class";
  let tokenFrom = -1;
  let plainFrom = -1;
  let value = "";

  const finish = (to: number): void => {
    if (tokenFrom !== -1) {
      if (plainFrom !== -1) value += raw.slice(plainFrom, to);
      tokens.push({ value, from: start + tokenFrom, to: start + to });
      tokenFrom = -1;
      plainFrom = -1;
      value = "";
    }
  };

  for (let cursor = 0; cursor < raw.length; ) {
    const code = raw.charCodeAt(cursor);
    if (isClass && isAsciiWhitespace(code)) {
      finish(cursor);
      cursor++;
      continue;
    }

    if (code === 38) {
      const reference = scanReference(raw, cursor, { context: "attribute" });
      if (reference) {
        // HTML references that emit ASCII whitespace emit one character;
        // multi-character named references remain part of the same token.
        if (
          isClass &&
          reference.value.length === 1 &&
          isAsciiWhitespace(reference.value.charCodeAt(0))
        ) {
          finish(cursor);
        } else {
          if (plainFrom !== -1) value += raw.slice(plainFrom, cursor);
          if (tokenFrom === -1) tokenFrom = cursor;
          value += reference.value;
        }
        plainFrom = -1;
        cursor = reference.end;
        continue;
      }
    }

    if (code === 13 || code === 0) {
      if (plainFrom !== -1) value += raw.slice(plainFrom, cursor);
      if (tokenFrom === -1) tokenFrom = cursor;
      // HTML input preprocessing normalizes literal CR/CRLF before reference
      // decoding. A CR emitted by a reference above must remain a CR. Attribute
      // tokenization replaces literal NUL with U+FFFD.
      value += code === 13 ? "\n" : "\uFFFD";
      cursor += code === 13 && raw.charCodeAt(cursor + 1) === 10 ? 2 : 1;
      plainFrom = -1;
      continue;
    }

    if (tokenFrom === -1) tokenFrom = cursor;
    if (plainFrom === -1) plainFrom = cursor;
    cursor++;
  }

  finish(raw.length);
  return tokens;
}
