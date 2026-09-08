const jspNamespace = "http://java.sun.com/JSP/Page";

interface Tag {
  name: string;
  end: number;
  closing: boolean;
  selfClosing: boolean;
  complete: boolean;
  declarations: [string, string][];
}

interface Frame {
  name: string;
  previous: number | undefined;
  changes: [string, string | undefined][];
}

function isSpace(char: string | undefined): boolean {
  return char === " " || char === "\t" || char === "\r" || char === "\n";
}

function isNameChar(char: string | undefined): boolean {
  return Boolean(char && !isSpace(char) && !"/<>=\"'".includes(char));
}

// XML namespace values use XML references, never HTML named entities. One
// replacement pass deliberately leaves nested ampersand references encoded.
function decodeNamespace(value: string): string {
  return value.replace(
    /&(?:#([0-9]+)|#x([0-9a-fA-F]+)|(amp|lt|gt|quot|apos));/g,
    (whole: string, decimal: string, hex: string, named: string) => {
      if (named) {
        return named === "amp"
          ? "&"
          : named === "lt"
            ? "<"
            : named === "gt"
              ? ">"
              : named === "quot"
                ? '"'
                : "'";
      }
      const code = Number.parseInt(decimal || hex, decimal ? 10 : 16);
      // Every character in the standard URI is ASCII. Other references cannot
      // make this value equal to it, so no Unicode conversion is required.
      return code >= 0x20 && code <= 0x7e ? String.fromCharCode(code) : whole;
    },
  );
}

function readTag(str: string, from: number): Tag | null {
  let i = from + 1;
  // Keep the marker factory's permissive leading whitespace for fragments.
  while (str[i] && !str[i].trim()) i++;
  const closing = str[i] === "/";
  if (closing) i++;
  const nameStart = i;
  while (isNameChar(str[i])) i++;
  if (i === nameStart) return null;
  const name = str.slice(nameStart, i);
  const declarations: [string, string][] = [];
  while (i < str.length) {
    if (str[i] === ">") {
      return {
        name,
        end: i + 1,
        closing,
        selfClosing: str[i - 1] === "/",
        complete: true,
        declarations,
      };
    }
    if (isSpace(str[i]) || str[i] === "/") {
      i++;
      continue;
    }
    // A new opening cannot be an unquoted part of the previous tag. Recover
    // there without swallowing a later actual element.
    if (str[i] === "<") break;
    const attrStart = i;
    while (isNameChar(str[i])) i++;
    const attr = str.slice(attrStart, i);
    while (isSpace(str[i])) i++;
    const hasEquals = str[i] === "=";
    if (!hasEquals) {
      // Stray quotes still bound opaque attribute-like text in malformed tags.
      if (str[i] !== '"' && str[i] !== "'") {
        if (i === attrStart) i++;
        continue;
      }
    } else {
      i++;
      while (isSpace(str[i])) i++;
    }
    const quote = str[i];
    if (quote === '"' || quote === "'") {
      const valueStart = ++i;
      const end = str.indexOf(quote, i);
      if (end === -1) {
        i = str.length;
        break;
      }
      if (
        hasEquals &&
        !closing &&
        (attr === "xmlns" || attr.startsWith("xmlns:"))
      ) {
        const prefix = attr === "xmlns" ? "" : attr.slice(6);
        if (
          (attr === "xmlns" || prefix) &&
          prefix !== "xml" &&
          prefix !== "xmlns" &&
          !prefix.includes(":")
        ) {
          declarations.push([
            prefix,
            decodeNamespace(str.slice(valueStart, end)),
          ]);
        }
      }
      i = end + 1;
    } else {
      while (
        i < str.length &&
        !isSpace(str[i]) &&
        str[i] !== ">" &&
        str[i] !== "<"
      )
        i++;
    }
  }
  return {
    name,
    end: i,
    closing,
    selfClosing: false,
    complete: false,
    declarations,
  };
}

// Skip complete declarations, including a DOCTYPE internal subset. Quotes and
// comments can contain both angle brackets and the apparent subset terminator.
function skipDeclaration(str: string, from: number): number {
  let depth = 0;
  for (let i = from + 2; i < str.length; i++) {
    if (str.startsWith("<!--", i)) {
      const end = str.indexOf("-->", i + 4);
      if (end === -1) return str.length;
      i = end + 2;
    } else if (str[i] === '"' || str[i] === "'") {
      const end = str.indexOf(str[i], i + 1);
      if (end === -1) return str.length;
      i = end;
    } else if (str[i] === "[") depth++;
    else if (str[i] === "]" && depth) depth--;
    else if (str[i] === ">" && !depth) return i + 1;
  }
  return str.length;
}

export function hasJspSyntax(str: string): boolean {
  // Classic JSP is processed even in HTML comments/attribute values. These
  // existing scriptlet and property-name hints remain intentionally lexical.
  if (/<%|\${\s*jsp/i.test(str)) return true;

  const bindings = new Map<string, string>();
  const positions = new Map<string, number>();
  const stack: Frame[] = [];
  const restore = (frame: Frame): void => {
    for (let j = frame.changes.length - 1; j >= 0; j--) {
      const [prefix, previous] = frame.changes[j];
      if (previous === undefined) bindings.delete(prefix);
      else bindings.set(prefix, previous);
    }
  };

  for (let i = str.indexOf("<"); i !== -1; i = str.indexOf("<", i)) {
    if (str.startsWith("<!--", i) || str.startsWith("<![CDATA[", i)) {
      const comment = str[i + 2] === "-";
      const end = str.indexOf(comment ? "-->" : "]]>", i + (comment ? 4 : 9));
      if (end === -1) return false;
      i = end + 3;
      continue;
    }
    if (str.startsWith("<?", i)) {
      const end = str.indexOf("?>", i + 2);
      if (end === -1) return false;
      i = end + 2;
      continue;
    }
    if (str.startsWith("<!", i)) {
      i = skipDeclaration(str, i);
      continue;
    }
    const tag = readTag(str, i);
    if (!tag) {
      i++;
      continue;
    }
    i = tag.end;
    if (tag.closing) {
      const position = positions.get(tag.name);
      if (tag.complete && position !== undefined) {
        while (stack.length > position) {
          const frame = stack.pop() as Frame;
          restore(frame);
          if (frame.previous === undefined) positions.delete(frame.name);
          else positions.set(frame.name, frame.previous);
        }
      }
      continue;
    }

    const frame: Frame = {
      name: tag.name,
      previous: positions.get(tag.name),
      changes: [],
    };
    for (const [prefix, value] of tag.declarations) {
      frame.changes.push([prefix, bindings.get(prefix)]);
      bindings.set(prefix, value);
    }
    const colon = tag.name.indexOf(":");
    const prefix = colon === -1 ? "" : tag.name.slice(0, colon);
    const local = colon === -1 ? tag.name : tag.name.slice(colon + 1);
    if (
      tag.complete &&
      colon !== 0 &&
      local &&
      !local.includes(":") &&
      bindings.get(prefix) === jspNamespace
    ) {
      return true;
    }
    if (colon > 0 && !bindings.has(prefix) && /^(?:jsp|cms|c)$/i.test(prefix)) {
      return true;
    }
    if (tag.complete && !tag.selfClosing) {
      positions.set(tag.name, stack.length);
      stack.push(frame);
    } else restore(frame);
  }
  return false;
}
