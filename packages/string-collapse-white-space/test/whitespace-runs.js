import fs from "node:fs";
import vm from "node:vm";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

const realm = vm.createContext({});
vm.runInContext(
  fs.readFileSync(
    new URL("../dist/string-collapse-white-space.umd.js", import.meta.url),
    "utf8",
  ),
  realm,
);
const implementations = [
  collapse,
  (str, opts) =>
    JSON.parse(
      JSON.stringify(
        realm.stringCollapseWhiteSpace.collapse(str, {
          ...opts,
          ...(opts?.cb
            ? { cb: (payload) => opts.cb(JSON.parse(JSON.stringify(payload))) }
            : {}),
        }),
      ),
    ),
];
const linebreaks = ["\n", "\r", "\r\n"];
const whitespace = ["\t", "\u2003", "\u00a0", "\t\u2003"];

test("01 - whole-string trimming cancels spaces-only replacements", () => {
  for (const run of implementations) {
    for (const eol of linebreaks) {
      for (const ws of whitespace) {
        for (const [input, options] of [
          [`${eol}${ws}a`, { trimStart: true }],
          [`a${ws}${eol}`, { trimEnd: true }],
        ]) {
          const opts = { ...options, enforceSpacesOnly: true };
          const res = run(input, opts);
          equal(res.result, "a", "01.01");
          equal(run(res.result, opts).result, res.result, "01.02");
          equal(rApply(input, res.ranges), res.result, "01.03");
        }
      }
    }
  }
});

test("02 - line trimming wins over spaces-only conversion", () => {
  for (const run of implementations) {
    for (const eol of linebreaks) {
      for (const ws of whitespace) {
        const input = `a${ws}${eol}${ws}b`;
        const opts = { trimLines: true, enforceSpacesOnly: true };
        const res = run(input, opts);
        equal(res.result, `a${eol}b`, "02.01");
        equal(run(res.result, opts).result, res.result, "02.02");
        equal(rApply(input, res.ranges), res.result, "02.03");
        equal(
          run(input, { enforceSpacesOnly: true }).result,
          `a ${eol} b`,
          "02.04",
        );
      }
    }
  }
});

test("03 - removed empty lines cannot insert replacement spaces", () => {
  for (const run of implementations) {
    for (const eol of linebreaks) {
      for (const ws of whitespace) {
        const input = `a${eol}${ws}${eol}b`;
        const opts = { removeEmptyLines: true, enforceSpacesOnly: true };
        const res = run(input, opts);
        equal(res.result, `a${eol}b`, "03.01");
        equal(run(res.result, opts).result, res.result, "03.02");
        equal(rApply(input, res.ranges), res.result, "03.03");
        equal(
          run(input, { enforceSpacesOnly: true }).result,
          `a${eol} ${eol}b`,
          "03.04",
        );
      }
    }
  }
});

test("04 - replacements receive one callback without a null fallback", () => {
  for (const run of implementations) {
    for (const replacement of ["-", "", null]) {
      const calls = [];
      const res = run("a\tb", {
        enforceSpacesOnly: true,
        cb: (payload) => {
          calls.push(payload);
          return replacement === null
            ? null
            : [
                payload.whiteSpaceStartsAt,
                payload.whiteSpaceEndsAt,
                replacement,
              ];
        },
      });
      equal(
        calls,
        [
          {
            suggested: [1, 2, " "],
            whiteSpaceStartsAt: 1,
            whiteSpaceEndsAt: 2,
            str: "a\tb",
          },
        ],
        "04.01",
      );
      equal(
        res.result,
        replacement === null ? "a\tb" : `a${replacement}b`,
        "04.02",
      );
      equal(
        res.ranges,
        replacement === null
          ? null
          : [replacement ? [1, 2, replacement] : [1, 2]],
        "04.03",
      );
    }
  }
});

test("05 - unchanged whitespace still receives a null suggestion", () => {
  for (const run of implementations) {
    const calls = [];
    equal(
      run("a b", {
        cb: (payload) => {
          calls.push(payload);
          return [1, 2, "-"];
        },
      }),
      { result: "a-b", ranges: [[1, 2, "-"]] },
      "05.01",
    );
    equal(
      calls,
      [
        {
          suggested: null,
          whiteSpaceStartsAt: 1,
          whiteSpaceEndsAt: 2,
          str: "a b",
        },
      ],
      "05.02",
    );
  }
});

test("06 - multiple line suggestions keep their order and complete boundaries", () => {
  for (const run of implementations) {
    const calls = [];
    const str = "a\t\n\tb";
    equal(
      run(str, {
        enforceSpacesOnly: true,
        cb: (payload) => {
          calls.push(payload);
          return payload.suggested;
        },
      }),
      {
        result: "a \n b",
        ranges: [
          [1, 2, " "],
          [3, 4, " "],
        ],
      },
      "06.01",
    );
    equal(
      calls,
      [
        {
          suggested: [1, 2, " "],
          whiteSpaceStartsAt: 1,
          whiteSpaceEndsAt: 4,
          str,
        },
        {
          suggested: [3, 4, " "],
          whiteSpaceStartsAt: 1,
          whiteSpaceEndsAt: 4,
          str,
        },
      ],
      "06.02",
    );
    equal(
      run("a\n\t\nb", {
        removeEmptyLines: true,
        enforceSpacesOnly: true,
        cb: ({ suggested }) => suggested && [suggested[0], suggested[1], "-"],
      }),
      { result: "a-\nb", ranges: [[1, 3, "-"]] },
      "06.03",
    );
  }
});

test("07 - string-edge trimming stops at protected NBSPs", () => {
  for (const run of implementations) {
    for (const ws of [" ", "  ", "\t", "\u2003", "\n\t"]) {
      equal(run(`${ws}\u00a0a`).result, "\u00a0a", "07.01");
      equal(run(`a\u00a0${ws}`).result, "a\u00a0", "07.02");
      equal(run(`${ws}\u00a0${ws}`).result, "\u00a0", "07.03");
      equal(
        run(`${ws}\u00a0a`, { trimStart: false }).result,
        `${ws === "  " ? " " : ws}\u00a0a`,
        "07.04",
      );
      equal(
        run(`a\u00a0${ws}`, { trimEnd: false }).result,
        `a\u00a0${ws === "  " ? " " : ws}`,
        "07.05",
      );
      equal(run(`${ws}\u00a0a`, { trimnbsp: true }).result, "a", "07.06");
      equal(run(`a\u00a0${ws}`, { trimnbsp: true }).result, "a", "07.07");
    }
  }
});

test("08 - protected NBSPs do not block trimming other line segments", () => {
  for (const run of implementations) {
    for (const eol of linebreaks) {
      for (const ws of [" ", "  ", "\t", "\u2003"]) {
        equal(
          run(`a\u00a0${eol}${ws}b`, { trimLines: true }).result,
          `a\u00a0${eol}b`,
          "08.01",
        );
        equal(
          run(`a${ws}${eol}\u00a0b`, { trimLines: true }).result,
          `a${eol}\u00a0b`,
          "08.02",
        );
        equal(
          run(`a\u00a0${ws}${eol}${ws}\u00a0b`, { trimLines: true }).result,
          `a\u00a0${eol}\u00a0b`,
          "08.03",
        );
        equal(
          run(`a\u00a0${ws}${eol}${ws}\u00a0b`, {
            trimLines: true,
            trimnbsp: true,
          }).result,
          `a${eol}b`,
          "08.04",
        );
        equal(
          run(`a\u00a0${ws}${eol}${ws}\u00a0b`, {
            trimLines: true,
            enforceSpacesOnly: true,
          }).result,
          `a${eol}b`,
          "08.05",
        );
      }
    }
  }
});

test("09 - trailing metadata includes every whitespace character", () => {
  for (const run of implementations) {
    for (const tail of ["\n", "\r", "\r\n", "\n\t", "\n\u00a0", "b"]) {
      const str = `a  ${tail}`;
      const calls = [];
      const res = run(str, {
        trimEnd: false,
        cb: (payload) => {
          calls.push(payload);
          return payload.suggested;
        },
      });
      equal(
        calls,
        [
          {
            suggested: [1, 2],
            whiteSpaceStartsAt: 1,
            whiteSpaceEndsAt: tail === "b" ? 3 : str.length,
            str,
          },
        ],
        "09.01",
      );
      equal(res.result, `a ${tail}`, "09.02");
    }
    equal(
      run("a  \n", {
        trimEnd: false,
        cb: (x) =>
          x.str.slice(x.whiteSpaceStartsAt, x.whiteSpaceEndsAt).includes("\n")
            ? null
            : x.suggested,
      }),
      { result: "a  \n", ranges: null },
      "09.03",
    );
    const calls = [];
    run("a\t\n", {
      trimEnd: false,
      trimLines: true,
      cb: (payload) => {
        calls.push(payload);
        return null;
      },
    });
    equal(
      calls,
      [
        {
          suggested: [1, 2],
          whiteSpaceStartsAt: 1,
          whiteSpaceEndsAt: 3,
          str: "a\t\n",
        },
      ],
      "09.04",
    );
  }
});

test("10 - repeated whitespace runs require linear scanning and draining", () => {
  function countOperations(n, chunk, opts) {
    const str = `a${chunk.repeat(n)}b`;
    let operations = 0;
    const trim = String.prototype.trim;
    const charCodeAt = String.prototype.charCodeAt;
    const shift = Array.prototype.shift;
    try {
      String.prototype.trim = function (...args) {
        operations += 1;
        return trim.apply(this, args);
      };
      String.prototype.charCodeAt = function (...args) {
        operations += 1;
        return charCodeAt.apply(this, args);
      };
      Array.prototype.shift = function (...args) {
        operations += this.length;
        return shift.apply(this, args);
      };
      collapse(str, opts);
    } finally {
      String.prototype.trim = trim;
      String.prototype.charCodeAt = charCodeAt;
      Array.prototype.shift = shift;
    }
    return operations;
  }
  for (const [chunk, opts] of [
    ["  \n", {}],
    [" \n", { trimLines: true }],
    ["  \t\n", {}],
  ]) {
    const small = countOperations(250, chunk, opts);
    const large = countOperations(500, chunk, opts);
    ok(
      large < small * 2.2,
      "10.01 - doubling the input stays near twice the work",
    );
    ok(
      large < chunk.length * 500 * 30,
      "10.02 - bounded scans per input character",
    );
  }
});

test.run();
