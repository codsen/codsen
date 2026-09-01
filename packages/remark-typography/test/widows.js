import { rawNbsp } from "codsen-utils";
import { remark } from "remark";
import { unified } from "unified";
import { test } from "uvu";
import { equal, is } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

async function process(source) {
  return (await remark().use(fixTypography).process(source)).toString().trim();
}

test("01 - final emphasis participates in one block-level widow pass", async () => {
  equal(
    await process("This is a long sentence *ending*"),
    `This is a long sentence${rawNbsp}*ending*`,
    "01.01",
  );
});

test("02 - several inline spans produce only the final measure", async () => {
  const result = await process(
    "alpha beta gamma delta *epsilon zeta eta theta* iota kappa lambda mu",
  );
  equal(
    result,
    `alpha beta gamma delta *epsilon zeta eta theta* iota kappa lambda${rawNbsp}mu`,
    "02.01",
  );
  equal(result.split(rawNbsp).length - 1, 1, "02.02");
});

test("03 - short blocks remain unchanged", async () => {
  equal(await process("short *block*"), "short *block*", "03.01");
});

test("04 - emphasis, strong, links, and code can be the final word", async () => {
  equal(
    await process("one two three four *five*"),
    `one two three four${rawNbsp}*five*`,
    "04.01",
  );
  equal(
    await process("one two three four **five**"),
    `one two three four${rawNbsp}**five**`,
    "04.02",
  );
  equal(
    await process("one two three four [five](https://example.com)"),
    `one two three four${rawNbsp}[five](https://example.com)`,
    "04.03",
  );
  equal(
    await process("one two three four `five`"),
    `one two three four${rawNbsp}\`five\``,
    "04.04",
  );
});

test("05 - each supported block is handled independently", () => {
  const headingText = { type: "text", value: "one two three four five" };
  const paragraphText = { type: "text", value: "six seven eight nine ten" };
  const quotedText = { type: "text", value: "red blue green black white" };
  const listedText = { type: "text", value: "alpha beta gamma delta epsilon" };
  const cellText = {
    type: "text",
    value: "spring summer autumn winter season",
  };
  const tree = {
    type: "root",
    children: [
      { type: "heading", depth: 2, children: [headingText] },
      { type: "paragraph", children: [paragraphText] },
      {
        type: "blockquote",
        children: [{ type: "paragraph", children: [quotedText] }],
      },
      {
        type: "list",
        children: [
          {
            type: "listItem",
            children: [{ type: "paragraph", children: [listedText] }],
          },
        ],
      },
      { type: "tableCell", children: [cellText] },
    ],
  };

  unified().use(fixTypography).runSync(tree);
  equal(headingText.value, `one two three four${rawNbsp}five`, "05.01");
  equal(paragraphText.value, `six seven eight nine${rawNbsp}ten`, "05.02");
  equal(quotedText.value, `red blue green black${rawNbsp}white`, "05.03");
  equal(listedText.value, `alpha beta gamma delta${rawNbsp}epsilon`, "05.04");
  equal(cellText.value, `spring summer autumn winter${rawNbsp}season`, "05.05");
});

test("06 - a hard break remains immutable and bounds its line", () => {
  const first = { type: "text", value: "alpha beta gamma delta " };
  const hardBreak = { type: "break" };
  const second = { type: "text", value: "epsilon zeta" };
  const tree = {
    type: "root",
    children: [{ type: "paragraph", children: [first, hardBreak, second] }],
  };

  unified().use(fixTypography).runSync(tree);
  equal(first.value, `alpha beta gamma${rawNbsp}delta `, "06.01");
  is(tree.children[0].children[1], hardBreak, "06.02");
  equal(second.value, "epsilon zeta", "06.03");
});

test("07 - multi-token inline code is one immutable final unit", async () => {
  equal(
    await process("one two three four `five six`"),
    `one two three four${rawNbsp}\`five six\``,
    "07.01",
  );
  equal(
    await process("one two three four `3 x 4`"),
    `one two three four${rawNbsp}\`3 x 4\``,
    "07.02",
  );
});

test("08 - an inline HTML break bounds widow handling", async () => {
  equal(
    await process("alpha beta gamma delta<br>epsilon zeta"),
    `alpha beta gamma${rawNbsp}delta<br>epsilon zeta`,
    "08.01",
  );
  equal(
    await process('alpha beta gamma delta<br class="line" />epsilon zeta'),
    `alpha beta gamma${rawNbsp}delta<br class="line" />epsilon zeta`,
    "08.02",
  );
});

test.run();
