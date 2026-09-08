function isAsciiPunctuation(code: number): boolean {
  return (
    (code >= 33 && code <= 47) ||
    (code >= 58 && code <= 64) ||
    (code >= 91 && code <= 96) ||
    (code >= 123 && code <= 126)
  );
}

export function removeUrls(str: string): string {
  if (!str.includes("http")) return str;

  const openings = /https?:\/\//g;
  const chunks: string[] = [];
  let retainedFrom = 0;
  for (;;) {
    const match = openings.exec(str);
    if (!match) break;
    const from = match.index;
    const authorityStartsAt = openings.lastIndex;
    const squareWrapper = str[from - 1] === "[";
    const singleQuoteWrapper = str[from - 1] === "'";
    let parentheses = 0;
    let brackets = 0;
    let to = authorityStartsAt;

    while (to < str.length) {
      const char = str[to];
      if (char === "\\" && isAsciiPunctuation(str.charCodeAt(to + 1))) {
        to += 2;
        continue;
      }
      if (
        /\s/.test(char) ||
        char === '"' ||
        char === "`" ||
        char === "<" ||
        char === ">" ||
        (singleQuoteWrapper && char === "'")
      ) {
        break;
      }
      if (char === "(") {
        parentheses += 1;
      } else if (char === ")") {
        if (!parentheses) break;
        parentheses -= 1;
      } else if (char === "[") {
        brackets += 1;
      } else if (char === "]") {
        if (brackets) brackets -= 1;
        else if (squareWrapper) break;
      }
      to += 1;
    }

    // Invalid candidates also advance, so embedded schemes cannot rescan a suffix.
    openings.lastIndex = to;
    const authorityStart = str[authorityStartsAt];
    if (!authorityStart || "/\\?#".includes(authorityStart)) continue;

    let candidate = str.slice(from, to);
    if (candidate.includes("\\")) {
      candidate = candidate.replace(
        /\\([\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E])/g,
        "$1",
      );
    }
    // Sentence punctuation after a bare port must not invalidate its address.
    let candidateEndsAt = candidate.length;
    while (
      candidateEndsAt &&
      ".,;:!?".includes(candidate[candidateEndsAt - 1])
    ) {
      candidateEndsAt -= 1;
    }
    if (candidateEndsAt !== candidate.length) {
      candidate = candidate.slice(0, candidateEndsAt);
    }
    try {
      new URL(candidate);
    } catch {
      continue;
    }

    chunks.push(str.slice(retainedFrom, from), " ");
    retainedFrom = to;
  }

  if (!chunks.length) return str;
  chunks.push(str.slice(retainedFrom));
  return chunks.join("");
}
