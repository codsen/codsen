// Recognize markup without treating comparison signs or template markers as HTML.
function isHtmlWhitespace(code: number): boolean {
  return code === 32 || (code >= 9 && code <= 13 && code !== 11);
}

export function matchHtmlTagEnd(
  str: string,
  start: number,
  allowUnfinished = true,
): number | undefined {
  let i = start + (str[start + 1] === "/" ? 2 : 1);
  const first = str.charCodeAt(i) | 32;
  if (first < 97 || first > 122) {
    return undefined;
  }
  i += 1;
  while (i < str.length) {
    const code = str.charCodeAt(i);
    if (
      code <= 62 &&
      (isHtmlWhitespace(code) ||
        code === 47 ||
        code === 34 ||
        code === 39 ||
        (code >= 60 && code <= 62))
    ) {
      break;
    }
    i += 1;
  }
  if (
    str[i] &&
    !isHtmlWhitespace(str.charCodeAt(i)) &&
    str[i] !== "/" &&
    str[i] !== ">"
  ) {
    return undefined;
  }

  let quote: string | undefined;
  let valuePending = false;
  let unquotedValue = false;
  for (; i < str.length; i += 1) {
    const char = str[i];
    if (quote) {
      if (char === quote) {
        quote = undefined;
      }
    } else if (char === ">") {
      return i + 1;
    } else if (char === "<") {
      // Recover at the next tag instead of rescanning malformed prefixes.
      return allowUnfinished ? i : undefined;
    } else if (isHtmlWhitespace(str.charCodeAt(i))) {
      unquotedValue = false;
    } else if (valuePending) {
      valuePending = false;
      if (char === '"' || char === "'") {
        quote = char;
      } else {
        unquotedValue = true;
      }
    } else if (char === "=" && !unquotedValue) {
      valuePending = true;
    }
  }
  // An unfinished tag still contains markup, not visible text.
  return allowUnfinished ? str.length : undefined;
}

const blockTags = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "body",
  "br",
  "caption",
  "center",
  "dd",
  "details",
  "dialog",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "li",
  "main",
  "menu",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);
const opaqueTags = new Set([
  "script",
  "style",
  "pre",
  "code",
  "textarea",
  "title",
]);

export function matchHtmlRegion(
  str: string,
  start: number,
): { end: number; boundary: boolean } | undefined {
  if (str.startsWith("<!--", start) || str.startsWith("<![CDATA[", start)) {
    const tail = str.startsWith("<!--", start) ? "-->" : "]]>";
    const end = str.indexOf(tail, start + 4);
    return { end: end < 0 ? str.length : end + tail.length, boundary: false };
  }
  if (str.startsWith("<?", start)) {
    const end = str.indexOf("?>", start + 2);
    return { end: end < 0 ? str.length : end + 2, boundary: false };
  }
  if (str.startsWith("<!", start)) {
    let quote: string | undefined;
    let brackets = 0;
    for (let i = start + 2; i < str.length; i += 1) {
      const char = str[i];
      if (quote) {
        if (char === quote) quote = undefined;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === "[") {
        brackets += 1;
      } else if (char === "]") {
        brackets = Math.max(0, brackets - 1);
      } else if (char === ">" && !brackets) {
        return { end: i + 1, boundary: false };
      }
    }
    return { end: str.length, boundary: false };
  }
  const end = matchHtmlTagEnd(str, start);
  if (end === undefined) return undefined;
  const closing = str[start + 1] === "/";
  const nameStart = start + (closing ? 2 : 1);
  let nameEnd = nameStart;
  while (nameEnd < end && !/[\t\n\f\r />]/.test(str[nameEnd])) nameEnd += 1;
  const name = str.slice(nameStart, nameEnd).toLowerCase();
  const boundary = blockTags.has(name) || name === "script" || name === "style";
  if (!closing && opaqueTags.has(name) && str[end - 1] === ">") {
    let cursor = end;
    let depth = 1;
    while (cursor < str.length) {
      cursor = str.indexOf("<", cursor);
      if (cursor === -1) break;
      if (
        (name === "pre" || name === "code") &&
        (str[cursor + 1] === "!" || str[cursor + 1] === "?")
      ) {
        cursor = (matchHtmlRegion(str, cursor) as { end: number }).end;
        continue;
      }
      const isClose = str[cursor + 1] === "/";
      const candidateStart = cursor + (isClose ? 2 : 1);
      if (
        str
          .slice(candidateStart, candidateStart + name.length)
          .toLowerCase() === name &&
        /[\t\n\f\r />]/.test(str[candidateStart + name.length] || "") &&
        (isClose || name === "pre" || name === "code")
      ) {
        const candidateEnd = matchHtmlTagEnd(str, cursor, false);
        if (candidateEnd !== undefined) {
          depth += isClose ? -1 : 1;
          if (!depth) return { end: candidateEnd, boundary };
          cursor = candidateEnd;
          continue;
        }
      }
      if (name === "pre" || name === "code") {
        const rawName =
          /^<(script|style|textarea|title)(?=[\t\n\f\r />])/i.exec(
            str.slice(cursor, cursor + 11),
          );
        if (rawName) {
          cursor = (matchHtmlRegion(str, cursor) as { end: number }).end;
          continue;
        }
        const tagEnd = matchHtmlTagEnd(str, cursor);
        if (tagEnd !== undefined) {
          cursor = tagEnd;
          continue;
        }
      }
      cursor += 1;
    }
    return { end: str.length, boundary };
  }
  return { end, boundary };
}

// Preset blocks are nested; custom head/tail pairs retain their flat semantics.
export function matchTemplateBlockEnd(
  str: string,
  start: number,
  isProtected: (from: number, to: number) => boolean,
): number | undefined {
  const stack: string[] = [];
  let cursor = start;
  while (cursor < str.length) {
    const opener = str.indexOf("{%", cursor);
    if (opener < 0) break;
    const end = str.indexOf("%}", opener + 2);
    if (end < 0) break;
    const match = /^-?\s*(if|for|endif|endfor)(?=[\s%-]|$)/.exec(
      str.slice(opener + 2, end),
    );
    if (match && !isProtected(opener, end + 2)) {
      const name = match[1];
      if (name === "if" || name === "for") {
        stack.push(name);
      } else if (stack[stack.length - 1] === name.slice(3)) {
        stack.pop();
        if (!stack.length) return end + 2;
      }
    }
    cursor = end + 2;
  }
  return undefined;
}
