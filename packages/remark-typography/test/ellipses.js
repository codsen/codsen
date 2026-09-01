import { ellipsis, rawNbsp, rightSingleQuote } from "codsen-utils";
import { remark } from "remark";
import { test } from "uvu";
import { equal } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

async function process(source) {
  return (await remark().use(fixTypography).process(source)).toString().trim();
}

test("01 - whole-node and leading triples", async () => {
  equal(await process("..."), ellipsis, "01.01");
  equal(await process("...start"), `${ellipsis}start`, "01.02");
});

test("02 - trailing and interior triples", async () => {
  equal(await process("end..."), `end${ellipsis}`, "02.01");
  equal(await process("a...b"), `a${ellipsis}b`, "02.02");
});

test("03 - every disjoint exact triple is converted", async () => {
  equal(
    await process("...a...b..."),
    `${ellipsis}a${ellipsis}b${ellipsis}`,
    "03.01",
  );
});

test("04 - four-or-more-dot runs remain unchanged", async () => {
  const source = ".... ..... ..............";
  equal(await process(source), source, "04.01");
});

test("05 - formatted boundaries do not hide an ellipsis", async () => {
  equal(await process("Wait *what*..."), `Wait *what*${ellipsis}`, "05.01");
});

test("06 - astral and combining neighbours remain intact", async () => {
  equal(
    await process("😀...e\u0301..."),
    `😀${ellipsis}e\u0301${ellipsis}`,
    "06.01",
  );
});

test("07 - punctuation phases retain their semantic order", async () => {
  equal(
    await process("Yes that's true but..."),
    `Yes that${rightSingleQuote}s true${rawNbsp}but${ellipsis}`,
    "07.01",
  );
});

test.run();
