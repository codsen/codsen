import {
  leftDoubleQuote,
  rawNbsp,
  rightDoubleQuote,
  rightSingleQuote,
} from "codsen-utils";
import { remark } from "remark";
import { unified } from "unified";
import { test } from "uvu";
import { equal, is } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

async function process(source) {
  return (await remark().use(fixTypography).process(source)).toString().trim();
}

test("01 - code and link boundary possessives", async () => {
  equal(
    await process("The `deno`'s [project](https://example.com)'s plan."),
    `The \`deno\`${rightSingleQuote}s [project](https://example.com)${rightSingleQuote}s${rawNbsp}plan.`,
    "01.01",
  );
});

test("02 - emphasis and strong boundary possessives", async () => {
  equal(
    await process("The **deno**'s and *editors*' plan."),
    `The **deno**${rightSingleQuote}s and *editors*${rightSingleQuote}${rawNbsp}plan.`,
    "02.01",
  );
});

test("03 - paired quotes cross phrasing boundaries", async () => {
  equal(
    await process("\"hello *world*\" and 'good **night**'."),
    `${leftDoubleQuote}hello *world*${rightDoubleQuote} and ‘good${rawNbsp}**night**${rightSingleQuote}.`,
    "03.01",
  );
});

test("04 - contractions, plurals, and normalized apostrophes", async () => {
  equal(
    await process("Dogs' owners aren't ready. Deno’s is."),
    `Dogs${rightSingleQuote} owners aren${rightSingleQuote}t ready. Deno${rightSingleQuote}s${rawNbsp}is.`,
    "04.01",
  );
});

test("05 - inline and fenced code remain byte-for-byte unchanged", async () => {
  equal(
    await process(
      "Use `\"x\" - y... 3 x 4` now.\n\n```js\nconst x = 'a - b...';\n```",
    ),
    `Use \`"x" - y... 3 x 4\`${rawNbsp}now.\n\n\`\`\`js\nconst x = 'a - b...';\n\`\`\``,
    "05.01",
  );
});

test("06 - processing is idempotent", async () => {
  const once = await process('The **deno**\'s "result"... is very good.');
  equal(await process(once), once, "06.01");
});

test("07 - punctuation-ending code supplies word-like apostrophe context", async () => {
  equal(
    await process("The `<br />`'s output."),
    `The \`<br />\`${rightSingleQuote}s${rawNbsp}output.`,
    "07.01",
  );
  equal(
    await process("The `<br />`s' attributes."),
    `The \`<br />\`s${rightSingleQuote}${rawNbsp}attributes.`,
    "07.02",
  );
  equal(
    await process("The `<br />`’s output."),
    `The \`<br />\`${rightSingleQuote}s${rawNbsp}output.`,
    "07.03",
  );
  equal(
    await process("The `<br />`s’ attributes."),
    `The \`<br />\`s${rightSingleQuote}${rawNbsp}attributes.`,
    "07.04",
  );
  equal(
    await process("The `<br />`' owners."),
    `The \`<br />\`${rightSingleQuote}${rawNbsp}owners.`,
    "07.05",
  );
});

test("08 - UTF-16 code context preserves code bytes and node identity", () => {
  const code = { type: "inlineCode", value: "😀<br />" };
  const suffix = { type: "text", value: "'s" };
  const paragraph = { type: "paragraph", children: [code, suffix] };
  const tree = { type: "root", children: [paragraph] };

  unified().use(fixTypography).runSync(tree);
  is(tree.children[0], paragraph, "08.01");
  is(paragraph.children[0], code, "08.02");
  equal(code.value, "😀<br />", "08.03");
  is(paragraph.children[1], suffix, "08.04");
  equal(suffix.value, `${rightSingleQuote}s`, "08.05");
});

test.run();
