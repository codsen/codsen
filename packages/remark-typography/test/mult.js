import { multiplicationSign, rawMDash, rawNbsp } from "codsen-utils";
import { remark } from "remark";
import { unified } from "unified";
import { test } from "uvu";
import { equal } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

async function process(source) {
  return (await remark().use(fixTypography).process(source)).toString().trim();
}

function processText(value) {
  const text = { type: "text", value };
  const tree = {
    type: "root",
    children: [{ type: "paragraph", children: [text] }],
  };
  unified().use(fixTypography).runSync(tree);
  return text.value;
}

test("01 - integer operands", async () => {
  equal(await process("3 x 4"), `3 ${multiplicationSign} 4`, "01.01");
});

test("02 - signs, decimals, and units", async () => {
  equal(
    await process("-3.5kg x +4m"),
    `-3.5kg ${multiplicationSign} +4m`,
    "02.01",
  );
  equal(await process(".5% x 2µm"), `.5% ${multiplicationSign} 2µm`, "02.02");
  equal(await process("3 x 4."), `3 ${multiplicationSign} 4.`, "02.03");
});

test("03 - chained dimensions", async () => {
  equal(
    await process("3 x 4 x 5"),
    `3 ${multiplicationSign} 4 ${multiplicationSign}${rawNbsp}5`,
    "03.01",
  );
});

test("04 - formatted operands and operator", async () => {
  equal(
    await process("*3* x **4**"),
    `*3* ${multiplicationSign} **4**`,
    "04.01",
  );
  equal(await process("3 *x* 4"), `3 *${multiplicationSign}* 4`, "04.02");
});

test("05 - ambiguous prose remains unchanged", async () => {
  equal(await process("variable x 2"), "variable x 2", "05.01");
  equal(await process("2 x variable"), "2 x variable", "05.02");
});

test("06 - Unicode digits are rejected symmetrically", async () => {
  equal(await process("٣ x 4"), "٣ x 4", "06.01");
  equal(await process("3 x ٤"), "3 x ٤", "06.02");
});

test("07 - quantity token boundaries are rejected symmetrically", () => {
  equal(processText("_3 x 4"), "_3 x 4", "07.01");
  equal(processText("3 x 4_"), "3 x 4_", "07.02");
  equal(processText("size3 x 4"), "size3 x 4", "07.03");
  equal(processText("3 x 4size2"), "3 x 4size2", "07.04");
  equal(processText("3 x 4m.5"), "3 x 4m.5", "07.05");
  equal(processText("é3 x 4"), "é3 x 4", "07.06");
  equal(processText("3 x 4é"), "3 x 4é", "07.07");
  equal(processText("漢3 x 4"), "漢3 x 4", "07.08");
  equal(processText("3 x 4漢"), "3 x 4漢", "07.09");
  equal(processText("e\u03013 x 4"), "e\u03013 x 4", "07.10");
  equal(processText("3 x 4e\u0301"), "3 x 4e\u0301", "07.11");
  equal(processText("𝔄3 x 4"), "𝔄3 x 4", "07.12");
  equal(processText("3 x 4𝔄"), "3 x 4𝔄", "07.13");
  equal(
    processText("\uDC003 x 4"),
    `\uDC003 ${multiplicationSign} 4`,
    "07.14",
  );
  equal(processText("a\u200C3 x 4"), "a\u200C3 x 4", "07.15");
  equal(processText("3 x 4\u200Dfoo"), "3 x 4\u200Dfoo", "07.16");
  equal(processText("a·3 x 4"), "a·3 x 4", "07.17");
  equal(processText("3 x 4·a"), "3 x 4·a", "07.18");
  equal(processText("$3 x 4"), "$3 x 4", "07.19");
  equal(processText("€3 x 4"), "€3 x 4", "07.20");
  equal(processText("3 x $4"), "3 x $4", "07.21");
  equal(processText("3 x €4"), "3 x €4", "07.22");
  equal(processText("3 x 4$"), "3 x 4$", "07.23");
  equal(processText("3 x 4€"), "3 x 4€", "07.24");
});

test("08 - horizontal Unicode whitespace is supported", () => {
  equal(
    processText("3  \tx\u2003 4"),
    `3  \t${multiplicationSign}\u2003 4`,
    "08.01",
  );
});

test("09 - line endings never form a multiplication expression", () => {
  equal(processText("3\nx 4"), "3\nx 4", "09.01");
  equal(processText("3 x\r\n4"), "3 x\r\n4", "09.02");
  equal(processText("3\u2028x 4"), "3\u2028x 4", "09.03");
  equal(processText("3 x\u20294"), "3 x\u20294", "09.04");
  equal(processText("3\vx 4"), "3\vx 4", "09.05");
  equal(processText("3 x\f4"), "3 x\f4", "09.06");
  equal(processText("3\u0085x 4"), "3\u0085x 4", "09.07");
});

test("10 - code operators remain immutable", async () => {
  equal(await process("3 `x` 4"), "3 `x` 4", "10.01");
});

test("11 - multiplication precedes dash and widow handling", async () => {
  equal(
    await process("10px x 20px x 30px - 40px"),
    `10px ${multiplicationSign} 20px ${multiplicationSign} 30px${rawNbsp}${rawMDash}${rawNbsp}40px`,
    "11.01",
  );
});

test.run();
