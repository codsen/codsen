interface Cursor {
  index: number;
  column: number;
  tabSpaces: number;
}

interface Container {
  quote: boolean;
  indent: number;
}

interface Fence {
  marker: string;
  length: number;
}

interface LineTail {
  end: number;
  marker: string;
  start: number;
  third: number;
}

type HtmlBlock =
  | "raw"
  | "comment"
  | "instruction"
  | "declaration"
  | "cdata"
  | "blank";

const htmlBlockNames = new Set(
  "address article aside base basefont blockquote body caption center col colgroup dd details dialog dir div dl dt fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html iframe legend li link main menu menuitem nav noframes ol optgroup option p param search section summary table tbody td tfoot th thead title tr track ul".split(
    " ",
  ),
);

function character(line: string, cursor: Cursor): string | undefined {
  return cursor.tabSpaces ? " " : line[cursor.index];
}

// Tabs can be partly consumed by a container prefix. Keep their remaining
// virtual spaces in the cursor instead of expanding or rewriting the line.
function spaces(line: string, cursor: Cursor, limit = Infinity): number {
  let count = 0;
  while (count < limit) {
    if (cursor.tabSpaces) {
      cursor.tabSpaces -= 1;
    } else if (line[cursor.index] === " ") {
      cursor.index += 1;
    } else if (line[cursor.index] === "\t") {
      cursor.index += 1;
      cursor.tabSpaces = 3 - (cursor.column % 4);
    } else {
      break;
    }
    cursor.column += 1;
    count += 1;
  }
  return count;
}

function advance(cursor: Cursor, count = 1): void {
  cursor.index += count;
  cursor.column += count;
}

function whitespaceOnly(line: string, from: number): boolean {
  for (let i = from; i < line.length; i++) {
    if (line[i] !== " " && line[i] !== "\t") return false;
  }
  return true;
}

function lineTail(line: string): LineTail {
  let end = line.length;
  while (end && (line[end - 1] === " " || line[end - 1] === "\t")) end -= 1;
  const marker = line[end - 1];
  let start = end;
  let third = -1;
  if (marker === "*" || marker === "-" || marker === "_") {
    let count = 0;
    while (start) {
      const char = line[start - 1];
      if (char === marker) {
        count += 1;
        if (count === 3) third = start - 1;
      } else if (char !== " " && char !== "\t") break;
      start -= 1;
    }
  }
  return { end, marker, start, third };
}

function fenceOpening(line: string, from: number): Fence | undefined {
  const marker = line[from];
  if (marker !== "`" && marker !== "~") return;
  let end = from + 1;
  while (line[end] === marker) end += 1;
  if (end - from < 3 || (marker === "`" && line.indexOf("`", end) !== -1))
    return;
  return { marker, length: end - from };
}

function fenceClosing(line: string, cursor: Cursor, fence: Fence): boolean {
  spaces(line, cursor, 3);
  if (character(line, cursor) !== fence.marker) return false;
  let end = cursor.index;
  while (line[end] === fence.marker) end += 1;
  return end - cursor.index >= fence.length && whitespaceOnly(line, end);
}

function thematicBreak(line: string, from: number, tail: LineTail): boolean {
  // Cache the trailing run once: testing every nested '*' list prefix by
  // rescanning its remaining suffix would make a long near miss quadratic.
  return line[from] === tail.marker && from >= tail.start && from <= tail.third;
}

function heading(line: string, from: number, paragraph: boolean): boolean {
  const marker = line[from];
  let end = from;
  if (marker === "#") {
    while (line[end] === "#") end += 1;
    return (
      end - from <= 6 &&
      (end === line.length || line[end] === " " || line[end] === "\t")
    );
  }
  if (paragraph && (marker === "=" || marker === "-")) {
    while (line[end] === marker) end += 1;
    return whitespaceOnly(line, end);
  }
  return false;
}

// On success, leave the cursor at the new item's content and return its
// continuation indentation. Failed recognition leaves the caller's cursor alone.
function listOpening(
  line: string,
  cursor: Cursor,
  paragraph: boolean,
  tail: LineTail,
): number | undefined {
  const start = { ...cursor };
  spaces(line, cursor, 3);
  const markerStart = cursor.index;
  const marker = character(line, cursor);
  if (marker === "*" || marker === "+" || marker === "-") {
    if (thematicBreak(line, markerStart, tail)) {
      Object.assign(cursor, start);
      return;
    }
    advance(cursor);
  } else {
    let end = markerStart;
    while (line[end] >= "0" && line[end] <= "9" && end - markerStart < 10)
      end += 1;
    if (
      cursor.tabSpaces ||
      end === markerStart ||
      end - markerStart > 9 ||
      (line[end] !== "." && line[end] !== ")") ||
      (paragraph && (end - markerStart !== 1 || marker !== "1"))
    ) {
      Object.assign(cursor, start);
      return;
    }
    advance(cursor, end - markerStart + 1);
  }
  const afterMarker = { ...cursor };
  const padding = spaces(line, cursor, 5);
  const empty = whitespaceOnly(line, cursor.index);
  if ((!padding && cursor.index < line.length) || (paragraph && empty)) {
    Object.assign(cursor, start);
    return;
  }
  if (!padding || padding > 4 || empty) {
    Object.assign(cursor, afterMarker);
    spaces(line, cursor, 1);
    return afterMarker.column - start.column + 1;
  }
  return cursor.column - start.column;
}

function htmlEnds(line: string, from: number, block: HtmlBlock): boolean {
  if (block === "raw") return /<\/(?:pre|script|style|textarea)>/i.test(line);
  if (block === "comment") return line.indexOf("-->", from) !== -1;
  if (block === "instruction") return line.indexOf("?>", from) !== -1;
  if (block === "declaration") return line.indexOf(">", from) !== -1;
  if (block === "cdata") return line.indexOf("]]>", from) !== -1;
  return whitespaceOnly(line, from);
}

// Raw HTML suppresses Markdown block starts; it is not itself protected code.
// This bounded tag scan only establishes CommonMark's complete-tag block form.
function completeHtmlTag(
  line: string,
  from: number,
  closing: boolean,
): boolean {
  let i = from;
  for (;;) {
    const before = i;
    while (line[i] === " " || line[i] === "\t") i += 1;
    if (line[i] === ">") return whitespaceOnly(line, i + 1);
    if (!closing && line[i] === "/" && line[i + 1] === ">")
      return whitespaceOnly(line, i + 2);
    if (closing || i === before || !/[A-Za-z_:]/.test(line[i] || ""))
      return false;
    i += 1;
    while (/[A-Za-z0-9_.:-]/.test(line[i] || "")) i += 1;
    const afterName = i;
    while (line[i] === " " || line[i] === "\t") i += 1;
    if (line[i] !== "=") {
      i = afterName;
      continue;
    }
    i += 1;
    while (line[i] === " " || line[i] === "\t") i += 1;
    if (line[i] === '"' || line[i] === "'") {
      const end = line.indexOf(line[i], i + 1);
      if (end === -1) return false;
      i = end + 1;
    } else {
      const valueStart = i;
      while (i < line.length && !/[ \t"'=<>`]/.test(line[i])) i += 1;
      if (i === valueStart) return false;
    }
  }
}

function htmlOpening(
  line: string,
  from: number,
  paragraph: boolean,
): HtmlBlock | undefined {
  if (line[from] !== "<") return;
  if (line.startsWith("<!--", from)) return "comment";
  if (line.startsWith("<?", from)) return "instruction";
  if (line.startsWith("<![CDATA[", from)) return "cdata";
  if (line[from + 1] === "!" && line[from + 2] >= "A" && line[from + 2] <= "Z")
    return "declaration";
  const closing = line[from + 1] === "/";
  const start = from + (closing ? 2 : 1);
  if (!/[A-Za-z]/.test(line[start] || "")) return;
  let end = start + 1;
  while (/[A-Za-z0-9-]/.test(line[end] || "")) end += 1;
  const name = line.slice(start, end).toLowerCase();
  const boundary =
    end === line.length ||
    line[end] === " " ||
    line[end] === "\t" ||
    line[end] === ">";
  if (
    !closing &&
    boundary &&
    (name === "pre" ||
      name === "script" ||
      name === "style" ||
      name === "textarea")
  )
    return "raw";
  if (
    htmlBlockNames.has(name) &&
    (boundary || (line[end] === "/" && line[end + 1] === ">"))
  )
    return "blank";
  if (!paragraph && completeHtmlTag(line, end, closing)) return "blank";
}

function interruptsContainerParagraph(
  line: string,
  cursor: Cursor,
  tail: LineTail,
): boolean {
  const position = { ...cursor };
  if (spaces(line, position) >= 4 || position.index === line.length)
    return false;
  return (
    character(line, position) === ">" ||
    !!fenceOpening(line, position.index) ||
    heading(line, position.index, false) ||
    thematicBreak(line, position.index, tail) ||
    !!htmlOpening(line, position.index, true) ||
    // The previous container failed to continue. A new container can start an
    // ordered list at any number; the ordinary paragraph restriction to 1 is
    // still applied when opening lists inside a continuing container below.
    listOpening(line, { ...cursor }, false, tail) !== undefined
  );
}

/** Classify code blocks without changing original physical lines. This scanner
 * tracks the block boundaries needed by changelog cleanup; it does not parse
 * inline Markdown or produce a document tree. */
export function protectedLiteralLines(
  lines: readonly string[],
): Set<number> | undefined {
  let protectedLines: Set<number> | undefined;
  const containers: Container[] = [];
  const quoteIndices: number[] = [];
  let fence: Fence | undefined;
  let html: HtmlBlock | undefined;
  let paragraph = false;
  let indented = false;
  let pendingBlank = -1;
  let emptyListDepth = -1;
  let emptyListHadBlank = false;

  function protect(index: number): void {
    if (!protectedLines) protectedLines = new Set<number>();
    protectedLines.add(index);
  }

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const tail = lineTail(line);
    const cursor: Cursor = { index: 0, column: 0, tabSpaces: 0 };
    let continued = 0;
    let continuedQuotes = 0;
    while (continued < containers.length) {
      const start = { ...cursor };
      // A blank remainder can continue any number of list frames, but cannot
      // supply a missing quote marker. Avoid walking deep lists on every blank.
      if (cursor.index >= tail.end) {
        continued = quoteIndices[continuedQuotes] ?? containers.length;
        if (emptyListDepth !== -1 && emptyListDepth < continued)
          emptyListHadBlank = true;
        spaces(line, cursor);
        break;
      }
      // An initially empty item ends before new content after another blank
      // line. Nonempty items can continue through any number of blank lines.
      if (continued === emptyListDepth && emptyListHadBlank) break;
      const container = containers[continued];
      if (container.quote) {
        spaces(line, cursor, 3);
        if (character(line, cursor) !== ">") {
          Object.assign(cursor, start);
          break;
        }
        advance(cursor);
        spaces(line, cursor, 1);
        continuedQuotes += 1;
      } else if (spaces(line, cursor, container.indent) !== container.indent) {
        Object.assign(cursor, start);
        break;
      }
      if (continued === emptyListDepth) emptyListDepth = -1;
      continued += 1;
    }

    if (continued !== containers.length) {
      if (
        paragraph &&
        cursor.index < tail.end &&
        !interruptsContainerParagraph(line, cursor, tail)
      )
        continue;
      containers.length = continued;
      quoteIndices.length = continuedQuotes;
      if (emptyListDepth >= continued) emptyListDepth = -1;
      fence = undefined;
      html = undefined;
      paragraph = false;
      indented = false;
      pendingBlank = -1;
    }

    if (fence) {
      protect(lineIndex);
      if (fenceClosing(line, cursor, fence)) fence = undefined;
      continue;
    }
    if (html) {
      if (htmlEnds(line, cursor.index, html)) html = undefined;
      continue;
    }

    const leafStart = { ...cursor };
    const indentation = spaces(line, cursor);
    const blank = cursor.index === line.length;
    if (indented) {
      if (blank) {
        if (pendingBlank === -1) pendingBlank = lineIndex;
        continue;
      }
      if (indentation >= 4) {
        if (pendingBlank !== -1) {
          for (let i = pendingBlank; i < lineIndex; i++) protect(i);
        }
        pendingBlank = -1;
        protect(lineIndex);
        continue;
      }
      indented = false;
      pendingBlank = -1;
    }
    Object.assign(cursor, leafStart);

    // Concrete code/HTML was handled above, so new container markers can now
    // establish a child block. Their prefixes remain in the original line.
    for (;;) {
      const start = { ...cursor };
      spaces(line, cursor, 3);
      if (character(line, cursor) === ">") {
        quoteIndices.push(containers.length);
        containers.push({ quote: true, indent: 0 });
        advance(cursor);
        spaces(line, cursor, 1);
        paragraph = false;
        continue;
      }
      Object.assign(cursor, start);
      if (paragraph && heading(line, cursor.index, true)) break;
      const indent = listOpening(line, cursor, paragraph, tail);
      if (indent === undefined) break;
      containers.push({ quote: false, indent });
      if (cursor.index >= tail.end) {
        emptyListDepth = containers.length - 1;
        emptyListHadBlank = false;
      }
      paragraph = false;
    }

    const indent = spaces(line, cursor);
    if (cursor.index === line.length) {
      paragraph = false;
      continue;
    }
    if (indent >= 4) {
      if (!paragraph) {
        indented = true;
        protect(lineIndex);
      }
      continue;
    }
    fence = fenceOpening(line, cursor.index);
    if (fence) {
      protect(lineIndex);
      paragraph = false;
      continue;
    }
    html = htmlOpening(line, cursor.index, paragraph);
    if (html) {
      if (htmlEnds(line, cursor.index, html)) html = undefined;
      paragraph = false;
      continue;
    }
    paragraph =
      !heading(line, cursor.index, paragraph) &&
      !thematicBreak(line, cursor.index, tail);
  }
  return protectedLines;
}
