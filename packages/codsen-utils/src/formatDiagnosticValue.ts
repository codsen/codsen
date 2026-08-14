const MAXIMUM_OUTPUT_LENGTH = 2000;
const MAXIMUM_DEPTH = 5;
const MAXIMUM_ENTRIES = 50;
const TRUNCATION_MARK = "\u2026";

type Writer = {
  append: (value: string) => boolean;
  result: () => string;
  stopped: () => boolean;
};

function createWriter(): Writer {
  const chunks: string[] = [];
  let length = 0;
  let truncated = false;

  return {
    append(value: string): boolean {
      if (truncated) {
        return false;
      }

      // Keep one UTF-16 code unit available for the truncation marker. Values
      // are appended in small atoms so an escape sequence is never cut apart.
      if (length + value.length > MAXIMUM_OUTPUT_LENGTH - 1) {
        chunks.push(TRUNCATION_MARK);
        length += TRUNCATION_MARK.length;
        truncated = true;
        return false;
      }

      chunks.push(value);
      length += value.length;
      return true;
    },
    result(): string {
      return chunks.join("");
    },
    stopped(): boolean {
      return truncated;
    },
  };
}

function hexEscape(code: number): string {
  return `\\u${code.toString(16).padStart(4, "0")}`;
}

function appendQuoted(writer: Writer, value: string): void {
  if (!writer.append('"')) {
    return;
  }

  for (let i = 0; i < value.length && !writer.stopped(); i += 1) {
    const code = value.charCodeAt(i);
    if (code === 34) {
      writer.append('\\"');
    } else if (code === 92) {
      writer.append("\\\\");
    } else if (code === 8) {
      writer.append("\\b");
    } else if (code === 9) {
      writer.append("\\t");
    } else if (code === 10) {
      writer.append("\\n");
    } else if (code === 12) {
      writer.append("\\f");
    } else if (code === 13) {
      writer.append("\\r");
    } else if (
      code < 32 ||
      code === 0x2028 ||
      code === 0x2029 ||
      (code >= 0xd800 && code <= 0xdfff)
    ) {
      writer.append(hexEscape(code));
    } else {
      writer.append(value[i]);
    }
  }

  writer.append('"');
}

function accessorLabel(
  descriptor: PropertyDescriptor,
): "[Accessor]" | "[Getter]" | "[Setter]" | "[Getter/Setter]" {
  if (descriptor.get && descriptor.set) {
    return "[Getter/Setter]";
  }
  if (descriptor.get) {
    return "[Getter]";
  }
  return descriptor.set ? "[Setter]" : "[Accessor]";
}

function appendSymbol(writer: Writer, value: symbol): void {
  writer.append("Symbol(");
  // Symbol.prototype.description postdates the package's Chrome 58 IIFE
  // target. String(symbol) is supported there; escape the extracted text
  // before including it in a diagnostic.
  const rendered = String(value);
  if (rendered.length > 8) {
    appendQuoted(writer, rendered.slice(7, -1));
  }
  writer.append(")");
}

function appendPropertyKey(writer: Writer, key: PropertyKey): void {
  if (typeof key === "symbol") {
    appendSymbol(writer, key);
  } else {
    appendQuoted(writer, String(key));
  }
}

/**
 * Safely formats untrusted input for an error message.
 *
 * The result is JSON-like rather than JSON: values which JSON cannot express
 * use explicit diagnostic tokens. Object accessors are described without
 * running them, circular references are marked, and reflection failures are
 * contained. Output is capped at 2,000 UTF-16 code units, five object levels,
 * and 50 array items or object properties across the whole value.
 */
export function formatDiagnosticValue(
  value: unknown,
  indentation: 0 | 4 = 0,
): string {
  const writer = createWriter();
  const indentationWidth = indentation === 4 ? 4 : 0;
  const ancestors = new WeakSet<object>();
  let entries = 0;

  function appendIndent(depth: number): void {
    if (indentationWidth) {
      writer.append(" ".repeat(depth * indentationWidth));
    }
  }

  function appendEntryPrefix(hasEntries: boolean, depth: number): void {
    if (hasEntries) {
      writer.append(",");
    }
    if (indentationWidth) {
      writer.append("\n");
      appendIndent(depth + 1);
    }
  }

  function appendCollectionEnd(
    closingCharacter: "]" | "}",
    hasEntries: boolean,
    depth: number,
  ): void {
    if (indentationWidth && hasEntries) {
      writer.append("\n");
      appendIndent(depth);
    }
    writer.append(closingCharacter);
  }

  function appendDescriptor(
    descriptor: PropertyDescriptor,
    depth: number,
  ): void {
    // Chrome 58 predates Object.hasOwn(). Calling the prototype intrinsic is
    // safe here because descriptor comes from Reflect.getOwnPropertyDescriptor().
    // biome-ignore lint/suspicious/noPrototypeBuiltins: published IIFE compatibility
    if (Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      appendValue(descriptor.value, depth);
    } else {
      writer.append(accessorLabel(descriptor));
    }
  }

  function appendArray(input: unknown[], depth: number): void {
    let lengthDescriptor: PropertyDescriptor | undefined;
    try {
      lengthDescriptor = Reflect.getOwnPropertyDescriptor(input, "length");
    } catch {
      writer.append("[Uninspectable]");
      return;
    }

    const length = lengthDescriptor?.value;
    if (!Number.isSafeInteger(length) || length < 0) {
      writer.append("[Uninspectable]");
      return;
    }

    writer.append("[");
    let hasEntries = false;
    for (let i = 0; i < length && !writer.stopped(); i += 1) {
      appendEntryPrefix(hasEntries, depth);
      hasEntries = true;

      if (entries >= MAXIMUM_ENTRIES) {
        writer.append("[MaxEntries]");
        break;
      }
      entries += 1;

      let descriptor: PropertyDescriptor | undefined;
      try {
        descriptor = Reflect.getOwnPropertyDescriptor(input, String(i));
      } catch {
        writer.append("[Uninspectable]");
        continue;
      }

      if (descriptor?.enumerable) {
        appendDescriptor(descriptor, depth + 1);
      } else {
        writer.append("[Empty]");
      }
    }
    appendCollectionEnd("]", hasEntries, depth);
  }

  function appendRecord(input: object, depth: number): void {
    let keys: PropertyKey[];
    try {
      keys = Reflect.ownKeys(input);
    } catch {
      writer.append("[Uninspectable]");
      return;
    }

    writer.append("{");
    let hasEntries = false;
    for (const key of keys) {
      if (writer.stopped()) {
        break;
      }

      // Count every reflected key, including a non-enumerable one. A hostile
      // proxy must not be able to trigger an unbounded number of descriptor
      // traps merely by reporting a very wide, non-enumerable object.
      if (entries >= MAXIMUM_ENTRIES) {
        appendEntryPrefix(hasEntries, depth);
        hasEntries = true;
        appendQuoted(writer, TRUNCATION_MARK);
        writer.append(indentationWidth ? ": " : ":");
        writer.append("[MaxEntries]");
        break;
      }
      entries += 1;

      let descriptor: PropertyDescriptor | undefined;
      try {
        descriptor = Reflect.getOwnPropertyDescriptor(input, key);
      } catch {
        appendEntryPrefix(hasEntries, depth);
        hasEntries = true;
        appendPropertyKey(writer, key);
        writer.append(indentationWidth ? ": " : ":");
        writer.append("[Uninspectable]");
        continue;
      }

      if (!descriptor?.enumerable) {
        continue;
      }

      appendEntryPrefix(hasEntries, depth);
      hasEntries = true;
      appendPropertyKey(writer, key);
      writer.append(indentationWidth ? ": " : ":");
      appendDescriptor(descriptor, depth + 1);
    }
    appendCollectionEnd("}", hasEntries, depth);
  }

  function appendObject(input: object, depth: number): void {
    if (ancestors.has(input)) {
      writer.append("[Circular]");
      return;
    }
    if (depth >= MAXIMUM_DEPTH) {
      writer.append("[MaxDepth]");
      return;
    }

    let inputIsArray: boolean;
    try {
      inputIsArray = Array.isArray(input);
    } catch {
      writer.append("[Uninspectable]");
      return;
    }

    ancestors.add(input);
    try {
      if (inputIsArray) {
        appendArray(input as unknown[], depth);
      } else {
        appendRecord(input, depth);
      }
    } finally {
      ancestors.delete(input);
    }
  }

  function appendValue(input: unknown, depth: number): void {
    if (input === null) {
      writer.append("null");
    } else if (typeof input === "string") {
      appendQuoted(writer, input);
    } else if (typeof input === "number") {
      writer.append(Object.is(input, -0) ? "-0" : String(input));
    } else if (typeof input === "boolean") {
      writer.append(input ? "true" : "false");
    } else if (typeof input === "undefined") {
      writer.append("undefined");
    } else if (typeof input === "bigint") {
      writer.append(`${input}n`);
    } else if (typeof input === "symbol") {
      appendSymbol(writer, input);
    } else if (typeof input === "function") {
      writer.append("[Function]");
    } else {
      appendObject(input, depth);
    }
  }

  try {
    appendValue(value, 0);
    return writer.result();
  } catch {
    return "[Uninspectable]";
  }
}
