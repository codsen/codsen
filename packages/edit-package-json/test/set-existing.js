import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { setter } from "./util/util.js";

// set - editing an existing key
// -----------------------------------------------------------------------------

test("01 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d"
}`;
  let result = `{
  "a": "b",
  "c": "e"
}`;
  setter(equal, source, result, "c", "e", "02.01");
});

test("02 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d"
}`;
  let result = `{
  "a": "b",
  "c": "1"
}`;
  setter(equal, source, result, "c", "1", "02.02");
});

test("03 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d"
}`;
  let result = `{
  "a": "b",
  "c": 1
}`;
  setter(equal, source, result, "c", 1, "02.03");
});

test("04 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "d"
}`;
  let result = `{
  "a": "b",
  "c": false
}`;
  setter(equal, source, result, "c", false, "02.04");
});

test("05 - second level key", () => {
  let source = `{
  "a": "b",
  "c": {
    "d": "e"
  }
}`;
  let result = `{
  "a": "b",
  "c": {
    "d": "f"
  }
}`;
  setter(equal, source, result, "c.d", "f", "02.05");
});

test("06 - second level key", () => {
  // notice deliberate mis-indentation after "d": "e"
  let source = `{
  "a": "b",
  "c": {
    "d": "e"
},
  "f": {
    "g": "h"
  }
}`;
  // notice deliberate mis-indentation after "d": "e"
  let result = `{
  "a": "b",
  "c": {
    "d": "e"
},
  "f": {
    "g": "i"
  }
}`;
  setter(equal, source, result, "f.g", "i", "02.06");
});

test("07 - value is number", () => {
  let source = `{
  "a": "b",
  "c": 1
}`;
  let result = `{
  "a": "b",
  "c": 0
}`;
  setter(equal, source, result, "c", 0, "02.07");
});

test("08 - null overwritten with null", () => {
  let source = `{
  "a": "b",
  "c": null
}`;
  let result = `{
  "a": "b",
  "c": null
}`;
  setter(equal, source, result, "c", null, "02.08");
});

test("09 - value is object and it leads to contents end", () => {
  let input = `{
  "a": "b",
  "x": {"y": "z"}
}`;
  let result = `{
  "a": "b",
  "x": {"y":"x"}
}`;
  setter(equal, input, result, "x", { y: "x" }, "02.09");
});

test("10 - value is a stringified object - escapes", () => {
  let input = `{
  "a": "b",
  "x": {"y": "z"}
}`;
  let result = `{
  "a": "b",
  "x": "{ y: \\"x\\" }"
}`;
  setter(equal, input, result, "x", '{ y: "x" }', "02.10");
});

test("11 - difficult characters 1", () => {
  let input = `{
  "a": {
    "b": "}c"
}}`;
  let result = `{
  "a": "x"
}`;
  setter(equal, input, result, "a", "x", "02.11");
});

test("12 - difficult characters 2", () => {
  let input = `{
  "a": {
    "b": "c '*.{d,e,f,g,md}' --write",
    "m": "n"
  }
}`;
  let result = `{
  "a": "x"
}`;
  setter(equal, input, result, "a", "x", "02.12");
});

test("13 - nested objects", () => {
  let input = `{
  "a": {
    "b": {
      "c": "d"
    }
  }
}
`;
  let result = `{
  "a": "x"
}
`;
  setter(equal, input, result, "a", "x", "02.13");
});

test("14 - same-named key is passed through at deeper level while iterating", () => {
  let input = `{
  "a": {
    "z": "x"
  },
  "z": {
    "k": false,
    "l": [
      "m"
    ],
    "n": true
  }
}
`;
  let result = `{
  "a": {
    "z": "x"
  },
  "z": "y"
}
`;
  setter(equal, input, result, "z", "y", "02.14");
});

test("15 - same-named key is passed through at deeper level while iterating", () => {
  let input = `{
  "a": {
    "z": "x",
  },
  "z": {
    "k": false,
    "l": [
      "m"
    ],
    "n": true
  }
}
`;
  let result = `{
  "a": {
    "z": "x",
  },
  "z": "y"
}
`;
  setter(equal, input, result, "z", "y", "02.15", "invalid JSON");
});

test("16 - non-quoted value replaced with quoted", () => {
  let input = `{
  "a": {
    "b": false
  }
}
`;
  let result = `{
  "a": {
    "b": "x"
  }
}
`;
  setter(equal, input, result, "a.b", "x", "02.16");
});

test("17 - non-quoted value replaced with non-quoted", () => {
  let input = `{
  "a": {
    "b": false
  }
}
`;
  let result = `{
  "a": {
    "b": true
  }
}
`;
  setter(equal, input, result, "a.b", true, "02.17");
});

test("18 - quoted value replaced with non-quoted", () => {
  let input = `{
  "a": {
    "b": "c"
  }
}
`;
  let result = `{
  "a": {
    "b": true
  }
}
`;
  setter(equal, input, result, "a.b", true, "02.18");
});

test("19 - value empty obj replaced with non-quoted", () => {
  let input = `{
  "a": {
    "b": {}
  }
}
`;
  let result = `{
  "a": {
    "b": true
  }
}
`;
  setter(equal, input, result, "a.b", true, "02.19");
});

test("20 - value empty obj replaced with non-quoted", () => {
  let input = `{
  "a": {
    "b": []
  }
}
`;
  let result = `{
  "a": {
    "b": true
  }
}
`;
  setter(equal, input, result, "a.b", true, "02.20");
});

test("21 - value empty obj replaced with non-quoted", () => {
  let input = `{
  "a": {
    "b": {
      "c": []
    },
    "d": "e"
  }
}
`;
  let result = `{
  "a": {
    "b": {
      "c": []
    },
    "d": "x"
  }
}
`;
  setter(equal, input, result, "a.d", "x", "02.21");
});

test("22 - value empty obj replaced with non-quoted", () => {
  let input = `{
  "a": {
    "b": {
      "c": ["z"]
    },
    "d": "e"
  }
}
`;
  let result = `{
  "a": {
    "b": {
      "c": ["z"]
    },
    "d": "x"
  }
}
`;
  setter(equal, input, result, "a.d", "x", "02.22");
});

test("23 - middle element in the array", () => {
  let input = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "t",
    "u"
  ]
}
`;
  let result = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "x",
    "u"
  ]
}
`;
  setter(equal, input, result, "r.1", "x", "02.23");
});

test("24 - the last element in the array", () => {
  let input = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "t",
    "u"
  ]
}
`;
  let result = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "t",
    "x"
  ]
}
`;
  setter(equal, input, result, "r.2", "x", "02.24");
});

test("25 - last value in array, bool replaced with a quoted string", () => {
  let input = `{
  "a": {
    "b": false,
    "c": [
      "d"
    ]
  }
}
`;
  let result = `{
  "a": {
    "b": "x",
    "c": [
      "d"
    ]
  }
}
`;
  setter(equal, input, result, "a.b", "x", "02.25");
});

test("26 - key in the root", () => {
  let source = `{
  "a": "b",
  "c": "workspace:d"
}`;
  let result = `{
  "a": "b",
  "c": "workspace:1"
}`;
  setter(equal, source, result, "c", "workspace:1", "02.02");
});

test.run();
