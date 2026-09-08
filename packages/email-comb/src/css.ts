import { type CssToken, readCssToken } from "string-extract-class-names";

export interface CssRegion {
  source: string;
  start: number;
  end: number;
  /** Indexed relative to start: 1 = opaque, 2 = nested, 4 = attribute. */
  flags: Uint8Array;
  /** Token keys and ranges use absolute offsets in the original HTML. */
  tokens: Map<number, CssToken>;
}

export function asciiLowerCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 32),
  );
}

export function findStyleEnd(str: string, start: number): number {
  let candidate = str.indexOf("</", start);
  while (candidate !== -1) {
    const boundary = str[candidate + 7];
    if (
      boundary !== undefined &&
      " \t\n\r\f/>".includes(boundary) &&
      asciiLowerCase(str.slice(candidate + 2, candidate + 7)) === "style"
    ) {
      return candidate;
    }
    candidate = str.indexOf("</", candidate + 2);
  }
  return str.length;
}

export function createCssRegion(
  str: string,
  start: number,
  end: number,
): CssRegion {
  const css = str.slice(start, end);
  const flags = new Uint8Array(css.length);
  const tokens = new Map<number, CssToken>();
  const stack: ("(" | "[")[] = [];
  let attributeDepth = 0;

  for (let i = 0; i < css.length; ) {
    const token = readCssToken(css, i) as CssToken;
    const next = token.range[1];
    const nested = (stack.length ? 2 : 0) | (attributeDepth ? 4 : 0);
    flags.fill(nested, i, next);

    if (token.kind === "at-keyword" || token.kind === "comment") {
      flags.fill(nested | 1, i + 1, next);
    } else if (token.kind === "function") {
      flags.fill(nested | 1, i, next - 1);
      stack.push("(");
    } else if (token.kind === "delimiter") {
      if (token.value === "(" || token.value === "[") {
        stack.push(token.value);
        if (token.value === "[") {
          attributeDepth++;
        }
      } else if (
        (token.value === ")" && stack[stack.length - 1] === "(") ||
        (token.value === "]" && stack[stack.length - 1] === "[")
      ) {
        if (stack.pop() === "[") {
          attributeDepth--;
        }
      }
    } else if (token.kind !== "whitespace") {
      flags.fill(nested | 1, i, next);
    }

    token.range = [start + i, start + next];
    tokens.set(start + i, token);
    i = next;
  }

  return { source: css, start, end, flags, tokens };
}

interface WrapperPrelude {
  name: string;
  start: number;
  leadingStart: number;
}

interface WrapperBlock {
  wrapper: WrapperPrelude | null;
  open: number;
  empty: boolean;
  allowWrappers: boolean;
  atItemStart: boolean;
  prelude: WrapperPrelude | null;
}

export function removeEmptyWrappers(css: string): string {
  const region = createCssRegion(css, 0, css.length);
  const stack: WrapperBlock[] = [
    {
      wrapper: null,
      open: -1,
      empty: true,
      allowWrappers: true,
      atItemStart: true,
      prelude: null,
    },
  ];
  const deletions: [number, number][] = [];
  const unfinished: [number, number][] = [];

  function remove(from: number, to: number): void {
    // Children finish before their parents. Merge contained or adjacent ranges
    // as parents finish; each recorded range is pushed and popped at most once.
    while (deletions.length && deletions[deletions.length - 1][1] >= from) {
      const previous = deletions.pop() as [number, number];
      from = Math.min(from, previous[0]);
      to = Math.max(to, previous[1]);
    }
    deletions.push([from, to]);
  }

  for (const token of region.tokens.values()) {
    const block = stack[stack.length - 1];
    const position = token.range[0];
    if (token.kind === "whitespace") continue;
    if (token.kind === "comment") {
      if (!block.prelude) block.empty = false;
      continue;
    }

    const structural =
      token.kind === "delimiter" && !(region.flags[position] & 3);
    if (structural && token.value === "{") {
      const wrapper = block.prelude;
      block.prelude = null;
      if (!wrapper) block.empty = false;
      stack.push({
        wrapper,
        open: position,
        empty: true,
        allowWrappers: wrapper !== null,
        atItemStart: true,
        prelude: null,
      });
      continue;
    }
    if (structural && token.value === "}") {
      if (stack.length > 1) {
        stack.pop();
        const parent = stack[stack.length - 1];
        if (block.wrapper && block.empty && !block.prelude) {
          remove(block.wrapper.leadingStart, token.range[1]);
        } else {
          parent.empty = false;
        }
        parent.atItemStart = true;
      } else {
        block.empty = false;
        block.prelude = null;
        block.atItemStart = true;
      }
      continue;
    }
    if (structural && token.value === ";") {
      block.empty = false;
      block.prelude = null;
      block.atItemStart = true;
      continue;
    }

    if (token.kind === "at-keyword" && !(region.flags[position] & 3)) {
      const name = asciiLowerCase(token.value);
      if (
        block.allowWrappers &&
        block.atItemStart &&
        (name === "media" || name === "supports" || name === "document")
      ) {
        let leadingStart = position;
        while (
          leadingStart > 0 &&
          !(region.flags[leadingStart - 1] & 1) &&
          " \t\r\n\f".includes(css[leadingStart - 1])
        ) {
          leadingStart--;
        }
        block.prelude = { name, start: position, leadingStart };
        block.atItemStart = false;
        continue;
      }
      // A second at-keyword before the opening brace is a malformed prelude.
      // Preserve it rather than treating a suffix as an independent wrapper.
      block.prelude = null;
    }
    if (!block.prelude) block.empty = false;
    block.atItemStart = false;
  }

  // The established recovery removes only an unfinished empty @media header,
  // leaving its preceding and following whitespace in the original source.
  while (stack.length > 1) {
    const block = stack.pop() as WrapperBlock;
    if (block.wrapper?.name === "media" && block.empty && !block.prelude) {
      unfinished.push([block.wrapper.start, block.open + 1]);
    } else {
      stack[stack.length - 1].empty = false;
    }
  }

  if (!deletions.length && !unfinished.length) return css;
  const result: string[] = [];
  let cursor = 0;
  let closedIndex = 0;
  let unfinishedIndex = unfinished.length - 1;
  // Closed ranges are ordered forwards; EOF headers were collected in reverse.
  // Merge the two ordered streams without swallowing gaps between EOF headers.
  while (closedIndex < deletions.length || unfinishedIndex >= 0) {
    const [from, to] =
      unfinishedIndex < 0 ||
      (closedIndex < deletions.length &&
        deletions[closedIndex][0] <= unfinished[unfinishedIndex][0])
        ? deletions[closedIndex++]
        : unfinished[unfinishedIndex--];
    if (from > cursor) result.push(css.slice(cursor, from));
    cursor = Math.max(cursor, to);
  }
  result.push(css.slice(cursor));
  return result.join("");
}
