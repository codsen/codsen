import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { stripHtml } from "../dist/string-strip-html.esm.js";

test("001 - issue 146 callback allowlists see slash and quote-adjacent handlers", () => {
  const allowedTags = ["div", "p", "b", "i", "strong", "em", "ul", "ol", "li"];
  const allowedAttrs = ["style", "class"];

  for (const input of [
    "<p/onclick=alert(1)>x</p>",
    '<p style="a"/onclick=alert(1)>x</p>',
    '<p style="a"onclick=alert(1)>x</p>',
    "<p\n/onclick=alert(1)>x</p>",
    '<div/onmouseover=alert(1) style="position:fixed;inset:0">x</div>',
    "<p//onclick=alert(1)>x</p>",
    "<p///onclick=alert(1)>x</p>",
    '<p style=""onclick=alert(1)>x</p>',
    "<p style=''onclick='alert(1)'>x</p>",
    "<p class/onclick=alert(1)>x</p>",
  ]) {
    for (const skipHtmlDecoding of [false, true]) {
      const tokens = [];
      const actual = stripHtml(input, {
        ignoreTags: allowedTags,
        ignoreIndentations: true,
        stripTogetherWithTheirContents: ["*"],
        skipHtmlDecoding,
        cb: ({ tag, rangesArr }) => {
          tokens.push(tag);
          if (
            tag.kind !== "tag" ||
            tag.status !== "complete" ||
            !allowedTags.includes(tag.name.toLowerCase()) ||
            tag.attributes.some(
              (attribute) =>
                !attribute.name ||
                !allowedAttrs.includes(attribute.name.toLowerCase()),
            )
          ) {
            rangesArr.push(tag.start, tag.end, "[REJECTED]");
          }
        },
      });

      equal(
        actual.result,
        `[REJECTED]x</${input.startsWith("<div") ? "div" : "p"}>`,
        "001.01",
      );
      equal(
        tokens[0].attributes.some(({ name }) => name.startsWith("on")),
        true,
        "001.02",
      );
      equal(tokens[0].status, "complete", "001.03");
      equal(tokens[0].name, input.startsWith("<div") ? "div" : "p", "001.04");
      equal(rApply(input, actual.ranges), actual.result, "001.05");
    }
  }
});

test("002 - adjacent attributes retain source offsets and decoded values", () => {
  const prefix = "😊&#65;";
  for (const separator of ["/", "//", "", "\t/", "\n/", "\r/", "\f/"]) {
    for (const quote of ['"', "'"]) {
      const opening = `<p style=${quote}a${quote}${separator}ONCLICK=${quote}x &amp; y${quote}>`;
      const input = `${prefix}${opening}x</p>`;
      const nameStarts = input.indexOf("ONCLICK");
      const valueStarts = nameStarts + "ONCLICK=".length + 1;
      for (const skipHtmlDecoding of [false, true]) {
        const tokens = [];
        stripHtml(input, {
          skipHtmlDecoding,
          cb: ({ tag }) => tokens.push(tag),
        });

        equal(
          tokens[0].attributes,
          [
            {
              nameStarts: prefix.length + 3,
              nameEnds: prefix.length + 8,
              equalsAt: prefix.length + 8,
              name: "style",
              valueStarts: prefix.length + 10,
              valueEnds: prefix.length + 11,
              value: "a",
            },
            {
              nameStarts,
              nameEnds: nameStarts + 7,
              equalsAt: nameStarts + 7,
              name: "ONCLICK",
              valueStarts,
              valueEnds: valueStarts + "x &amp; y".length,
              value: skipHtmlDecoding ? "x &amp; y" : "x & y",
            },
          ],
          "002.01",
        );
        equal(input.slice(tokens[0].start, tokens[0].end), opening, "002.02");
      }
    }
  }
});

test("003 - slash and quote characters inside unquoted values remain data", () => {
  for (const value of [
    "a/onclick=alert(1)",
    'a"onclick=alert(1)',
    "a'onclick=alert(1)",
  ]) {
    const input = `<p style=${value}>x</p>`;
    const tokens = [];
    stripHtml(input, { cb: ({ tag }) => tokens.push(tag) });

    equal(
      tokens[0].attributes.map(({ name, value: attributeValue }) => [
        name,
        attributeValue,
      ]),
      [["style", value]],
      "003.01",
    );
  }
});

test("004 - empty and unusual attribute names remain visible to callbacks", () => {
  for (const quote of ['"', "'"]) {
    const input = `<p style=${quote}${quote}onclick=${quote}${quote} !custom=${quote}x${quote}>`;
    const tokens = [];
    stripHtml(input, { cb: ({ tag }) => tokens.push(tag) });

    equal(
      tokens[0].attributes.map(({ name, value }) => [name, value]),
      [
        ["style", ""],
        ["onclick", ""],
        ["!custom", "x"],
      ],
      "004.01",
    );
    equal(
      tokens[0].attributes
        .slice(0, 2)
        .map(({ valueStarts, valueEnds }) => valueStarts === valueEnds),
      [true, true],
      "004.02",
    );
  }
});

test.run();
