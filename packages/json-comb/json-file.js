import { readFile, writeFile } from "node:fs/promises";

async function readJson(file) {
  const contents = (await readFile(file, "utf8")).replace(/^\uFEFF/, "");

  try {
    return JSON.parse(contents);
  } catch (error) {
    error.message = `${file}: ${error.message}`;
    throw error;
  }
}

async function writeJson(
  file,
  value,
  { EOL = "\n", finalEOL = true, replacer = null, spaces } = {},
) {
  const stringified = JSON.stringify(value, replacer, spaces);

  if (stringified === undefined) {
    throw new TypeError(
      `json-comb/writeJson(): [THROW_ID_01] Converting ${typeof value} value to JSON is not supported`,
    );
  }

  await writeFile(
    file,
    stringified.replace(/\n/g, EOL) + (finalEOL ? EOL : ""),
  );
}

export { readJson, writeJson };
