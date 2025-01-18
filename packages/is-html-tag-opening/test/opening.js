import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";
import { mixer } from "./util/util.js";

// opening tag
// -----------------------------------------------------------------------------

test("01 - recognised opening tag", () => {
  [
    // opening
    "<a>",
    "<p>",
    "<img>",
    "<img alt>",
    "<img alt=>",
    '<img alt=">',
    '<img alt="">',
    '<img alt="z">',
    '<img alt="zz">',
    "<img alt='>",
    "<img alt=''>",
    "<img alt='z'>",

    // self closing
    "<a/>",
    "<p/>",
    "<img/>",
    "<img alt/>",
    "<img alt=/>",
    '<img alt="/>',
    '<img alt=""/>',
    '<img alt="z"/>',
    '<img alt="zz"/>',
    "<img alt='/>",
    "<img alt=''/>",
    "<img alt='z'/>",

    // boolean attributes
    "<td nowrap>",
    "<td nowrap nowrap>",
    '<td class="a" nowrap>',
    '<td class="a" nowrap nowrap>',
    '<td class="a" nowrap nowrap nowrap>',
    '<td nowrap class="a">',
    '<td nowrap nowrap class="a">',
    '<td nowrap nowrap nowrap class="a">',
    "<td nowrap/>",
    "<td nowrap nowrap/>",
    '<td class="a" nowrap/>',
    '<td class="a" nowrap nowrap/>',
    '<td class="a" nowrap nowrap nowrap/>',
    '<td nowrap class="a"/>',
    '<td nowrap nowrap class="a"/>',
    '<td nowrap nowrap nowrap class="a"/>',

    // mismatching quote pairs
    "<img alt=\"'>",
    "<img alt='\">",
    "<img alt=\"z'>",
    "<img alt='z\">",
    "<img alt=\"'/>",
    "<img alt='\"/>",
    "<img alt=\"z'/>",
    "<img alt='z\"/>",
  ].forEach((str) => {
    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
  });
});

test("02 - recognised closing tag", () => {
  [
    "</a>",
    "</a >",
    "</ a>",
    "</ a >",
    "</p>",
    "</p >",
    "</ p>",
    "</ p >",
    "</a/>",
    "</a />",
    "</ a/>",
    "</ a />",
    "</img>",
    "</img/>",
    "</ img/>",
    "</ img />",
    "</img alt>",
    "</img alt >",
    "</img alt=>",
    "</img alt= >",
    '</img alt=">',
    '</img alt=" >',
    '</img alt="">',
    '</img alt="" >',
    '</img alt="z">',
    '</img alt="z" >',
    '</img alt="zz">',
    '</img alt="zz" >',
    "</img alt='>",
    "</img alt=' >",
    "</img alt=''>",
    "</img alt='' >",
    "</img alt='z'>",
    "</img alt='z' >",

    // boolean attributes
    "</td nowrap>",
    "</td nowrap >",
    "</td nowrap nowrap>",
    "</td nowrap nowrap >",
    '</td class="a" nowrap>',
    '</td class="a" nowrap >',
    '</td class="a" nowrap nowrap>',
    '</td class="a" nowrap nowrap >',
    '</td class="a" nowrap nowrap nowrap>',
    '</td class="a" nowrap nowrap nowrap >',
    "</td class='a' nowrap>",
    "</td class='a' nowrap >",
    "</td class='a' nowrap nowrap>",
    "</td class='a' nowrap nowrap >",
    "</td class='a' nowrap nowrap nowrap>",
    "</td class='a' nowrap nowrap nowrap >",

    '</td nowrap class="a">',
    '</td nowrap class="a" >',
    '</td nowrap nowrap class="a">',
    '</td nowrap nowrap class="a" >',
    '</td nowrap nowrap nowrap class="a">',
    '</td nowrap nowrap nowrap class="a" >',
    "</td nowrap class='a'>",
    "</td nowrap class='a' >",
    "</td nowrap nowrap class='a'>",
    "</td nowrap nowrap class='a' >",
    "</td nowrap nowrap nowrap class='a'>",
    "</td nowrap nowrap nowrap class='a' >",

    // mismatching quote pairs
    "</img alt=\"'>",
    "</img alt='\">",
    "</img alt=\"z'>",
    "</img alt='z\">",
  ].forEach((str) => {
    mixer().forEach((opt) => {
      ok(
        isOpening(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`,
      );
    });
    mixer().forEach((opt) => {
      ok(
        isOpening(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`,
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`,
      );
    });
  });
});

test("03 - unrecognised opening tag", () => {
  [
    "<x>",
    "<xy>",

    // recognised attr name
    "<xy alt>",
    "<xy alt=>",
    '<xy alt=">',
    '<xy alt="">',
    '<xy alt="z">',
    '<xy alt="zz">',
    "<xy alt='>",
    "<xy alt=''>",
    "<xy alt='z'>",

    // unrecognised attr name
    "<xy klm>",
    "<xy klm=>",
    '<xy klm=">',
    '<xy klm="">',
    '<xy klm="z">',
    '<xy klm="zz">',
    "<xy klm='>",
    "<xy klm=''>",
    "<xy klm='z'>",

    // boolean attributes
    "<xy nowrap>",
    "<xy nowrap nowrap>",
    '<xy class="a" nowrap>',
    '<xy class="a" nowrap nowrap>',
    '<xy class="a" nowrap nowrap nowrap>',
    '<xy nowrap class="a">',
    '<xy nowrap nowrap class="a">',
    '<xy nowrap nowrap nowrap class="a">',

    // mismatching quote pairs, recognised attr name
    "<xy alt=\"'>",
    "<xy alt='\">",
    "<xy alt=\"z'>",
    "<xy alt='z\">",

    // mismatching quote pairs, unrecognised attr name
    "<xy alt=\"'>",
    "<xy alt='\">",
    "<xy alt=\"z'>",
    "<xy alt='z\">",
  ].forEach((str) => {
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`,
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`,
      );
    });
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
  });
});

test("04 - unrecognised closing tag", () => {
  [
    "</x>",
    "</xy>",

    // recognised attr name
    "</xy alt>",
    "</xy alt=>",
    '</xy alt=">',
    '</xy alt="">',
    '</xy alt="z">',
    '</xy alt="zz">',
    "</xy alt='>",
    "</xy alt=''>",
    "</xy alt='z'>",

    // unrecognised attr name
    "</xy klm>",
    "</xy klm=>",
    '</xy klm=">',
    '</xy klm="">',
    '</xy klm="z">',
    '</xy klm="zz">',
    "</xy klm='>",
    "</xy klm=''>",
    "</xy klm='z'>",

    // boolean attributes
    "</xy nowrap>",
    "</xy nowrap nowrap>",
    '</xy class="a" nowrap>',
    '</xy class="a" nowrap nowrap>',
    '</xy class="a" nowrap nowrap nowrap>',
    '</xy nowrap class="a">',
    '</xy nowrap nowrap class="a">',
    '</xy nowrap nowrap nowrap class="a">',

    // mismatching quote pairs, recognised attr name
    "</xy alt=\"'>",
    "</xy alt='\">",
    "</xy alt=\"z'>",
    "</xy alt='z\">",

    // mismatching quote pairs, unrecognised attr name
    "</xy alt=\"'>",
    "</xy alt='\">",
    "</xy alt=\"z'>",
    "</xy alt='z\">",
  ].forEach((str) => {
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`,
      );
    });
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`,
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });
    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`,
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`,
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      not.ok(
        isOpening(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`,
      );
    });
    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      ok(
        isOpening(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`,
      );
    });
  });
});

test("05", () => {
  let str = '<html dir="ltr">';
  mixer().forEach((opt) => {
    ok(isOpening(str, 0, opt), opt);
  });
  mixer().forEach((opt) => {
    not.ok(isOpening(str, 6, opt), opt);
  });
});

test("06", () => {
  let str = '<img alt="click here >">';
  mixer().forEach((opt) => {
    ok(isOpening(str, 0, opt), opt);
  });
  mixer().forEach((opt) => {
    not.ok(isOpening(str, 5, opt), opt);
  });

  let str2 = str + str;
  mixer().forEach((opt) => {
    ok(isOpening(str2, str.length + 0, opt), opt);
  });
  mixer().forEach((opt) => {
    not.ok(isOpening(str2, str.length + 5, opt), opt);
  });
});

test("07", () => {
  let str = '<img alt="< click here">';
  mixer().forEach((opt) => {
    ok(isOpening(str, 0, opt), opt);
  });
  mixer().forEach((opt) => {
    not.ok(isOpening(str, 5, opt), opt);
  });
  mixer().forEach((opt) => {
    not.ok(isOpening(str, 10, opt), opt);
  });
});

test.run();
