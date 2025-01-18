import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";
import { mixer } from "./util/util.js";

const BACKSLASH = "\u005C";

// ad-hoc
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - idx on defaults`, () => {
  mixer().forEach((opt) => {
    not.ok(isOpening("a", 0, opt), opt);
  });
});

test(`02 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - idx on defaults`, () => {
  mixer().forEach((opt) => {
    not.ok(isOpening("<", 0, opt), opt);
  });
});

test(`03 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - idx on defaults`, () => {
  mixer().forEach((opt) => {
    not.ok(isOpening(">", 0, opt), opt);
  });
});

test(`04 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<a b="ccc"<xyz>';
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
    not.ok(
      isOpening(str, 6, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 6`,
    );
  });

  mixer({
    allowCustomTagNames: false,
  }).forEach((opt) => {
    not.ok(
      isOpening(str, 10, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`,
    );
  });

  mixer({
    allowCustomTagNames: true,
  }).forEach((opt) => {
    ok(
      isOpening(str, 10, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`,
    );
  });

  mixer({
    allowCustomTagNames: true,
    skipOpeningBracket: true,
  }).forEach((opt) => {
    ok(
      isOpening(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`,
    );
  });
  mixer({
    allowCustomTagNames: false,
  }).forEach((opt) => {
    not.ok(
      isOpening(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`,
    );
  });
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    not.ok(
      isOpening(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`,
    );
  });
});

test(`05 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<a b="ccc"<div>';
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
    not.ok(
      isOpening(str, 6, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 6`,
    );
    ok(
      isOpening(str, 10, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 10`,
    );
  });

  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    not.ok(
      isOpening(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`,
    );
  });
  mixer({
    skipOpeningBracket: true,
  }).forEach((opt) => {
    ok(
      isOpening(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`,
    );
  });
});

test(`06 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  mixer().forEach((opt) => {
    not.ok(isOpening("a < b", 2, opt), opt);
  });
});

test(`07 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = "<span>a < b<span>";
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
    not.ok(
      isOpening(str, 8, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 8`,
    );
    ok(
      isOpening(str, 11, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`,
    );
  });
});

test(`08 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = "\n<table";
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 1, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
    );
  });
});

test(`09 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = `<br${BACKSLASH}>`;
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

test(`10 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = `< ${BACKSLASH} br ${BACKSLASH} >`;
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

test(`11 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = `<\t${BACKSLASH}///\t${BACKSLASH}${BACKSLASH}${BACKSLASH} br ${BACKSLASH} >`;
  mixer().forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

test(`12 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = "let's say that a < b and c > d.";
  mixer().forEach((opt) => {
    not.ok(
      isOpening(str, 17, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 17`,
    );
  });
  mixer().forEach((opt) => {
    not.ok(
      isOpening(str, 19, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 19`,
    );
  });
  mixer().forEach((opt) => {
    not.ok(
      isOpening(str, 27, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 27`,
    );
  });
});

test(`13 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = '<zzz accept="utf-8" yyy>';
  // by default, custom tag names are not allowed:
  mixer({ allowCustomTagNames: false }).forEach((opt) => {
    not.ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });

  // but enabling them result is positive
  mixer({ allowCustomTagNames: true }).forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

test(`14 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - ad-hoc`, () => {
  let str = '<zzz accept-charset="utf-8" yyy>';
  mixer({ allowCustomTagNames: false }).forEach((opt) => {
    not.ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
  mixer({ allowCustomTagNames: true }).forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

test(`15 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - custom html tags with dashes`, () => {
  let str = "<something-here>";
  mixer({ allowCustomTagNames: false }).forEach((opt) => {
    not.ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
  mixer({ allowCustomTagNames: true }).forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

// https://www.fileformat.info/info/unicode/char/1f600/index.htm
test(`16 - ${`\u001b[${36}m${"ad-hoc"}\u001b[${39}m`} - custom html tags with dashes`, () => {
  let str = "<emoji-\uD83D\uDE00>";
  mixer({ allowCustomTagNames: false }).forEach((opt) => {
    not.ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
  mixer({ allowCustomTagNames: true }).forEach((opt) => {
    ok(
      isOpening(str, 0, opt),
      `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
    );
  });
});

test("17 - perf test", () => {
  not.ok(
    isOpening("<div>Script says hello world and sky and sea</div>", 5, {
      allowCustomTagNames: false,
      skipOpeningBracket: true,
    }),
    "17.01",
  );
});

test.run();
