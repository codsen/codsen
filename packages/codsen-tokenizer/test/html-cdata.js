import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

test("01 - correct", () => {
  let gathered = [];
  ct("<![CDATA[x<y]]>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
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
    "01",
  );
});

test("02 - messed up 1", () => {
  let gathered = [];
  ct("<[CDATA[x<y]]>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
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
    "02",
  );
});

test("03 - messed up 2", () => {
  let gathered = [];
  ct("<!CDATA[x<y]]>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
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
    "03",
  );
});

test("04 - messed up 3", () => {
  let gathered = [];
  ct("<![ CData[x<y]]>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
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
    "04",
  );
});

test("05 - with line breaks", () => {
  let gathered = [];
  ct(
    `a\n<![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]>\nb`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    },
  );
  compare(
    ok,
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
    "05",
  );
});

test.run();
