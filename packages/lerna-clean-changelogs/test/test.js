import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import crypto2 from "crypto";
import { createRequire } from "module";

import { cleanChangelogs as c } from "../dist/lerna-clean-changelogs.esm.js";

const sha256 = (x) =>
  crypto2.createHash("sha256").update(x, "utf8").digest("hex");

const require2 = createRequire(import.meta.url);
const readHashes = require2("./fixture_hashes.json");

const hashes = { ...readHashes };

// Normally, hashes file would be filled, so we don't touch it.
// If we decide to amend hashes, we wipe the hashes file, then
// it is ingested empty, and this flag marks that we need to
// write the fresh hash values.
const hashesPresent = !!Object.keys(hashes).length;
const fixtures = path.resolve("test/fixtures");

function compare(name) {
  let changelog = readFileSync(path.join(fixtures, `${name}.md`), "utf8");
  let noExtrasFileName = `${name}.expected.md`;
  let withExtrasFileName = `${name}.extras.md`;

  let noExtras = readFileSync(path.join(fixtures, noExtrasFileName), "utf8");
  let withExtras = readFileSync(
    path.join(fixtures, withExtrasFileName),
    "utf8",
  );
  if (hashesPresent) {
    // check, are the fixtures intact
    equal(
      sha256(noExtras),
      hashes[noExtrasFileName],
      `${`\u001b[${31}m${`the fixture ${noExtrasFileName} was mangled!!!`}\u001b[${39}m`}`,
    );
    equal(
      sha256(withExtras),
      hashes[withExtrasFileName],
      `${`\u001b[${31}m${`the fixture ${withExtrasFileName} was mangled!!!`}\u001b[${39}m`}`,
    );
  } else {
    // write the hash into dict
    hashes[noExtrasFileName] = sha256(noExtras);
    hashes[withExtrasFileName] = sha256(withExtras);
  }
  // LF
  equal(
    c(changelog.replace(/\r?\n/g, "\n")).res,
    noExtras.replace(/\r?\n/g, "\n"),
    `01 LF - no extras (default setting), ${`\u001b[${33}m${name}\u001b[${39}m`}`,
  );
  equal(
    c(changelog.replace(/\r?\n/g, "\n"), { extras: false }).res,
    noExtras.replace(/\r?\n/g, "\n"),
    `02 LF - hardcoded default, no extras, ${`\u001b[${33}m${name}\u001b[${39}m`}`,
  );
  equal(
    c(changelog.replace(/\r?\n/g, "\n"), { extras: true }).res,
    withExtras.replace(/\r?\n/g, "\n"),
    `03 LF - optional with extras, ${`\u001b[${33}m${name}\u001b[${39}m`}`,
  );
  // CRLF
  equal(
    c(changelog.replace(/\r?\n/g, "\r\n")).res,
    noExtras.replace(/\r?\n/g, "\r\n"),
    `04 CRLF - no extras (default setting), ${`\u001b[${33}m${name}\u001b[${39}m`}`,
  );
  equal(
    c(changelog.replace(/\r?\n/g, "\r\n"), { extras: false }).res,
    noExtras.replace(/\r?\n/g, "\r\n"),
    `05 CRLF - hardcoded default, no extras, ${`\u001b[${33}m${name}\u001b[${39}m`}`,
  );
  equal(
    c(changelog.replace(/\r?\n/g, "\r\n"), { extras: true }).res,
    withExtras.replace(/\r?\n/g, "\r\n"),
    `06 CRLF - optional with extras, ${`\u001b[${33}m${name}\u001b[${39}m`}`,
  );
}

test("01 - deletes bump-only entries together with their headings", () => {
  compare("01_deletes_bump-only");
});

test("02 - turns h1 headings within body into h2", () => {
  compare("02_remove_h1_tags_in_body");
});

test("03 - cleans whitespace and replaces bullet dashes with asterisks", () => {
  compare("03_whitespace");
});

test("04 - removes WIP entries", () => {
  compare("04_wip");
});

test("05 - fixes plural in sourcehut links", () => {
  compare("05_sourcehut");
});

if (!hashesPresent) {
  writeFileSync(
    path.resolve("test/fixture_hashes.json"),
    JSON.stringify(hashes, null, 4),
  );
  console.log("wrote new hashes");
}

test.run();
