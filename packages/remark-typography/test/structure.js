import {
  ellipsis,
  multiplicationSign,
  rawNbsp,
  rightSingleQuote,
} from "codsen-utils";
import { unified } from "unified";
import { VFile } from "vfile";
import { test } from "uvu";
import { equal, is } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

test("01 - nodes, positions, code, URLs, titles, and alt text are preserved", () => {
  const rootPosition = {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 3, column: 10, offset: 80 },
  };
  const textPosition = {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 5, offset: 4 },
  };
  const firstText = { type: "text", value: "The ", position: textPosition };
  const emphasisText = { type: "text", value: "deno" };
  const emphasis = { type: "emphasis", children: [emphasisText] };
  const possessive = { type: "text", value: "'s " };
  const linkText = { type: "text", value: "project" };
  const link = {
    type: "link",
    url: "https://example.com/a-b?dots=...&size=3x4",
    title: "straight ' title - ...",
    children: [linkText],
  };
  const image = {
    type: "image",
    url: "https://example.com/image-3x4.png",
    title: "image ' title",
    alt: "image - alt...",
  };
  const inlineCode = { type: "inlineCode", value: "'x' - ... 3 x 4" };
  const finalText = { type: "text", value: " says... 3 x 4" };
  const paragraph = {
    type: "paragraph",
    children: [
      firstText,
      emphasis,
      possessive,
      link,
      { type: "text", value: " " },
      image,
      { type: "text", value: " " },
      inlineCode,
      finalText,
    ],
  };
  const code = {
    type: "code",
    lang: "js",
    meta: "title='a-b'",
    value: "const x = 'a - b... 3 x 4';",
  };
  const definition = {
    type: "definition",
    identifier: "ref",
    label: "ref",
    url: "https://example.com/a-b...",
    title: "'title' - 3 x 4",
  };
  const tree = {
    type: "root",
    position: rootPosition,
    children: [paragraph, code, definition],
  };
  const file = new VFile();

  const returned = unified().use(fixTypography).runSync(tree, file);
  is(returned, tree, "01.01");
  is(returned.position, rootPosition, "01.02");
  is(firstText.position, textPosition, "01.03");
  is(paragraph.children[1], emphasis, "01.04");
  is(emphasis.children[0], emphasisText, "01.05");
  is(paragraph.children[3], link, "01.06");
  equal(possessive.value, `${rightSingleQuote}s `, "01.07");
  equal(link.url, "https://example.com/a-b?dots=...&size=3x4", "01.08");
  equal(link.title, "straight ' title - ...", "01.09");
  equal(image.url, "https://example.com/image-3x4.png", "01.10");
  equal(image.title, "image ' title", "01.11");
  equal(image.alt, "image - alt...", "01.12");
  equal(inlineCode.value, "'x' - ... 3 x 4", "01.13");
  equal(code.value, "const x = 'a - b... 3 x 4';", "01.14");
  equal(definition.url, "https://example.com/a-b...", "01.15");
  equal(definition.title, "'title' - 3 x 4", "01.16");
  equal(
    finalText.value,
    ` says${ellipsis} 3 ${multiplicationSign}${rawNbsp}4`,
    "01.17",
  );
});

test("02 - one replacement can span several mutable text nodes", () => {
  const first = { type: "text", value: "a." };
  const middleText = { type: "text", value: "." };
  const emphasis = { type: "emphasis", children: [middleText] };
  const last = { type: "text", value: ".b" };
  const paragraph = {
    type: "paragraph",
    children: [first, emphasis, last],
  };
  const tree = { type: "root", children: [paragraph] };

  unified().use(fixTypography).runSync(tree);
  is(tree.children[0], paragraph, "02.01");
  is(paragraph.children[1], emphasis, "02.02");
  is(emphasis.children[0], middleText, "02.03");
  equal(first.value, `a${ellipsis}`, "02.04");
  equal(middleText.value, "", "02.05");
  equal(last.value, "b", "02.06");
});

test("03 - immutable content blocks a replacement which would cross it", () => {
  const first = { type: "text", value: "." };
  const code = { type: "inlineCode", value: "." };
  const imageReference = {
    type: "imageReference",
    identifier: "empty",
    label: "empty",
    referenceType: "full",
    alt: "",
  };
  const last = { type: "text", value: "." };
  const tree = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "html", value: "<span>" },
          first,
          code,
          imageReference,
          last,
          { type: "html", value: "</span>" },
        ],
      },
    ],
  };

  unified().use(fixTypography).runSync(tree);
  equal(first.value, ".", "03.01");
  equal(code.value, ".", "03.02");
  equal(last.value, ".", "03.03");
  equal(imageReference.alt, "", "03.04");
});

test("04 - a 20000-level tree is transformed without recursion", () => {
  const text = { type: "text", value: "Wait..." };
  let nested = { type: "paragraph", children: [text] };
  for (let index = 0; index < 20000; index += 1) {
    nested = { type: "blockquote", children: [nested] };
  }
  const tree = { type: "root", children: [nested] };

  unified().use(fixTypography).runSync(tree);
  equal(text.value, `Wait${ellipsis}`, "04.01");
});

test("05 - a wide phrasing parent is mapped without argument spreading", () => {
  const children = [];
  for (let index = 0; index < 12000; index += 1) {
    children.push({ type: "text", value: index === 11999 ? "end..." : "a " });
  }
  const finalText = children[children.length - 1];
  const tree = {
    type: "root",
    children: [{ type: "paragraph", children }],
  };

  const file = new VFile();
  unified().use(fixTypography).runSync(tree, file);
  equal(finalText.value, `end${ellipsis}`, "05.01");
  equal(file.data.remarkTypography.textNodesProcessed, 12000, "05.02");
});

test.run();
