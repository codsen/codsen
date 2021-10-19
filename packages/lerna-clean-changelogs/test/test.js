import { readFileSync, writeFileSync } from "fs";
import path from "path";
import tap from "tap";
import { cleanChangelogs as c } from "../dist/lerna-clean-changelogs.esm.js";
import crypto from "crypto";
const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const readHashes = require("./fixture_hashes.json");
const hashes = { ...readHashes };

// Normally, hashes file would be filled, so we don't touch it.
// If we decide to amend hashes, we wipe the hashes file, then
// it is ingested empty, and this flag marks that we need to
// write the fresh hash values.
const hashesPresent = !!Object.keys(hashes).length;
const fixtures = path.resolve("test/fixtures");

function compare(t, name) {
  const changelog = readFileSync(path.join(fixtures, `${name}.md`), "utf8");
  const noExtrasFileName = `${name}.expected.md`;
  const withExtrasFileName = `${name}.extras.md`;

  const noExtras = readFileSync(path.join(fixtures, noExtrasFileName), "utf8");
  const withExtras = readFileSync(
    path.join(fixtures, withExtrasFileName),
    "utf8"
  );
  if (hashesPresent) {
    // check, are the fixtures intact
    t.equal(
      sha256(noExtras),
      hashes[noExtrasFileName],
      `${`\u001b[${31}m${`the fixture ${noExtrasFileName} was mangled!!!`}\u001b[${39}m`}`
    );
    t.equal(
      sha256(withExtras),
      hashes[withExtrasFileName],
      `${`\u001b[${31}m${`the fixture ${withExtrasFileName} was mangled!!!`}\u001b[${39}m`}`
    );
  } else {
    // write the hash into dict
    hashes[noExtrasFileName] = sha256(noExtras);
    hashes[withExtrasFileName] = sha256(withExtras);
  }
  t.equal(
    c(changelog).res,
    noExtras,
    `no extras, ${`\u001b[${33}m${name}\u001b[${39}m`}`
  );
  t.equal(
    c(changelog, true).res,
    withExtras,
    `with extras, ${`\u001b[${33}m${name}\u001b[${39}m`}`
  );
}

tap.test(`01 - deletes bump-only entries together with their headings`, (t) => {
  compare(t, "01_deletes_bump-only");
  t.end();
});

tap.test(`02 - turns h1 headings within body into h2`, (t) => {
  compare(t, "02_remove_h1_tags_in_body");
  t.end();
});

tap.test(
  `03 - cleans whitespace and replaces bullet dashes with asterisks`,
  (t) => {
    compare(t, "03_whitespace");
    t.end();
  }
);

tap.test(`04 - removes WIP entries`, (t) => {
  compare(t, "04_wip");
  t.end();
});

tap.test(`05 - fixes plural in sourcehut links`, (t) => {
  compare(t, "05_sourcehut");
  t.end();
});

if (!hashesPresent) {
  writeFileSync(
    path.resolve(`test/fixture_hashes.json`),
    JSON.stringify(hashes, null, 4)
  );
  console.log(`wrote new hashes`);
}
