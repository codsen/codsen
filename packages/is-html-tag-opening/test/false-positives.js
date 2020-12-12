import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

// mixer generates array of all variations of options' sets
// with all possible bool flag opts keys:
import { mixer } from "./util/util";

// false positives
// -----------------------------------------------------------------------------

tap.skip("deleteme", (t) => {
  t.true(
    is(`<x src="b" a class="">`, 11, {
      allowCustomTagNames: false,
      skipOpeningBracket: false,
    }),
    "01"
  );
  t.end();
});

tap.test(
  `02 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    mixer().forEach((opt) => {
      t.false(is(`> x`, 2, opt), opt);
      //            ^
    });
    mixer().forEach((opt) => {
      t.false(is(`> b`, 2, opt), opt);
      //            ^
    });
    mixer().forEach((opt) => {
      t.false(is(`> div`, 2, opt), opt);
      //            ^
    });
    mixer().forEach((opt) => {
      t.false(is(`> div class`, 2, opt), opt);
      //            ^
    });

    // the tag name has to be recognised and attr should follow
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(is(`> div class="z"`, 2, opt), opt);
      //           ^
    });
    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(is(`> div class="z"`, 2, opt), opt);
      //            ^
    });
    t.end();
  }
);

tap.test(`03 - starting at unrecognised tag`, (t) => {
  // idx = 0
  const input = `bc img src="z"/>`;
  //             ^
  mixer({
    skipOpeningBracket: true,
    allowCustomTagNames: true,
  }).forEach((opt) => {
    t.true(is(input, 0, opt), opt);
  });
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    t.false(is(input, 0, opt), opt);
  });
  mixer({
    allowCustomTagNames: false,
  }).forEach((opt) => {
    t.false(is(input, 0, opt), opt);
  });

  t.end();
});

tap.test(`04 - starting at recognised tag`, (t) => {
  // idx = 3
  const input = `bc img src="z"/>`;
  //                ^
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    t.false(is(input, 3, opt), opt);
  });
  mixer({
    skipOpeningBracket: true,
  }).forEach((opt) => {
    t.true(is(input, 3, opt), opt);
  });

  t.end();
});

tap.test(`05`, (t) => {
  mixer({
    skipOpeningBracket: false,
  }).forEach((opt) => {
    t.false(is(`img bc src="z"/>`, 0, opt), opt);
  });
  mixer({
    skipOpeningBracket: true,
  }).forEach((opt) => {
    t.true(is(`img bc src="z"/>`, 0, opt), opt);
  });
  t.end();
});

tap.test(`06 one-letter-name recognised tag`, (t) => {
  mixer().forEach((opt) => {
    t.true(is(`<p>`, 0, opt), opt);
    //         ^
  });
  t.end();
});

tap.test(`07 one-letter-name unrecognised tag`, (t) => {
  const input = `<x>`;
  //             ^
  //           idx 0
  mixer({
    allowCustomTagNames: false,
  }).forEach((opt) => {
    t.false(is(input, 0, opt), opt);
  });
  mixer({
    allowCustomTagNames: true,
  }).forEach((opt) => {
    t.true(is(input, 0, opt), opt);
  });

  t.end();
});

tap.test(`08`, (t) => {
  [
    `<x src="b" a>`,
    `<x src="b" a >`,
    `<x src="b" a/>`,
    `<x src="b" a />`,
    `<x src="b" a/ >`,
    `<x src="b" a / >`,
    //          ^
    //        idx 11
  ].forEach((input) => {
    mixer().forEach((opt) => {
      t.false(
        is(input, 11, opt),
        `str=${input} - opt = ${JSON.stringify(opt, null, 0)} - idx = 11`
      );
    });
  });
  t.end();
});

tap.test(`09`, (t) => {
  [
    `<x src="b" a class="">`,
    `<x src="b" a class="" >`,
    `<x src="b" a class=""/>`,
    `<x src="b" a class="" />`,
    `<x src="b" a class=""/ >`,
    `<x src="b" a class="" / >`,
    //          ^
    //        idx 11
  ].forEach((input) => {
    mixer({
      skipOpeningBracket: true,
    }).forEach((opt) => {
      t.true(
        is(input, 11, opt),
        `str=${input} - opt = ${JSON.stringify(opt, null, 0)} - idx = 11`
      );
    });
    mixer({
      skipOpeningBracket: false,
    }).forEach((opt) => {
      t.false(
        is(input, 11, opt),
        `str=${input} - opt = ${JSON.stringify(opt, null, 0)} - idx = 11`
      );
    });
  });
  t.end();
});

tap.test(`10`, (t) => {
  mixer().forEach((opt) => {
    [
      `<x src="b" <a>`,
      `<x src="b" <a >`,
      `<x src="b" <a/>`,
      `<x src="b" <a />`,
      `<x src="b" <a/ >`,
      `<x src="b" <a class>`,
      `<x src="b" <a class=>`,
      `<x src="b" <a class='>`,
      `<x src="b" <a class=''>`,
      `<x src="b" <a class=''/>`,
      `<x src="b" <a class=">`,
      `<x src="b" <a class=" >`,
      `<x src="b" <a class="">`,
      `<x src="b" <a class="" >`,
      `<x src="b" <a class="z">`,
      `<x src="b" <a class="z" >`,
      `<x src="b" <a class="z" />`,
      `<x src="b" <a class="z" id>`,
      `<x src="b" <a class="z" id=>`,
      `<x src="b" <a class="z" id="">`,
      //          ^
      //        idx 11
    ].forEach((str) => {
      t.true(
        is(str, 11, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 11`
      );
    });
  });

  // but opening bracket means it's a tag, no matter what
  t.end();
});

tap.test(`11`, (t) => {
  mixer().forEach((opt) => {
    t.false(is(`<img src="b" img />`, 13, opt), opt);
  });

  // that's as far as it goes...
  // a bracket changes the whole situation:
  mixer().forEach((opt) => {
    t.true(is(`<img src="b" <img />`, 13, opt), opt);
  });

  t.end();
});

tap.test(`12 known tag name + an attribute`, (t) => {
  mixer().forEach((opt) => {
    [
      `<img src="b" <img src="" />`,
      `<img src="b" < img src="" />`,
      `<img src="b" < img src='' />`,

      `<img src="b" <img src='' class>`,
      `<img src="b" <img src='' class >`,
      `<img src="b" <img src='' class/>`,
      `<img src="b" <img src='' class />`,
      `<img src="b" <img src='' class=>`,
      `<img src="b" <img src='' class= >`,
      `<img src="b" <img src='' class=/>`,
      `<img src="b" <img src='' class= />`,
      `<img src="b" <img src='' class=''>`,
      `<img src="b" <img src='' class='' >`,
      `<img src="b" <img src='' class="">`,
      `<img src="b" <img src='' class="" >`,
      `<img src="b" <img src='' class=''/>`,
      `<img src="b" <img src='' class='' />`,
      `<img src="b" <img src='' class="" />`,
      `<img src="b" <img src='' class="" / >`,
      `<img src="b" <img src='' class='' / >`,
      `<img src="b" <img src='' class="z">`,
      `<img src="b" <img src='' class="z" >`,
      `<img src="b" <img src='' class="z"/>`,
      `<img src="b" <img src='' class="z" />`,
      `<img src="b" <img src='' class="z" / >`,

      `<img src="b" <img src=''class>`,
      `<img src="b" <img src=''class >`,
      `<img src="b" <img src=''class/>`,
      `<img src="b" <img src=''class />`,
      `<img src="b" <img src=''class=>`,
      `<img src="b" <img src=''class= >`,
      `<img src="b" <img src=''class=/>`,
      `<img src="b" <img src=''class= />`,
      `<img src="b" <img src=''class=''>`,
      `<img src="b" <img src=''class='' >`,
      `<img src="b" <img src=''class="">`,
      `<img src="b" <img src=''class="" >`,
      `<img src="b" <img src=''class=''/>`,
      `<img src="b" <img src=''class='' />`,
      `<img src="b" <img src=''class="" />`,
      `<img src="b" <img src=''class="" / >`,
      `<img src="b" <img src=''class='' / >`,
      `<img src="b" <img src=''class="z">`,
      `<img src="b" <img src=''class="z" >`,
      `<img src="b" <img src=''class="z"/>`,
      `<img src="b" <img src=''class="z" />`,
      `<img src="b" <img src=''class="z" / >`,

      `<img src="b" < img src='' class>`,
      `<img src="b" < img src='' class >`,
      `<img src="b" < img src='' class/>`,
      `<img src="b" < img src='' class />`,
      `<img src="b" < img src='' class=>`,
      `<img src="b" < img src='' class= >`,
      `<img src="b" < img src='' class=/>`,
      `<img src="b" < img src='' class= />`,
      `<img src="b" < img src='' class=''>`,
      `<img src="b" < img src='' class='' >`,
      `<img src="b" < img src='' class="">`,
      `<img src="b" < img src='' class="" >`,
      `<img src="b" < img src='' class=''/>`,
      `<img src="b" < img src='' class='' />`,
      `<img src="b" < img src='' class="" />`,
      `<img src="b" < img src='' class="" / >`,
      `<img src="b" < img src='' class='' / >`,
      `<img src="b" < img src='' class="z">`,
      `<img src="b" < img src='' class="z" >`,
      `<img src="b" < img src='' class="z"/>`,
      `<img src="b" < img src='' class="z" />`,
      `<img src="b" < img src='' class="z" / >`,
      //            ^
      //          idx 13
    ].forEach((str) => {
      t.true(
        is(str, 13, opt),
        `str=${str} - opt=${JSON.stringify(opt, null, 0)} - idx = 13`
      );
    });
  });

  t.end();
});
