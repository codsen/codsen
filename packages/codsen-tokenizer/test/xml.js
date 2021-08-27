import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

tap.test("01 - correct", (t) => {
  const gathered = [];
  ct(`<?xml version="1.0" encoding="UTF-8"?>`, {
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
        end: 38,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "01"
  );
  t.end();
});

tap.test("02 - incorrect 1", (t) => {
  const gathered = [];
  ct(`< ?xml version="1.0" encoding="UTF-8"?>`, {
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
        end: 39,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "02"
  );
  t.end();
});

tap.test("03 - incorrect 2", (t) => {
  const gathered = [];
  ct(`<? xml version="1.0" encoding="UTF-8"?>`, {
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
        end: 39,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "03"
  );
  t.end();
});

tap.test("04 - incorrect 3", (t) => {
  const gathered = [];
  ct(`< ?XML version="1.0" encoding="UTF-8"?>`, {
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
        end: 39,
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "04"
  );
  t.end();
});
