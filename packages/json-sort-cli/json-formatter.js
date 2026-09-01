import { sortOrder } from "sort-package-json";

const numberToken = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
const hexDigit = /^[\dA-Fa-f]$/;
const packageOrder = sortOrder.filter((key) => !["lect", "tap"].includes(key));
packageOrder.splice(packageOrder.indexOf("resolutions"), 0, "tap", "lect");
const packageRank = new Map(packageOrder.map((key, index) => [key, index]));

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function comparePackageKeys(left, right) {
  const leftRank = packageRank.get(left);
  const rightRank = packageRank.get(right);

  if (leftRank !== undefined || rightRank !== undefined) {
    if (leftRank === undefined) {
      return 1;
    }
    if (rightRank === undefined) {
      return -1;
    }
    return leftRank - rightRank;
  }

  const leftPrivate = left.startsWith("_");
  const rightPrivate = right.startsWith("_");
  if (leftPrivate !== rightPrivate) {
    return leftPrivate ? 1 : -1;
  }
  return compareStrings(left, right);
}

function syntaxError(message, position) {
  return new SyntaxError(
    `json-sort-cli/parseJson(): [THROW_ID_01] ${message} at character ${position}`,
  );
}

function tokenize(json) {
  let index = 0;

  return function nextToken() {
    while (/[\t\n\r ]/u.test(json[index] ?? "")) {
      index += 1;
    }

    const position = index;
    const character = json[index];
    if (character === undefined) {
      return { position, type: "eof" };
    }
    if ("{}[]:,".includes(character)) {
      index += 1;
      return { position, type: character };
    }
    if (character === '"') {
      index += 1;
      while (index < json.length) {
        const code = json.charCodeAt(index);
        if (code === 0x22) {
          index += 1;
          const raw = json.slice(position, index);
          return {
            position,
            raw,
            type: "string",
            value: JSON.parse(raw),
          };
        }
        if (code <= 0x1f) {
          throw syntaxError("Unescaped control character in string", index);
        }
        if (code === 0x5c) {
          index += 1;
          const escaped = json[index];
          if (escaped === "u") {
            for (let offset = 1; offset <= 4; offset += 1) {
              if (!hexDigit.test(json[index + offset] ?? "")) {
                throw syntaxError("Invalid Unicode escape", index);
              }
            }
            index += 5;
            continue;
          }
          if (!'"\\/bfnrt'.includes(escaped ?? "")) {
            throw syntaxError("Invalid escape sequence", index);
          }
          index += 1;
          continue;
        }
        index += 1;
      }
      throw syntaxError("Unterminated string", position);
    }

    numberToken.lastIndex = index;
    const numberMatch = numberToken.exec(json);
    if (numberMatch) {
      index = numberToken.lastIndex;
      return { position, raw: numberMatch[0], type: "number" };
    }

    for (const literal of ["true", "false", "null"]) {
      if (json.startsWith(literal, index)) {
        index += literal.length;
        return { position, raw: literal, type: "literal" };
      }
    }

    throw syntaxError(
      `Unexpected token ${JSON.stringify(character)}`,
      position,
    );
  };
}

function scalarNode(token) {
  if (token.type === "string") {
    return { type: "string", value: token.value };
  }
  if (token.type === "number" || token.type === "literal") {
    return { raw: token.raw, type: token.type };
  }
  return undefined;
}

export function parseJson(json) {
  const nextToken = tokenize(json.replace(/^\uFEFF/u, ""));
  const stack = [];
  let root;
  let hasRoot = false;

  function attachValue(token) {
    let node = scalarNode(token);
    if (!node && token.type === "{") {
      node = { entries: [], type: "object" };
    } else if (!node && token.type === "[") {
      node = { items: [], type: "array" };
    }
    if (!node) {
      throw syntaxError("Expected a JSON value", token.position);
    }

    const parent = stack.at(-1);
    if (!parent) {
      root = node;
      hasRoot = true;
    } else if (parent.node.type === "array") {
      parent.node.items.push(node);
      parent.state = "commaOrEnd";
    } else {
      parent.node.entries.push({ key: parent.pendingKey, value: node });
      parent.pendingKey = undefined;
      parent.state = "commaOrEnd";
    }

    if (node.type === "array") {
      stack.push({ node, state: "firstValueOrEnd" });
    } else if (node.type === "object") {
      stack.push({ keys: new Set(), node, state: "firstKeyOrEnd" });
    }
  }

  while (true) {
    const token = nextToken();
    const frame = stack.at(-1);

    if (!frame) {
      if (!hasRoot) {
        if (token.type === "eof") {
          throw syntaxError("Expected a JSON value", token.position);
        }
        attachValue(token);
        continue;
      }
      if (token.type !== "eof") {
        throw syntaxError(
          "Unexpected content after the JSON value",
          token.position,
        );
      }
      return root;
    }

    if (frame.node.type === "array") {
      if (frame.state === "firstValueOrEnd") {
        if (token.type === "]") {
          stack.pop();
        } else {
          attachValue(token);
        }
      } else if (frame.state === "value") {
        attachValue(token);
      } else if (token.type === ",") {
        frame.state = "value";
      } else if (token.type === "]") {
        stack.pop();
      } else {
        throw syntaxError(
          "Expected a comma or closing bracket",
          token.position,
        );
      }
      continue;
    }

    if (frame.state === "firstKeyOrEnd") {
      if (token.type === "}") {
        stack.pop();
        continue;
      }
      frame.state = "key";
    }
    if (frame.state === "key") {
      if (token.type !== "string") {
        throw syntaxError("Expected an object member name", token.position);
      }
      if (frame.keys.has(token.value)) {
        throw syntaxError(
          `Duplicate object member ${JSON.stringify(token.value)}`,
          token.position,
        );
      }
      frame.keys.add(token.value);
      frame.pendingKey = token.value;
      frame.state = "colon";
    } else if (frame.state === "colon") {
      if (token.type !== ":") {
        throw syntaxError("Expected a colon", token.position);
      }
      frame.state = "value";
    } else if (frame.state === "value") {
      attachValue(token);
    } else if (token.type === ",") {
      frame.state = "key";
    } else if (token.type === "}") {
      stack.pop();
    } else {
      throw syntaxError("Expected a comma or closing brace", token.position);
    }
  }
}

export function decodeJson(contents) {
  if (typeof contents === "string") {
    return contents;
  }
  if (!(contents instanceof Uint8Array)) {
    throw new TypeError(
      "json-sort-cli/decodeJson(): [THROW_ID_01] Input must be a string or Uint8Array",
    );
  }
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
      contents,
    );
  } catch (error) {
    throw new SyntaxError(
      "json-sort-cli/decodeJson(): [THROW_ID_02] Input is not valid UTF-8",
      { cause: error },
    );
  }
}

function sortTree(root, { arrays, packageJson }) {
  const pending = [{ isRoot: true, node: root }];
  while (pending.length) {
    const { isRoot, node } = pending.pop();
    if (node.type === "object") {
      node.entries.sort((left, right) =>
        isRoot && packageJson
          ? comparePackageKeys(left.key, right.key)
          : compareStrings(left.key, right.key),
      );
      for (let index = node.entries.length - 1; index >= 0; index -= 1) {
        pending.push({ isRoot: false, node: node.entries[index].value });
      }
    } else if (node.type === "array") {
      if (
        arrays &&
        node.items.length > 1 &&
        node.items.every((item) => item.type === "string")
      ) {
        node.items.sort((left, right) =>
          compareStrings(left.value, right.value),
        );
      }
      for (let index = node.items.length - 1; index >= 0; index -= 1) {
        pending.push({ isRoot: false, node: node.items[index] });
      }
    }
  }
}

function serialize(root, indentation) {
  const chunks = [];
  const events = [{ depth: 0, node: root, type: "node" }];

  while (events.length) {
    const event = events.pop();
    if (event.type === "text") {
      chunks.push(event.value);
      continue;
    }

    const { depth, node } = event;
    if (node.type === "number" || node.type === "literal") {
      chunks.push(node.raw);
      continue;
    }
    if (node.type === "string") {
      chunks.push(JSON.stringify(node.value));
      continue;
    }

    const values = node.type === "array" ? node.items : node.entries;
    const opening = node.type === "array" ? "[" : "{";
    const closing = node.type === "array" ? "]" : "}";
    if (!values.length) {
      chunks.push(`${opening}${closing}`);
      continue;
    }

    const multiline = indentation.length > 0;
    const localEvents = [{ type: "text", value: opening }];
    if (multiline) {
      localEvents.push({ type: "text", value: "\n" });
    }
    values.forEach((value, index) => {
      if (multiline) {
        localEvents.push({
          type: "text",
          value: indentation.repeat(depth + 1),
        });
      }
      if (node.type === "object") {
        localEvents.push({
          type: "text",
          value: `${JSON.stringify(value.key)}${multiline ? ": " : ":"}`,
        });
      }
      localEvents.push({
        depth: depth + 1,
        node: node.type === "array" ? value : value.value,
        type: "node",
      });
      if (index < values.length - 1) {
        localEvents.push({ type: "text", value: "," });
      }
      if (multiline) {
        localEvents.push({ type: "text", value: "\n" });
      }
    });
    if (multiline) {
      localEvents.push({ type: "text", value: indentation.repeat(depth) });
    }
    localEvents.push({ type: "text", value: closing });

    for (let index = localEvents.length - 1; index >= 0; index -= 1) {
      events.push(localEvents[index]);
    }
  }

  return chunks.join("");
}

function resolveEol(contents, setting) {
  if (setting) {
    return { cr: "\r", crlf: "\r\n", lf: "\n" }[setting];
  }
  return contents.match(/\r\n|\r|\n/u)?.[0] ?? "\n";
}

export function formatParsedJson(
  parsed,
  contents,
  {
    arrays = false,
    filePath = "",
    indentationCount = 2,
    lineEnding,
    pack = false,
    tabs = false,
  } = {},
) {
  if (
    !Number.isInteger(indentationCount) ||
    indentationCount < 0 ||
    indentationCount > 10
  ) {
    throw new RangeError(
      "json-sort-cli/formatJson(): [THROW_ID_01] indentationCount must be an integer from 0 to 10",
    );
  }
  if (lineEnding !== undefined && !["cr", "crlf", "lf"].includes(lineEnding)) {
    throw new TypeError(
      'json-sort-cli/formatJson(): [THROW_ID_02] lineEnding must be "cr", "crlf" or "lf"',
    );
  }

  sortTree(parsed, {
    arrays,
    packageJson: !pack && filePath.split(/[\\/]/u).at(-1) === "package.json",
  });
  const indentation = tabs
    ? "\t".repeat(indentationCount)
    : " ".repeat(indentationCount);
  const eol = resolveEol(contents, lineEnding);
  const output = `${serialize(parsed, indentation).replaceAll("\n", eol)}${eol}`;
  return {
    changed: output !== contents,
    output,
  };
}

export function formatJson(contents, options = {}) {
  const decoded = decodeJson(contents);
  return formatParsedJson(parseJson(decoded), decoded, options);
}
