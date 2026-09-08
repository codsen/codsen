function digit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function identifierCharacter(char: string): boolean {
  return (
    digit(char) ||
    (char >= "a" && char <= "z") ||
    (char >= "A" && char <= "Z") ||
    char === "-"
  );
}

// Validate the raw spelling: numeric components need not fit a JS number.
function validVersion(value: string): boolean {
  let i = 0;
  for (let component = 0; component < 3; component += 1) {
    const start = i;
    while (digit(value[i])) i += 1;
    if (i === start || (i - start > 1 && value[start] === "0")) return false;
    if (component < 2) {
      if (value[i] !== ".") return false;
      i += 1;
    }
  }
  for (const marker of ["-", "+"]) {
    if (value[i] !== marker) continue;
    i += 1;
    for (;;) {
      const start = i;
      let numeric = true;
      while (identifierCharacter(value[i])) {
        if (!digit(value[i])) numeric = false;
        i += 1;
      }
      if (
        i === start ||
        (marker === "-" && numeric && i - start > 1 && value[start] === "0")
      )
        return false;
      if (value[i] !== ".") break;
      i += 1;
    }
  }
  return i === value.length;
}

function skipSpace(line: string, from: number): number {
  while (line[from] === " " || line[from] === "\t") from += 1;
  return from;
}

function titleEnd(line: string, from: number): number | undefined {
  const opening = line[from];
  if (opening !== '"' && opening !== "'" && opening !== "(") return;
  const closing = opening === "(" ? ")" : opening;
  for (let i = from + 1; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\\") {
      const next = line[i + 1];
      if (
        next === closing ||
        next === "\\" ||
        (opening === "(" && next === "(")
      )
        i += 1;
    } else if (char === closing) {
      return i + 1;
    } else if (
      char === "\r" ||
      char === "\n" ||
      (opening === "(" && char === "(")
    ) {
      return;
    }
  }
}

function destinationEnd(line: string, from: number): number | undefined {
  if (line[from] === "<") {
    for (let i = from + 1; i < line.length; i += 1) {
      const char = line[i];
      if (char === "\\" && /[<>\\]/.test(line[i + 1] || "")) i += 1;
      else if (char === ">") return i + 1;
      else if (char === "<" || char === "\r" || char === "\n") return;
    }
    return;
  }
  let depth = 0;
  for (let i = from; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\\" && /[()\\]/.test(line[i + 1] || "")) {
      i += 1;
    } else if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      if (!depth) return i > from ? i : undefined;
      depth -= 1;
    } else if (char.charCodeAt(0) <= 32 || char === "\u007f") {
      return !depth && i > from && (char === " " || char === "\t")
        ? i
        : undefined;
    }
  }
}

function linkEnd(line: string, from: number): number | undefined {
  const start = skipSpace(line, from);
  if (line[start] === ")") return start + 1;
  const destination = destinationEnd(line, start);
  if (destination !== undefined) {
    const after = skipSpace(line, destination);
    if (line[after] === ")") return after + 1;
    if (after > destination) {
      const title = titleEnd(line, after);
      if (title !== undefined) {
        const end = skipSpace(line, title);
        if (line[end] === ")") return end + 1;
      }
    }
  }
}

export function removeVersionLink(line: string): string {
  let i = 0;
  while (line[i] === " " && i < 4) i += 1;
  if (i === 4 || line[i] !== "#") return line;
  const hashStart = i;
  while (line[i] === "#" && i - hashStart < 7) i += 1;
  if (i - hashStart > 6 || (line[i] !== " " && line[i] !== "\t")) return line;
  const start = skipSpace(line, i);
  if (line[start] !== "[" || !digit(line[start + 1])) return line;
  const labelEnd = line.indexOf("]", start + 1);
  if (labelEnd === -1 || line[labelEnd + 1] !== "(") return line;
  const version = line.slice(start + 1, labelEnd);
  if (!validVersion(version)) return line;
  const end = linkEnd(line, labelEnd + 2);
  return end === undefined
    ? line
    : line.slice(0, start) + version + line.slice(end);
}
