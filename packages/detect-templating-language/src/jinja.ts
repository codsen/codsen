interface TemplateToken {
  bodyStart: number;
  bodyEnd: number;
  end: number;
  format: boolean;
  valid: boolean;
}

function isWhitespace(char: string | undefined): boolean {
  return Boolean(char && !char.trim());
}

function isDigit(char: string | undefined): boolean {
  return Boolean(char && char >= "0" && char <= "9");
}

// This checks printf conversion syntax, not the runtime values or argument
// count. Escaped percent pairs are literal text and do not supply a hint.
function hasPrintfConversion(str: string, from: number, to: number): boolean {
  let found = false;
  for (let i = from; i < to; i++) {
    if (str[i] !== "%") continue;
    i++;
    if (str[i] === "%") continue;

    if (str[i] === "(") {
      let depth = 1;
      while (++i < to && depth) {
        if (str[i] === "(") depth++;
        else if (str[i] === ")") depth--;
      }
      if (depth) return false;
    }

    while (i < to && "#0- +".includes(str[i])) i++;
    if (str[i] === "*") i++;
    else while (i < to && isDigit(str[i])) i++;
    if (str[i] === ".") {
      i++;
      if (str[i] === "*") i++;
      else while (i < to && isDigit(str[i])) i++;
    }
    if (i < to && "hlL".includes(str[i])) i++;
    if (i >= to || !"diouxXeEfFgGcrsa".includes(str[i])) return false;
    found = true;
  }
  return found;
}

function hasFormatCall(str: string, from: number): boolean {
  let i = from;
  while (isWhitespace(str[i])) i++;
  if (str[i] !== "|") return false;
  i++;
  while (isWhitespace(str[i])) i++;
  if (!str.startsWith("format", i)) return false;
  i += 6;
  while (isWhitespace(str[i])) i++;
  return str[i] === "(";
}

// The outer delimiter cannot close inside a quoted string or a nested
// expression. The scan advances without backtracking; each candidate literal
// receives one additional printf-conversion check.
function readToken(str: string, start: number): TemplateToken | null {
  const closer = str[start + 1] === "%" ? "%" : "}";
  const stack: string[] = [];
  let bodyStart = start + 2;
  if (str[bodyStart] === "-" || str[bodyStart] === "+") bodyStart++;
  let format = false;
  let valid = true;
  let previousWasString = false;

  for (let i = bodyStart; i < str.length; i++) {
    const char = str[i];
    const adjacentString = previousWasString;
    if (
      previousWasString &&
      char !== '"' &&
      char !== "'" &&
      !isWhitespace(char)
    ) {
      previousWasString = false;
    }
    if (char === '"' || char === "'") {
      const contentStart = i + 1;
      while (++i < str.length) {
        if (str[i] === "\\") i++;
        else if (str[i] === char) break;
      }
      if (i >= str.length) return null;
      previousWasString = true;
      if (
        !format &&
        !adjacentString &&
        hasFormatCall(str, i + 1) &&
        hasPrintfConversion(str, contentStart, i)
      ) {
        format = true;
      }
    } else if (!stack.length && char === closer && str[i + 1] === "}") {
      let bodyEnd = i;
      if (str[i - 1] === "-" || str[i - 1] === "+") bodyEnd--;
      return { bodyStart, bodyEnd, end: i + 2, format, valid };
    } else if (char === "(" || char === "[" || char === "{") {
      if (valid) stack.push(char);
    } else if (char === ")" || char === "]" || char === "}") {
      const expected = char === ")" ? "(" : char === "]" ? "[" : "{";
      if (stack.pop() !== expected) {
        valid = false;
        stack.length = 0;
        // Recover at this malformed token's next unquoted delimiter. The
        // invalid token cannot contribute a hint, but later tokens still can.
        if (char === closer && str[i + 1] === "}") {
          return { bodyStart, bodyEnd: i, end: i + 2, format, valid };
        }
      }
    }
  }
  return null;
}

export function hasJinjaSpecificSyntax(str: string): boolean {
  for (let i = str.indexOf("{"); i !== -1; i = str.indexOf("{", i)) {
    const kind = str[i + 1];
    if (kind === "#") {
      const end = str.indexOf("#}", i + 2);
      if (end === -1) return false;
      i = end + 2;
    } else if (kind === "{" || kind === "%") {
      const token = readToken(str, i);
      if (!token) return false;
      if (!token.valid) {
        i = token.end;
        continue;
      }
      if (kind === "%") {
        const body = str.slice(token.bodyStart, token.bodyEnd).trim();
        if (body === "raw" || body === "verbatim") {
          const endPattern =
            body === "raw"
              ? /\{%[-+]?\s*endraw\s*[-+]?%\}/g
              : /\{%[-+]?\s*endverbatim\s*[-+]?%\}/g;
          endPattern.lastIndex = token.end;
          if (!endPattern.test(str)) return false;
          i = endPattern.lastIndex;
          continue;
        }
        // The existing hint supports ASCII assignment names. A boundary on
        // both keywords prevents quoted text and longer names from promoting.
        if (/^set\s+[A-Za-z_]\w*\s*=\s*namespace\s*\(/.test(body)) {
          return true;
        }
      }
      if (token.format) return true;
      i = token.end;
    } else {
      i++;
    }
  }
  return false;
}
