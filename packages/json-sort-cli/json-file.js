import { readFile, writeFile } from "node:fs/promises";

export async function readJson(file, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }

  const shouldThrow = "throws" in options ? options.throws : true;
  let content = await readFile(file, options);

  if (Buffer.isBuffer(content)) {
    content = content.toString("utf8");
  }

  try {
    return JSON.parse(content.replace(/^\uFEFF/, ""), options.reviver);
  } catch (error) {
    if (!shouldThrow) {
      return null;
    }

    error.message = `${file}: ${error.message}`;
    throw error;
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
