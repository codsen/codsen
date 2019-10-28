// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";

// 01. healthy code, no tricks
// -----------------------------------------------------------------------------

test("01.01 - text-tag-text", t => {
  const gathered = [];
  ct("  <a>z", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 2
    },
    {
      type: "html",
      start: 2,
      end: 5
    },
    {
      type: "text",
      start: 5,
      end: 6
    }
  ]);
});

test("01.02 - text only", t => {
  const gathered = [];
  ct("  ", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 2
    }
  ]);
});

test("01.03 - tag only", t => {
  const gathered = [];
  ct("<a>", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3
    }
  ]);
});

test("01.04 - multiple tags", t => {
  const gathered = [];
  ct("<a><b><c>", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3
    },
    {
      type: "html",
      start: 3,
      end: 6
    },
    {
      type: "html",
      start: 6,
      end: 9
    }
  ]);
});

test("01.05 - closing bracket in the attribute's value", t => {
  const gathered = [];
  ct(`<a alt=">">`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 11
    }
  ]);
});

test("01.06 - closing bracket layers of nested quotes", t => {
  const gathered = [];
  ct(`<a alt='"'">"'"'>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 17
    }
  ]);
});

// 02.
