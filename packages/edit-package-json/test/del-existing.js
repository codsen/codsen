import tap from "tap";
import { deleter } from "./util/util.js";
// import { set, del } from "../dist/edit-package-json.esm.js";

// del - delete existing key
// -----------------------------------------------------------------------------

tap.test(`01 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "c": "d"
}`;
  deleter(t, source, result, "a", "05.01");
  t.end();
});

tap.test(`02 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b"
}`;
  deleter(t, source, result, "c", "05.02");
  t.end();
});

tap.test(`03 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d",
  "e": "f"
}`;
  const result = `{
  "a": "b",
  "e": "f"
}`;
  deleter(t, source, result, "c", "05.03");
  t.end();
});

tap.test(`04 - deletes the first array's element`, (t) => {
  const source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "cd",
  "ef"
]}`;
  deleter(t, source, result, "qwe.0", "05.04");
  t.end();
});

tap.test(`05 - deletes the middle array's element`, (t) => {
  const source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "ab",
  "ef"
]}`;
  deleter(t, source, result, "qwe.1", "05.05");
  t.end();
});

tap.test(`06 - deletes the last array's element`, (t) => {
  const source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "ab",
  "cd"
]}`;
  deleter(t, source, result, "qwe.2", "05.06");
  t.end();
});

tap.test(`07 - deletes the first array's element`, (t) => {
  const source = `{"qwe": [
  true,
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "cd",
  "ef"
]}`;
  deleter(t, source, result, "qwe.0", "05.07");
  t.end();
});

tap.test(`08 - deletes the middle array's element`, (t) => {
  const source = `{"qwe": [
  "ab",
  true,
  "ef"
]}`;
  const result = `{"qwe": [
  "ab",
  "ef"
]}`;
  deleter(t, source, result, "qwe.1", "05.08");
  t.end();
});

tap.test(`09 - deletes the last array's element`, (t) => {
  const source = `{"qwe": [
  "ab",
  "cd",
  true
]}`;
  const result = `{"qwe": [
  "ab",
  "cd"
]}`;
  deleter(t, source, result, "qwe.2", "05.09");
  t.end();
});

tap.test(`10 - dips to root level key before going to second branch`, (t) => {
  const source = `{
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
  const result = `{
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
  deleter(t, source, result, "ij.kl.mn.2", "05.10");
  t.end();
});

tap.test(`11 - nested arrays`, (t) => {
  const source = `{
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
  const result = `{
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
  deleter(t, source, result, "a.f.0.h", "05.11");
  t.end();
});

tap.test(`12 - nested arrays`, (t) => {
  const source = `{
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
  const result = `{
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
  deleter(t, source, result, "a.f.0.h", "05.12");
  t.end();
});
