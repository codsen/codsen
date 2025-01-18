import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { deleter } from "./util/util.js";
// import { set, del } from "../dist/edit-package-json.esm.js";

// del - delete existing key
// -----------------------------------------------------------------------------

test("01 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d"
}`;
  let result = `{
  "c": "d"
}`;
  deleter(equal, source, result, "a", "01");
});

test("02 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d"
}`;
  let result = `{
  "a": "b"
}`;
  deleter(equal, source, result, "c", "02");
});

test("03 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d",
  "e": "f"
}`;
  let result = `{
  "a": "b",
  "e": "f"
}`;
  deleter(equal, source, result, "c", "03");
});

test("04 - deletes the first array's element", () => {
  let source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  let result = `{"qwe": [
  "cd",
  "ef"
]}`;
  deleter(equal, source, result, "qwe.0", "04");
});

test("05 - deletes the middle array's element", () => {
  let source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  let result = `{"qwe": [
  "ab",
  "ef"
]}`;
  deleter(equal, source, result, "qwe.1", "05");
});

test("06 - deletes the last array's element", () => {
  let source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  let result = `{"qwe": [
  "ab",
  "cd"
]}`;
  deleter(equal, source, result, "qwe.2", "06");
});

test("07 - deletes the first array's element", () => {
  let source = `{"qwe": [
  true,
  "cd",
  "ef"
]}`;
  let result = `{"qwe": [
  "cd",
  "ef"
]}`;
  deleter(equal, source, result, "qwe.0", "07");
});

test("08 - deletes the middle array's element", () => {
  let source = `{"qwe": [
  "ab",
  true,
  "ef"
]}`;
  let result = `{"qwe": [
  "ab",
  "ef"
]}`;
  deleter(equal, source, result, "qwe.1", "08");
});

test("09 - deletes the last array's element", () => {
  let source = `{"qwe": [
  "ab",
  "cd",
  true
]}`;
  let result = `{"qwe": [
  "ab",
  "cd"
]}`;
  deleter(equal, source, result, "qwe.2", "09");
});

test("10 - dips to root level key before going to second branch", () => {
  let source = `{
  "ab": {
    "cd": {
      "ef": "gh"
    }
  },
  "ij": {
    "kl": {
      "mn": [
        "op",
        "qr",
        "st"
      ],
      "uv": []
    }
  }
}`;
  let result = `{
  "ab": {
    "cd": {
      "ef": "gh"
    }
  },
  "ij": {
    "kl": {
      "mn": [
        "op",
        "qr"
      ],
      "uv": []
    }
  }
}`;
  deleter(equal, source, result, "ij.kl.mn.2", "10");
});

test("11 - nested arrays", () => {
  let source = `{
  "a": {
    "c": [
      {
      }
    ],
    "f": [
      {
        "g": "",
        "h": ""
      }
    ]
  }
}`;
  let result = `{
  "a": {
    "c": [
      {
      }
    ],
    "f": [
      {
        "g": ""
      }
    ]
  }
}`;
  deleter(equal, source, result, "a.f.0.h", "11");
});

test("12 - nested arrays", () => {
  let source = `{
  "a": {
    "c": [
      {
        "d": "",
        "e": ""
      }
    ],
    "f": [
      {
        "g": "",
        "h": ""
      }
    ]
  }
}`;
  let result = `{
  "a": {
    "c": [
      {
        "d": "",
        "e": ""
      }
    ],
    "f": [
      {
        "g": ""
      }
    ]
  }
}`;
  deleter(equal, source, result, "a.f.0.h", "12");
});

test("13 - key for deletion does not exist", () => {
  let source = `{
  "a": "b",
  "c": "d",
  "e": "f"
}`;
  deleter(equal, source, source, "zzz", "13");
});

test.run();
