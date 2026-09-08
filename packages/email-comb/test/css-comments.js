import { test } from "uvu";
import { equal } from "uvu/assert";
import { comb } from "../dist/email-comb.esm.js";

const comment = "/*remove me*/";

function html(css, classes = "keep") {
  return `<style>${css}</style><body><i class="${classes}">x</i></body>`;
}

test("01 - comment removal preserves compound and descendant selectors", () => {
  for (const [before, after, classes] of [
    [`.a${comment}.b`, ".a/**/.b", "a b"],
    [`.a${comment}:hover`, ".a:hover", "a"],
    [`.a${comment} :first-child`, ".a :first-child", "a"],
    [String.raw`.a\31${comment} a`, String.raw`.a\31/**/ a`, "a1"],
    [String.raw`.a\3a${comment} .b`, String.raw`.a\3a/**/ .b`, "a: b"],
  ]) {
    const actual = comb(html(`${before}{color:red}`, classes));
    equal(actual.result, html(`${after}{color:red}`, classes), "01.01");
    equal(
      actual.log.commentsLength,
      comment.length - (after.includes("/**/") ? 4 : 0),
      "01.02",
    );
  }
});

test("02 - numeric hash and function boundaries retain a minimal comment", () => {
  for (const value of [
    `1${comment}2`,
    `1${comment}px`,
    `#${comment}abc`,
    `+${comment}1`,
    `foo${comment}(bar)`,
    `-${comment}-x`,
  ]) {
    const source = html(`.keep{--x:${value}}`);
    const actual = comb(source);
    equal(actual.result, source.replace(comment, "/**/"), "02.01");
    equal(actual.log.commentsLength, comment.length - 4, "02.02");
  }
});

test("03 - standalone declaration punctuation permits full comment removal", () => {
  const actual = comb(
    html(`.keep{color:${comment}red;${comment}display:block}`),
  );
  equal(actual.result, html(".keep{color:red;display:block}"), "03.01");
  equal(actual.log.commentsLength, comment.length * 2, "03.02");
});

test("04 - retained comments remain opaque in both parsing rounds", () => {
  const source = html(`.a${comment}.b{color:red}`, "a b");
  const actual = comb(source, { removeCSSComments: false });
  equal(actual.result, source, "04.01");
  equal(actual.log.commentsLength, 0, "04.02");
});

test("05 - entity-bearing inline CSS remains conservatively unchanged", () => {
  for (const value of [
    "--x:1&#47;&#42;remove me&#42;&#47;2",
    `content:&quot;/*data*/&quot;;--x:1${comment}2`,
  ]) {
    const source = `<body><i style="${value}">x</i></body>`;
    const actual = comb(source);
    equal(actual.result, source, "05.01");
    equal(actual.log.commentsLength, 0, "05.02");
  }
});

test("06 - unfinished comments stop at authoritative HTML boundaries", () => {
  const tail = "/*unterminated";
  const style = comb(html(`.keep{color:red}${tail}`));
  const inline = comb(`<body><i style="color:red;${tail}">x</i></body>`);
  equal(style.result, html(".keep{color:red}"), "06.01");
  equal(style.log.commentsLength, tail.length, "06.02");
  equal(inline.result, '<body><i style="color:red;">x</i></body>', "06.03");
  equal(inline.log.commentsLength, tail.length, "06.04");
});

test("07 - comments separate a CR escape terminator from a following LF", () => {
  const selector = `${String.raw`.a\31`}\r${comment}\na`;
  const source = html(`${selector}{color:red}`, "a1");
  const actual = comb(source);
  equal(actual.result, source.replace(comment, "/**/"), "07.01");
  equal(actual.log.commentsLength, comment.length - 4, "07.02");
});

test("08 - apparent comments in strings and URL contents remain data", () => {
  const source = html('.keep{content:"/*data*/";background:url(a/*data*/b)}');
  const actual = comb(source);
  equal(actual.result, source, "08.01");
  equal(actual.log.commentsLength, 0, "08.02");
});

test.run();
