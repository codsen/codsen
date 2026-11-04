import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// Issue #146 and nearby malformed comment/declaration variants.
const unfinished = [
  "<![CDATA[",
  "<![CDATA[ x",
  "<![if x]>",
  "<!--",
  "<!-- x",
  "<?",
  "<!",
  "</3",
  "</3>",
  "</ ",
  "</\t",
  "</\n",
  "</\f",
  "</\r",
  "</ 3",
  "<![]>",
  "<!x>",
  "<?x>",
  '</"p>',
  "</'p>",
  '<!"p>',
  "<!'p>",
  '<?"p>',
  "<?'p>",
];

test("001 - unfinished and bogus comments are removed through EOF", () => {
  for (const tail of unfinished) {
    const input = `visible ${tail}`;
    const actual = stripHtml(input, { skipHtmlDecoding: true });
    equal(actual.result, "visible", "001.01");
    equal(actual.allTagLocations, [[8, input.length]], "001.02");
    equal(actual.filteredTagLocations, actual.allTagLocations, "001.03");
  }
});

test("002 - callbacks see exact comment spans and can replace them", () => {
  for (const tail of unfinished) {
    const input = `<p>x</p>${tail}`;
    const seen = [];
    const actual = stripHtml(input, {
      ignoreTags: ["p"],
      ignoreIndentations: true,
      stripTogetherWithTheirContents: ["*"],
      skipHtmlDecoding: true,
      cb: ({ tag, rangesArr }) => {
        seen.push(tag);
        if (tag.kind !== "tag") {
          rangesArr.push(tag.start, tag.end, "[REJECTED]");
        }
      },
    });
    equal(actual.result, "<p>x</p>[REJECTED]", "002.01");
    equal(
      seen[2],
      {
        kind: tail.startsWith("<![CDATA[") ? "cdata" : "comment",
        start: 8,
        end: input.length,
      },
      "002.02",
    );
    equal(seen.length, 3, "002.03");
    equal(actual.filteredTagLocations, [[8, input.length]], "002.04");
  }
});

test("003 - alternate comment endings stop before the following tag", () => {
  for (const comment of ["<!-->", "<!--->", "<!--x--!>", "<!--x-->"]) {
    const seen = [];
    const input = `${comment}<b>visible</b>`;
    const actual = stripHtml(input, {
      cb: ({ tag, proposedReturn, rangesArr }) => {
        seen.push(tag);
        rangesArr.push(proposedReturn);
      },
    });
    equal(actual.result, "visible", "003.01");
    equal(
      seen[0],
      { kind: "comment", start: 0, end: comment.length },
      "003.02",
    );
    equal(
      seen.map((tag) => tag.kind),
      ["comment", "tag", "tag"],
      "003.03",
    );
    equal(actual, stripHtml(input), "003.04");
  }
});

test("004 - nested unterminated openers remain a single comment token", () => {
  for (const opener of ["<!--", "<![CDATA[", "<?", "<!", "</3"]) {
    const input = opener.repeat(2000);
    const seen = [];
    const progress = [];
    const actual = stripHtml(input, {
      reportProgressFunc: (value) => progress.push(value),
      cb: ({ tag, proposedReturn, rangesArr }) => {
        seen.push(tag);
        rangesArr.push(proposedReturn);
      },
    });
    equal(actual.result, "", "004.01");
    equal(seen.length, 1, "004.02");
    equal(seen[0].end, input.length, "004.03");
    equal(progress.length > 1, true, "004.04");
    equal(
      progress.every((n, i) => i === 0 || n >= progress[i - 1]),
      true,
      "004.05",
    );
  }
});

test("005 - decoded comment offsets still refer to original input", () => {
  const input = "A &lt;!-- unfinished";
  const seen = [];
  const actual = stripHtml(input, {
    cb: ({ tag, proposedReturn, rangesArr }) => {
      seen.push(tag);
      rangesArr.push(proposedReturn);
    },
  });
  equal(actual.result, "A", "005.01");
  equal(seen, [{ kind: "comment", start: 2, end: input.length }], "005.02");
  equal(actual, stripHtml(input), "005.03");
});

test("006 - ordinary text comparisons and raw text retain their meaning", () => {
  equal(stripHtml("a<").result, "a<", "006.01");
  equal(stripHtml("x < y").result, "x < y", "006.02");
  equal(
    stripHtml("<textarea><!--</textarea>visible").result,
    "<!--visible",
    "006.03",
  );
  equal(stripHtml("<script><!--</script>visible").result, "visible", "006.04");
});

test("007 - comment removal preserves a single trailing text character", () => {
  for (const comment of ["<!--x-->", "<![CDATA[x]]>", "<?x>", "<!x>", "</3>"]) {
    for (const gap of ["", " ", "\n"]) {
      const input = `${comment}${gap}a`;
      equal(stripHtml(input).result, "a", "007.01");
    }
  }
});

test("008 - a preceding literal opening bracket cannot hide a comment", () => {
  for (const prefix of ["<", "<<", "< "]) {
    for (const tail of unfinished) {
      const input = `${prefix}${tail}`;
      const seen = [];
      const actual = stripHtml(input, {
        cb: ({ tag, rangesArr }) => {
          seen.push(tag);
          rangesArr.push(tag.start, tag.end, "[REJECTED]");
        },
      });
      equal(actual.result, `${prefix}[REJECTED]`, "008.01");
      equal(seen.length, 1, "008.02");
      equal(seen[0].start, prefix.length, "008.03");
      equal(seen[0].end, input.length, "008.04");
    }
  }
});

test("009 - direct-browser bundle exposes the same filtering callbacks", () => {
  const browser = {};
  vm.runInNewContext(
    readFileSync(
      new URL("../dist/string-strip-html.umd.js", import.meta.url),
      "utf8",
    ),
    browser,
  );
  for (const input of [
    ...unfinished,
    ...unfinished.map((tail) => `< ${tail}`),
    "<p/onclick=alert(1)>x</p>",
    '<p style="a"onclick=alert(1)>x</p>',
  ]) {
    const results = [];
    for (const strip of [stripHtml, browser.stringStripHtml.stripHtml]) {
      const tokens = [];
      const actual = strip(input, {
        ignoreTags: ["p"],
        cb: ({ tag, rangesArr }) => {
          tokens.push(tag);
          rangesArr.push(tag.start, tag.end, "[REJECTED]");
        },
      });
      results.push(JSON.stringify({ result: actual.result, tokens }));
    }
    equal(results[0], results[1], "009.01");
  }
});

test("010 - unfinished doctypes are reported as incomplete tags", () => {
  for (const declaration of [
    "<!DOCTYPE",
    "<!doctype html",
    '<!DOCTYPE html "',
    '<!DOCTYPE "bad',
  ]) {
    const input = `visible ${declaration}`;
    const seen = [];
    const actual = stripHtml(input, {
      cb: ({ tag, rangesArr }) => {
        seen.push(tag);
        rangesArr.push(tag.start, tag.end, "[REJECTED]");
      },
    });
    equal(actual.result, "visible [REJECTED]", "010.01");
    equal(seen.length, 1, "010.02");
    equal(seen[0].kind, "tag", "010.03");
    equal(seen[0].status, "incomplete", "010.04");
    equal([seen[0].start, seen[0].end], [8, input.length], "010.05");
    equal(stripHtml(input).result, "visible", "010.06");
  }
});

test.run();
