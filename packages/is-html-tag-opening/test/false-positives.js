import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// mixer generates array of all variations of options' sets
// with all possible bool flag opts keys:
import { mixer } from "./util/util.js";
import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// false positives
// -----------------------------------------------------------------------------

/*tttest("deleteme", () => {
  ok(
    isOpening(`<x src="b" a class="">`, 11, {
      allowCustomTagNames: false,
      skipOpeningBracket: false,
    }),
    "01.01"
  );
});*/

test(`01 - ${`\u001b[${32}m${"false positives"}\u001b[${39}m`} - last letter`, () => {
  mixer().forEach((opt) => {
    not.ok(isOpening("> x", 2, opt), opt);
    //            ^
  });
  mixer().forEach((opt) => {
    not.ok(isOpening("> b", 2, opt), opt);
    //            ^
  });
  mixer().forEach((opt) => {
    not.ok(isOpening("> div", 2, opt), opt);
    //            ^
  });
  mixer().forEach((opt) => {
    not.ok(isOpening("> div class", 2, opt), opt);
    //            ^
  });

  // the tag name has to be recognised and attr should follow
  mixer({
    skipOpeningBracket: true,
  }).forEach((opt) => {
    ok(isOpening('> div class="z"', 2, opt), opt);
    //           ^
  });
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    not.ok(isOpening('> div class="z"', 2, opt), opt);
    //            ^
  });
});

test("02 - starting at unrecognised tag", () => {
  // idx = 0
  let input = 'bc img src="z"/>';
  //             ^
  mixer({
    skipOpeningBracket: true,
    allowCustomTagNames: true,
  }).forEach((opt) => {
    ok(isOpening(input, 0, opt), opt);
  });
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    not.ok(isOpening(input, 0, opt), opt);
  });
  mixer({
    allowCustomTagNames: false,
  }).forEach((opt) => {
    not.ok(isOpening(input, 0, opt), opt);
  });
});

test("03 - starting at recognised tag", () => {
  // idx = 3
  let input = 'bc img src="z"/>';
  //                ^
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    not.ok(isOpening(input, 3, opt), opt);
  });
  mixer({
    skipOpeningBracket: true,
  }).forEach((opt) => {
    ok(isOpening(input, 3, opt), opt);
  });
});

test("04", () => {
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    not.ok(isOpening('img bc src="z"/>', 0, opt), opt);
  });
  mixer({
    skipOpeningBracket: true,
  }).forEach((opt) => {
    ok(isOpening('img bc src="z"/>', 0, opt), opt);
  });
});

test("05 one-letter-name recognised tag", () => {
  mixer().forEach((opt) => {
    ok(isOpening("<p>", 0, opt), opt);
    //         ^
  });
});

test("06 one-letter-name unrecognised tag", () => {
  let input = "<x>";
  //             ^
  //           idx 0
  mixer({
    allowCustomTagNames: false,
  }).forEach((opt) => {
    not.ok(isOpening(input, 0, opt), opt);
  });
  mixer({
    allowCustomTagNames: true,
  }).forEach((opt) => {
    ok(isOpening(input, 0, opt), opt);
  });
});

test("07", () => {
  [
    '<x src="b" a>',
    '<x src="b" a >',
    '<x src="b" a/>',
    '<x src="b" a />',
    '<x src="b" a/ >',
    '<x src="b" a / >',
    //          ^
    //        idx 11
  ].forEach((input) => {
    mixer().forEach((opt) => {
      not.ok(
        isOpening(input, 11, opt),
        `str=${input} - opt = ${JSON.stringify(opt, null, 0)} - idx = 11`,
      );
    });
  });
});

test("08", () => {
  [
    '<x src="b" a class="">',
    '<x src="b" a class="" >',
    '<x src="b" a class=""/>',
    '<x src="b" a class="" />',
    '<x src="b" a class=""/ >',
    '<x src="b" a class="" / >',
    //          ^
    //        idx 11
  ].forEach((input) => {
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(input, 11, opt),
        `str=${input} - opt = ${JSON.stringify(opt, null, 0)} - idx = 11`,
      );
    });
    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(input, 11, opt),
        `str=${input} - opt = ${JSON.stringify(opt, null, 0)} - idx = 11`,
      );
    });
  });
});

test("09", () => {
  mixer().forEach((opt) => {
    [
      '<x src="b" <a>',
      '<x src="b" <a >',
      '<x src="b" <a/>',
      '<x src="b" <a />',
      '<x src="b" <a/ >',
      '<x src="b" <a class>',
      '<x src="b" <a class=>',
      '<x src="b" <a class=\'>',
      "<x src=\"b\" <a class=''>",
      "<x src=\"b\" <a class=''/>",
      '<x src="b" <a class=">',
      '<x src="b" <a class=" >',
      '<x src="b" <a class="">',
      '<x src="b" <a class="" >',
      '<x src="b" <a class="z">',
      '<x src="b" <a class="z" >',
      '<x src="b" <a class="z" />',
      '<x src="b" <a class="z" id>',
      '<x src="b" <a class="z" id=>',
      '<x src="b" <a class="z" id="">',
      //          ^
      //        idx 11
    ].forEach((str) => {
      ok(
        isOpening(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`,
      );
    });
  });

  // but opening bracket means it's a tag, no matter what
});

test("10", () => {
  mixer().forEach((opt) => {
    not.ok(isOpening('<img src="b" img />', 13, opt), opt);
  });

  // that's as far as it goes...
  // a bracket changes the whole situation:
  mixer().forEach((opt) => {
    ok(isOpening('<img src="b" <img />', 13, opt), opt);
  });
});

test("11 known tag name + an attribute", () => {
  mixer().forEach((opt) => {
    [
      '<img src="b" <img src="" />',
      '<img src="b" < img src="" />',
      "<img src=\"b\" < img src='' />",

      "<img src=\"b\" <img src='' class>",
      "<img src=\"b\" <img src='' class >",
      "<img src=\"b\" <img src='' class/>",
      "<img src=\"b\" <img src='' class />",
      "<img src=\"b\" <img src='' class=>",
      "<img src=\"b\" <img src='' class= >",
      "<img src=\"b\" <img src='' class=/>",
      "<img src=\"b\" <img src='' class= />",
      "<img src=\"b\" <img src='' class=''>",
      "<img src=\"b\" <img src='' class='' >",
      '<img src="b" <img src=\'\' class="">',
      '<img src="b" <img src=\'\' class="" >',
      "<img src=\"b\" <img src='' class=''/>",
      "<img src=\"b\" <img src='' class='' />",
      '<img src="b" <img src=\'\' class="" />',
      '<img src="b" <img src=\'\' class="" / >',
      "<img src=\"b\" <img src='' class='' / >",
      '<img src="b" <img src=\'\' class="z">',
      '<img src="b" <img src=\'\' class="z" >',
      '<img src="b" <img src=\'\' class="z"/>',
      '<img src="b" <img src=\'\' class="z" />',
      '<img src="b" <img src=\'\' class="z" / >',

      "<img src=\"b\" <img src=''class>",
      "<img src=\"b\" <img src=''class >",
      "<img src=\"b\" <img src=''class/>",
      "<img src=\"b\" <img src=''class />",
      "<img src=\"b\" <img src=''class=>",
      "<img src=\"b\" <img src=''class= >",
      "<img src=\"b\" <img src=''class=/>",
      "<img src=\"b\" <img src=''class= />",
      "<img src=\"b\" <img src=''class=''>",
      "<img src=\"b\" <img src=''class='' >",
      '<img src="b" <img src=\'\'class="">',
      '<img src="b" <img src=\'\'class="" >',
      "<img src=\"b\" <img src=''class=''/>",
      "<img src=\"b\" <img src=''class='' />",
      '<img src="b" <img src=\'\'class="" />',
      '<img src="b" <img src=\'\'class="" / >',
      "<img src=\"b\" <img src=''class='' / >",
      '<img src="b" <img src=\'\'class="z">',
      '<img src="b" <img src=\'\'class="z" >',
      '<img src="b" <img src=\'\'class="z"/>',
      '<img src="b" <img src=\'\'class="z" />',
      '<img src="b" <img src=\'\'class="z" / >',

      "<img src=\"b\" < img src='' class>",
      "<img src=\"b\" < img src='' class >",
      "<img src=\"b\" < img src='' class/>",
      "<img src=\"b\" < img src='' class />",
      "<img src=\"b\" < img src='' class=>",
      "<img src=\"b\" < img src='' class= >",
      "<img src=\"b\" < img src='' class=/>",
      "<img src=\"b\" < img src='' class= />",
      "<img src=\"b\" < img src='' class=''>",
      "<img src=\"b\" < img src='' class='' >",
      '<img src="b" < img src=\'\' class="">',
      '<img src="b" < img src=\'\' class="" >',
      "<img src=\"b\" < img src='' class=''/>",
      "<img src=\"b\" < img src='' class='' />",
      '<img src="b" < img src=\'\' class="" />',
      '<img src="b" < img src=\'\' class="" / >',
      "<img src=\"b\" < img src='' class='' / >",
      '<img src="b" < img src=\'\' class="z">',
      '<img src="b" < img src=\'\' class="z" >',
      '<img src="b" < img src=\'\' class="z"/>',
      '<img src="b" < img src=\'\' class="z" />',
      '<img src="b" < img src=\'\' class="z" / >',
      //            ^
      //          idx 13
    ].forEach((str) => {
      ok(
        isOpening(str, 13, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 13`,
      );
    });
  });
});

test.run();
