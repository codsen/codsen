import { rawMDash, rawNbsp, rawNDash } from "codsen-utils";
import { remark } from "remark";
import { test } from "uvu";
import { equal } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

async function process(source) {
  return (await remark().use(fixTypography).process(source)).toString().trim();
}

test("01 - spaced em dash crosses an emphasis boundary", async () => {
  equal(
    await process("word *-* word"),
    `word${rawNbsp}*${rawMDash}* word`,
    "01.01",
  );
});

test("02 - numeric ranges use en dashes", async () => {
  equal(
    await process("1-2 and 3 - 4"),
    `1${rawNDash}2 and 3${rawNbsp}${rawNDash}${rawNbsp}4`,
    "02.01",
  );
});

test("03 - lexical hyphens stay unchanged", async () => {
  equal(await process("A well-being check."), "A well-being check.", "03.01");
});

test("04 - an inline-code dash supplies context but stays immutable", async () => {
  equal(await process("word `-` word"), `word${rawNbsp}\`-\` word`, "04.01");
});

test("05 - multiple cross-node dashes are all converted", async () => {
  equal(
    await process("a *-* b and c **-** d"),
    `a${rawNbsp}*${rawMDash}* b and c${rawNbsp}**${rawMDash}**${rawNbsp}d`,
    "05.01",
  );
});

test.run();
