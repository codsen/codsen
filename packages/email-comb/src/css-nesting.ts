import { asciiLowerCase, type CssComment, type CssRegion } from "./css";

export interface NestedStyleRule {
  end: number;
  preludes: [number, number][];
  comments: CssComment[];
}

interface Candidate extends NestedStyleRule {
  start: number;
  nested: boolean;
}

const groups = new Set([
  "media",
  "supports",
  "document",
  "layer",
  "container",
  "scope",
  "starting-style",
]);
const legacyGroups = new Set(["media", "supports", "document"]);

/**
 * Locate complete style trees that the flat-rule pruning pass must preserve.
 * Removing a parent alternative can change nesting specificity, and selectors
 * such as :not(&) cannot be pruned by checking for a parent's class in HTML.
 * Only selector preludes are exposed; declaration component values stay opaque.
 */
export function collectNestedStyleRules(
  region: CssRegion,
): Map<number, NestedStyleRule> {
  const result = new Map<number, NestedStyleRule>();
  const tokens = [...region.tokens.values()].filter(
    (token) =>
      token.kind !== "whitespace" &&
      token.kind !== "comment" &&
      !(region.flags[token.range[0] - region.start] & 2),
  );
  const closes = new Map<number, number>();
  const opens: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.kind === "delimiter") {
      if (token.value === "{") opens.push(i);
      else if (token.value === "}" && opens.length)
        closes.set(opens.pop() as number, i);
    }
  }
  for (const open of opens) closes.set(open, tokens.length);

  const candidates: Candidate[] = [];
  const frames: {
    cursor: number;
    limit: number;
    mixed: boolean;
    root?: Candidate;
  }[] = [{ cursor: 0, limit: tokens.length, mixed: false }];

  while (frames.length) {
    const frame = frames[frames.length - 1];
    if (frame.cursor >= frame.limit) {
      frames.pop();
      continue;
    }
    const start = frame.cursor;
    const first = tokens[start];
    const position = first.range[0];
    const relative = position - region.start;
    // CSS Syntax discards CDO/CDC at stylesheet level only.
    if (
      frames.length === 1 &&
      (region.source.startsWith("<!--", relative) ||
        region.source.startsWith("-->", relative)) &&
      asciiLowerCase(region.source.slice(relative, relative + 7)) !== "<!--[if"
    ) {
      const end = position + (region.source[relative] === "<" ? 4 : 3);
      while (frame.cursor < frame.limit && tokens[frame.cursor].range[0] < end)
        frame.cursor++;
      continue;
    }
    const colon = tokens[start + 1];
    const declaration =
      frame.mixed &&
      first.kind === "identifier" &&
      colon?.kind === "delimiter" &&
      colon.value === ":";
    let cursor = start;
    while (cursor < frame.limit) {
      const token = tokens[cursor];
      if (token.kind === "delimiter") {
        if (token.value === ";" || token.value === "}") break;
        if (token.value === "{") {
          const close = closes.get(cursor) as number;
          if (declaration && first.value.startsWith("--")) {
            cursor = close + 1;
            continue;
          }
          // A sole initial {} value is declaration data. In contrast,
          // span:hover .child{} and span:is(.child){} are nested rules.
          let after = close + 1;
          if (
            tokens[after]?.value === "!" &&
            tokens[after + 1]?.kind === "identifier" &&
            asciiLowerCase(tokens[after + 1].value) === "important"
          )
            after += 2;
          if (
            declaration &&
            cursor === start + 2 &&
            (after >= frame.limit || tokens[after].value === ";")
          ) {
            cursor = after;
            continue;
          }
          break;
        }
      }
      cursor++;
    }
    if (cursor >= frame.limit || tokens[cursor].value !== "{") {
      frame.cursor = cursor + 1;
      continue;
    }

    const close = closes.get(cursor) as number;
    const end = close < tokens.length ? tokens[close].range[1] : region.end;
    frame.cursor = close + 1;
    const atRule = first.kind === "at-keyword";
    const name = atRule ? asciiLowerCase(first.value) : "";
    let root = frame.root;
    if (root) root.nested = true;
    if (!atRule || (groups.has(name) && !legacyGroups.has(name))) {
      if (!root) {
        root = {
          start: position,
          end,
          preludes: [],
          comments: [],
          nested: atRule,
        };
        candidates.push(root);
      }
      if (!atRule || name === "scope") {
        root.preludes.push([
          atRule ? first.range[1] : position,
          tokens[cursor].range[0],
        ]);
      }
    }
    if (!atRule || groups.has(name)) {
      frames.push({
        cursor: cursor + 1,
        limit: close,
        mixed: frame.mixed || !atRule,
        root,
      });
    }
  }
  const comments = region.comments.values();
  let comment = comments.next();
  for (const candidate of candidates) {
    if (!candidate.nested) continue;
    while (!comment.done && comment.value.from < candidate.end) {
      if (comment.value.from >= candidate.start)
        candidate.comments.push(comment.value);
      comment = comments.next();
    }
    result.set(candidate.start, candidate);
  }
  return result;
}
