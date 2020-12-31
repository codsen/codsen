import tap from "tap";
import { isOpening as is } from "../dist/is-html-tag-opening.esm";
import { mixer } from "./util/util";

// opening tag
// -----------------------------------------------------------------------------

tap.test(`01 - recognised opening tag`, (t) => {
  [
    // opening
    `<a>`,
    `<p>`,
    `<img>`,
    `<img alt>`,
    `<img alt=>`,
    `<img alt=">`,
    `<img alt="">`,
    `<img alt="z">`,
    `<img alt="zz">`,
    `<img alt='>`,
    `<img alt=''>`,
    `<img alt='z'>`,

    // self closing
    `<a/>`,
    `<p/>`,
    `<img/>`,
    `<img alt/>`,
    `<img alt=/>`,
    `<img alt="/>`,
    `<img alt=""/>`,
    `<img alt="z"/>`,
    `<img alt="zz"/>`,
    `<img alt='/>`,
    `<img alt=''/>`,
    `<img alt='z'/>`,

    // boolean attributes
    `<td nowrap>`,
    `<td nowrap nowrap>`,
    `<td class="a" nowrap>`,
    `<td class="a" nowrap nowrap>`,
    `<td class="a" nowrap nowrap nowrap>`,
    `<td nowrap class="a">`,
    `<td nowrap nowrap class="a">`,
    `<td nowrap nowrap nowrap class="a">`,
    `<td nowrap/>`,
    `<td nowrap nowrap/>`,
    `<td class="a" nowrap/>`,
    `<td class="a" nowrap nowrap/>`,
    `<td class="a" nowrap nowrap nowrap/>`,
    `<td nowrap class="a"/>`,
    `<td nowrap nowrap class="a"/>`,
    `<td nowrap nowrap nowrap class="a"/>`,

    // mismatching quote pairs
    `<img alt="'>`,
    `<img alt='">`,
    `<img alt="z'>`,
    `<img alt='z">`,
    `<img alt="'/>`,
    `<img alt='"/>`,
    `<img alt="z'/>`,
    `<img alt='z"/>`,
  ].forEach((str) => {
    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
  });
  t.end();
});

tap.test(`02 - recognised closing tag`, (t) => {
  [
    `</a>`,
    `</a >`,
    `</ a>`,
    `</ a >`,
    `</p>`,
    `</p >`,
    `</ p>`,
    `</ p >`,
    `</a/>`,
    `</a />`,
    `</ a/>`,
    `</ a />`,
    `</img>`,
    `</img/>`,
    `</ img/>`,
    `</ img />`,
    `</img alt>`,
    `</img alt >`,
    `</img alt=>`,
    `</img alt= >`,
    `</img alt=">`,
    `</img alt=" >`,
    `</img alt="">`,
    `</img alt="" >`,
    `</img alt="z">`,
    `</img alt="z" >`,
    `</img alt="zz">`,
    `</img alt="zz" >`,
    `</img alt='>`,
    `</img alt=' >`,
    `</img alt=''>`,
    `</img alt='' >`,
    `</img alt='z'>`,
    `</img alt='z' >`,

    // boolean attributes
    `</td nowrap>`,
    `</td nowrap >`,
    `</td nowrap nowrap>`,
    `</td nowrap nowrap >`,
    `</td class="a" nowrap>`,
    `</td class="a" nowrap >`,
    `</td class="a" nowrap nowrap>`,
    `</td class="a" nowrap nowrap >`,
    `</td class="a" nowrap nowrap nowrap>`,
    `</td class="a" nowrap nowrap nowrap >`,
    `</td class='a' nowrap>`,
    `</td class='a' nowrap >`,
    `</td class='a' nowrap nowrap>`,
    `</td class='a' nowrap nowrap >`,
    `</td class='a' nowrap nowrap nowrap>`,
    `</td class='a' nowrap nowrap nowrap >`,

    `</td nowrap class="a">`,
    `</td nowrap class="a" >`,
    `</td nowrap nowrap class="a">`,
    `</td nowrap nowrap class="a" >`,
    `</td nowrap nowrap nowrap class="a">`,
    `</td nowrap nowrap nowrap class="a" >`,
    `</td nowrap class='a'>`,
    `</td nowrap class='a' >`,
    `</td nowrap nowrap class='a'>`,
    `</td nowrap nowrap class='a' >`,
    `</td nowrap nowrap nowrap class='a'>`,
    `</td nowrap nowrap nowrap class='a' >`,

    // mismatching quote pairs
    `</img alt="'>`,
    `</img alt='">`,
    `</img alt="z'>`,
    `</img alt='z">`,
  ].forEach((str) => {
    mixer().forEach((opt) => {
      t.true(
        is(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`
      );
    });
    mixer().forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`
      );
    });
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`
      );
    });
  });
  t.end();
});

tap.test(`03 - unrecognised opening tag`, (t) => {
  [
    `<x>`,
    `<xy>`,

    // recognised attr name
    `<xy alt>`,
    `<xy alt=>`,
    `<xy alt=">`,
    `<xy alt="">`,
    `<xy alt="z">`,
    `<xy alt="zz">`,
    `<xy alt='>`,
    `<xy alt=''>`,
    `<xy alt='z'>`,

    // unrecognised attr name
    `<xy klm>`,
    `<xy klm=>`,
    `<xy klm=">`,
    `<xy klm="">`,
    `<xy klm="z">`,
    `<xy klm="zz">`,
    `<xy klm='>`,
    `<xy klm=''>`,
    `<xy klm='z'>`,

    // boolean attributes
    `<xy nowrap>`,
    `<xy nowrap nowrap>`,
    `<xy class="a" nowrap>`,
    `<xy class="a" nowrap nowrap>`,
    `<xy class="a" nowrap nowrap nowrap>`,
    `<xy nowrap class="a">`,
    `<xy nowrap nowrap class="a">`,
    `<xy nowrap nowrap nowrap class="a">`,

    // mismatching quote pairs, recognised attr name
    `<xy alt="'>`,
    `<xy alt='">`,
    `<xy alt="z'>`,
    `<xy alt='z">`,

    // mismatching quote pairs, unrecognised attr name
    `<xy alt="'>`,
    `<xy alt='">`,
    `<xy alt="z'>`,
    `<xy alt='z">`,
  ].forEach((str) => {
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      t.true(
        is(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`
      );
    });
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
  });
  t.end();
});

tap.test(`04 - unrecognised closing tag`, (t) => {
  [
    `</x>`,
    `</xy>`,

    // recognised attr name
    `</xy alt>`,
    `</xy alt=>`,
    `</xy alt=">`,
    `</xy alt="">`,
    `</xy alt="z">`,
    `</xy alt="zz">`,
    `</xy alt='>`,
    `</xy alt=''>`,
    `</xy alt='z'>`,

    // unrecognised attr name
    `</xy klm>`,
    `</xy klm=>`,
    `</xy klm=">`,
    `</xy klm="">`,
    `</xy klm="z">`,
    `</xy klm="zz">`,
    `</xy klm='>`,
    `</xy klm=''>`,
    `</xy klm='z'>`,

    // boolean attributes
    `</xy nowrap>`,
    `</xy nowrap nowrap>`,
    `</xy class="a" nowrap>`,
    `</xy class="a" nowrap nowrap>`,
    `</xy class="a" nowrap nowrap nowrap>`,
    `</xy nowrap class="a">`,
    `</xy nowrap nowrap class="a">`,
    `</xy nowrap nowrap nowrap class="a">`,

    // mismatching quote pairs, recognised attr name
    `</xy alt="'>`,
    `</xy alt='">`,
    `</xy alt="z'>`,
    `</xy alt='z">`,

    // mismatching quote pairs, unrecognised attr name
    `</xy alt="'>`,
    `</xy alt='">`,
    `</xy alt="z'>`,
    `</xy alt='z">`,
  ].forEach((str) => {
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      t.true(
        is(str, undefined, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = undefined`
      );
    });
    mixer({
      allowCustomTagNames: true,
    }).forEach((opt) => {
      t.true(
        is(str, 0, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 0`
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });
    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 1, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 1`
      );
    });

    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`
      );
    });
    mixer({
      allowCustomTagNames: false,
    }).forEach((opt) => {
      t.false(
        is(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`
      );
    });
    mixer({
      allowCustomTagNames: true,
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(str, 2, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 2`
      );
    });
  });
  t.end();
});

tap.test(`05`, (t) => {
  const str = `<html dir="ltr">`;
  mixer().forEach((opt) => {
    t.true(is(str, 0, opt), opt);
  });
  mixer().forEach((opt) => {
    t.false(is(str, 6, opt), opt);
  });
  t.end();
});

tap.test(`06`, (t) => {
  const str = `<img alt="click here >">`;
  mixer().forEach((opt) => {
    t.true(is(str, 0, opt), opt);
  });
  mixer().forEach((opt) => {
    t.false(is(str, 5, opt), opt);
  });

  const str2 = str + str;
  mixer().forEach((opt) => {
    t.true(is(str2, str.length + 0, opt), opt);
  });
  mixer().forEach((opt) => {
    t.false(is(str2, str.length + 5, opt), opt);
  });

  t.end();
});

tap.test(`07`, (t) => {
  const str = `<img alt="< click here">`;
  mixer().forEach((opt) => {
    t.true(is(str, 0, opt), opt);
  });
  mixer().forEach((opt) => {
    t.false(is(str, 5, opt), opt);
  });
  mixer().forEach((opt) => {
    t.false(is(str, 10, opt), opt);
  });
  t.end();
});
