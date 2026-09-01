import { readFile, writeFile } from "node:fs/promises";
import { decodeJson } from "./json-formatter.js";

export async function readJson(file, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  if (
    options?.encoding !== undefined &&
    !["utf8", "utf-8"].includes(String(options.encoding).toLowerCase())
  ) {
    throw new TypeError(
      "json-sort-cli/readJson(): [THROW_ID_01] options.encoding must be utf8 or utf-8",
    );
  }

  const shouldThrow = "throws" in options ? options.throws : true;
  const bytes = await readFile(file);

  try {
    const content = decodeJson(bytes);
    return JSON.parse(content.replace(/^\uFEFF/, ""), options.reviver);
  } catch (error) {
    if (!shouldThrow) {
      return null;
    }

    if (error instanceof Error) {
      const message = `${file}: ${error.message}`;
      try {
        error.message = message;
        throw error;
      } catch (assignmentError) {
        if (assignmentError === error) {
          throw error;
        }
        throw new Error(message, { cause: error });
      }
    }

    let description;
    try {
      description = String(error);
    } catch {
      description = "Unknown non-Error value";
    }
    throw new Error(`${file}: JSON reviver threw ${description}`, {
      cause: error,
    });
  }
}

export async function writeJson(file, value, options = {}) {
  const { EOL = "\n", finalEOL = true, replacer = null, spaces } = options;
  const stringified = JSON.stringify(value, replacer, spaces);

  if (stringified === undefined) {
    throw new TypeError(
      `json-sort-cli/writeJson(): [THROW_ID_01] Converting ${typeof value} value to JSON is not supported`,
    );
  }

  await writeFile(
    file,
    stringified.replaceAll("\n", EOL) + (finalEOL ? EOL : ""),
    options,
  );
}
