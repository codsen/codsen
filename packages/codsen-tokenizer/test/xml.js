import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

test("01 - correct", () => {
  let gathered = [];
  ct('<?xml version="1.0" encoding="UTF-8"?>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 38,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ]),
    "01.01",
  );
});

test("02 - incorrect 1", () => {
  let gathered = [];
  ct('< ?xml version="1.0" encoding="UTF-8"?>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 39,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ]),
    "02.01",
  );
});

test("03 - incorrect 2", () => {
  let gathered = [];
  ct('<? xml version="1.0" encoding="UTF-8"?>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 39,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ]),
    "03.01",
  );
});

test("04 - incorrect 3", () => {
  let gathered = [];
  ct('< ?XML version="1.0" encoding="UTF-8"?>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 39,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ]),
    "04.01",
  );
});

test.run();
