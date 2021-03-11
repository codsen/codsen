import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

// considering JS code...
// -----------------------------------------------------------------------------

tap.test(`01 - an obvious nunjucks, but within a script`, (t) => {
  const gathered = [];
  ct(`<script>{{</script>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 8,
        value: "<script>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 7,
        tagName: "script",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "text",
        start: 8,
        end: 10,
        value: "{{",
      },
      {
        type: "tag",
        start: 10,
        end: 19,
        value: "</script>",
        tagNameStartsAt: 12,
        tagNameEndsAt: 18,
        tagName: "script",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "01"
  );
  t.end();
});

tap.test(`02`, (t) => {
  const gathered = [];
  ct(
    `<html>real text<script>!function(e){function z{}};return"></script></body></html>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );

  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 6,
        value: "<html>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "html",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 6,
        end: 15,
        value: "real text",
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "<script>",
        tagNameStartsAt: 16,
        tagNameEndsAt: 22,
        tagName: "script",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "text",
        start: 23,
        end: 58,
        value: '!function(e){function z{}};return">',
      },
      {
        type: "tag",
        start: 58,
        end: 67,
        value: "</script>",
        tagNameStartsAt: 60,
        tagNameEndsAt: 66,
        tagName: "script",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "tag",
        start: 67,
        end: 74,
        value: "</body>",
        tagNameStartsAt: 69,
        tagNameEndsAt: 73,
        tagName: "body",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "tag",
        start: 74,
        end: 81,
        value: "</html>",
        tagNameStartsAt: 76,
        tagNameEndsAt: 80,
        tagName: "html",
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
});

tap.test(`03 - tag within script`, (t) => {
  const gathered = [];
  ct(`<html><script>console.log("<html>")</script></html>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 6,
        value: "<html>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "html",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "tag",
        start: 6,
        end: 14,
        value: "<script>",
        tagNameStartsAt: 7,
        tagNameEndsAt: 13,
        tagName: "script",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "text",
        start: 14,
        end: 35,
        value: 'console.log("<html>")',
      },
      {
        type: "tag",
        start: 35,
        end: 44,
        value: "</script>",
        tagNameStartsAt: 37,
        tagNameEndsAt: 43,
        tagName: "script",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "tag",
        start: 44,
        end: 51,
        value: "</html>",
        tagNameStartsAt: 46,
        tagNameEndsAt: 50,
        tagName: "html",
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
});
