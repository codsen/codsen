import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export function readSnapshot() {
  const source = new URL("../upstream/", import.meta.url);
  const provenance = JSON.parse(
    readFileSync(new URL("provenance.json", source), "utf8"),
  );
  const snapshot = readFileSync(new URL("entities.json", source), "utf8");
  const license = readFileSync(new URL("WHATWG-LICENSE", source), "utf8");
  for (const [contents, expected] of [
    [snapshot, provenance.sha256],
    [license, provenance.licenseSha256],
  ]) {
    if (createHash("sha256").update(contents).digest("hex") !== expected) {
      throw new Error("Pinned WHATWG source digest mismatch");
    }
  }
  const entities = JSON.parse(snapshot);
  const entries = Object.entries(entities);
  const canonical = entries.filter(([name]) => name.endsWith(";"));
  const legacy = entries.filter(([name]) => !name.endsWith(";"));
  if (
    entries.length !== provenance.entries ||
    canonical.length !== provenance.canonicalNames ||
    legacy.length !== provenance.legacyNames
  ) {
    throw new Error("Pinned WHATWG entity counts do not match provenance");
  }
  for (const [name, row] of entries) {
    if (
      !/^&[A-Za-z][A-Za-z0-9]*;?$/.test(name) ||
      Object.keys(row).sort().join(",") !== "characters,codepoints" ||
      typeof row.characters !== "string" ||
      !Array.isArray(row.codepoints) ||
      !row.codepoints.length ||
      row.codepoints.length > 2 ||
      row.codepoints.some(
        (point) =>
          !Number.isInteger(point) ||
          point < 0 ||
          point > 0x10ffff ||
          (point >= 0xd800 && point <= 0xdfff),
      ) ||
      String.fromCodePoint(...row.codepoints) !== row.characters ||
      (!name.endsWith(";") &&
        entities[`${name};`]?.characters !== row.characters)
    ) {
      throw new Error(`Invalid WHATWG entity row: ${name}`);
    }
  }
  const notice = `/*!\n * Generated from WHATWG HTML entities.json (${provenance.retrieved}).\n * Source: ${provenance.source}\n * SHA-256: ${provenance.sha256}\n * Copyright © WHATWG (Apple, Google, Mozilla, Microsoft).\n * ${license
    .slice(license.lastIndexOf("BSD 3-Clause License"))
    .replace(/\n- - - -\s*$/, "")
    .trim()
    .replaceAll("\n", "\n * ")}\n */\n`;
  return { entities, canonical, legacy, provenance, notice };
}
