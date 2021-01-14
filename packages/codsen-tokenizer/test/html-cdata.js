import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

tap.test(`01 - correct`, (t) => {
  const gathered = [];
  ct(`<![CDATA[x<y]]>`, {
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
        end: 15,
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "01"
  );
  t.end();
});

tap.test("02 - messed up 1", (t) => {
  const gathered = [];
  ct(`<[CDATA[x<y]]>`, {
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
        end: 14,
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "02"
  );
  t.end();
});

tap.test("03 - messed up 2", (t) => {
  const gathered = [];
  ct(`<!CDATA[x<y]]>`, {
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
        end: 14,
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "03"
  );
  t.end();
});

tap.test("04 - messed up 3", (t) => {
  const gathered = [];
  ct(`<![ CData[x<y]]>`, {
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
        end: 16,
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "04"
  );
  t.end();
});

tap.test("05 - with line breaks", (t) => {
  const gathered = [];
  ct(
    `a\n<![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]>\nb`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2,
      },
      {
        type: "tag",
        start: 2,
        end: 90,
        void: false,
        recognised: true,
        kind: "cdata",
      },
      {
        type: "text",
        start: 90,
        end: 92,
      },
    ],
    "05"
  );
  t.end();
});
