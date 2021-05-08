import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

// missing closing bracket on a <style> tag
// -----------------------------------------------------------------------------

tap.todo(`01`, (t) => {
  const gathered = [];
  ct(`<style.a{b:c !important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 6,
        value: "<style",
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "style",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "rule",
        start: 7,
        end: 25,
        value: ".a{b:c !important;}",
        left: 6,
        nested: false,
        openingCurlyAt: 8,
        closingCurlyAt: 24,
        selectorsStart: 7,
        selectorsEnd: 8,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            start: 10,
            end: 25,
            property: "b",
            propertyStarts: 9,
            propertyEnds: 10,
            value: "c",
            valueStarts: 11,
            valueEnds: 12,
            important: "!important",
            importantStarts: 13,
            importantEnds: 23,
            colon: 10,
            semi: 23,
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
        value: "</style>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 32,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "01"
  );

  t.end();
});

tap.todo(`02`, (t) => {
  const gathered = [];
  ct(`<style\n.a{b:c !important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "02");

  t.end();
});

// misplaced semi
// -----------------------------------------------------------------------------

tap.todo(`03 - standalone semi in head CSS - chopped`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!important};`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "03");
  t.end();
});

tap.todo(`04 - standalone semi in head CSS - closed`, (t) => {
  const gathered = [];
  ct(`<style>.red{color:red!important};</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "04");
  t.end();
});

tap.todo(`05 - standalone semi in head CSS - surroundings`, (t) => {
  const gathered = [];
  ct(
    `<style>.a{b:c!important};
.b{text-align:left;}`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.strictSame(gathered, [], "05");
  t.end();
});
