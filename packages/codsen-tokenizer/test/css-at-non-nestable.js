import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// not nested at rules
// ---------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - @namespace`,
  (t) => {
    const gathered = [];
    ct(`<style>@namespace url(z);</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<style>",
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
          type: "at",
          start: 7,
          end: 25,
          value: "@namespace url(z);",
          left: 6,
          nested: false,
          openingCurlyAt: null,
          closingCurlyAt: null,
          identifier: "namespace",
          identifierStartsAt: 8,
          identifierEndsAt: 17,
          query: "url(z)",
          queryStartsAt: 18,
          queryEndsAt: 24,
          rules: [],
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
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - @charset (illegal in HTML)`,
  (t) => {
    const gathered = [];
    ct(`<style>@charset "utf-8";</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<style>",
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
          type: "at",
          start: 7,
          end: 24,
          value: `@charset "utf-8";`,
          left: 6,
          nested: false,
          openingCurlyAt: null,
          closingCurlyAt: null,
          identifier: "charset",
          identifierStartsAt: 8,
          identifierEndsAt: 15,
          query: '"utf-8"',
          queryStartsAt: 16,
          queryEndsAt: 23,
          rules: [],
        },
        {
          type: "tag",
          start: 24,
          end: 32,
          value: "</style>",
          tagNameStartsAt: 26,
          tagNameEndsAt: 31,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - 2x @charset, spaced`,
  (t) => {
    const gathered = [];
    ct(
      `<style>
  @charset "UTF-8";
  @charset "iso-8859-15";
</style>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<style>",
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
          type: "text",
          start: 7,
          end: 10,
          value: "\n  ",
        },
        {
          type: "at",
          start: 10,
          end: 27,
          value: '@charset "UTF-8";',
          left: 6,
          nested: false,
          openingCurlyAt: null,
          closingCurlyAt: null,
          identifier: "charset",
          identifierStartsAt: 11,
          identifierEndsAt: 18,
          query: '"UTF-8"',
          queryStartsAt: 19,
          queryEndsAt: 26,
          rules: [],
        },
        {
          type: "text",
          start: 27,
          end: 30,
          value: "\n  ",
        },
        {
          type: "at",
          start: 30,
          end: 53,
          value: '@charset "iso-8859-15";',
          left: 26,
          nested: false,
          openingCurlyAt: null,
          closingCurlyAt: null,
          identifier: "charset",
          identifierStartsAt: 31,
          identifierEndsAt: 38,
          query: '"iso-8859-15"',
          queryStartsAt: 39,
          queryEndsAt: 52,
          rules: [],
        },
        {
          type: "text",
          start: 53,
          end: 54,
          value: "\n",
        },
        {
          type: "tag",
          start: 54,
          end: 62,
          value: "</style>",
          tagNameStartsAt: 56,
          tagNameEndsAt: 61,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - 2x @charset, tight`,
  (t) => {
    const gathered = [];
    ct(`<style>@charset "UTF-8";@charset "iso-8859-15";</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<style>",
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
          type: "at",
          start: 7,
          end: 24,
          value: '@charset "UTF-8";',
          left: 6,
          nested: false,
          openingCurlyAt: null,
          closingCurlyAt: null,
          identifier: "charset",
          identifierStartsAt: 8,
          identifierEndsAt: 15,
          query: '"UTF-8"',
          queryStartsAt: 16,
          queryEndsAt: 23,
          rules: [],
        },
        {
          type: "at",
          start: 24,
          end: 47,
          value: '@charset "iso-8859-15";',
          left: 23,
          nested: false,
          openingCurlyAt: null,
          closingCurlyAt: null,
          identifier: "charset",
          identifierStartsAt: 25,
          identifierEndsAt: 32,
          query: '"iso-8859-15"',
          queryStartsAt: 33,
          queryEndsAt: 46,
          rules: [],
        },
        {
          type: "tag",
          start: 47,
          end: 55,
          value: "</style>",
          tagNameStartsAt: 49,
          tagNameEndsAt: 54,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "04"
    );
    t.end();
  }
);
