import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// outlook "only" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if mso]>
//     <img src="fallback"/>
// <![endif]-->

// removeHTMLComments=0 - off
test(`01 - outlook "only" type, tight`, () => {
  let source = `<!--[if mso]><img src="fallback"/><![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, source, "01.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "01.02"
  );
  equal(ranges, null, "01.03");
});

// removeHTMLComments=1 - only text comments
test(`02 - outlook "only" type, tight`, () => {
  let source = `<!--[if mso]><img src="fallback"/><![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, source, "02.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "02.02"
  );
  equal(ranges, null, "02.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
// eslint-disable-next-line test-num/correct-test-num
test(`01.02 - outlook "only" type, tight`, () => {
  let source = `<!--[if mso]><img src="fallback"/><![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `<img src="fallback"/>`, "03.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "03.02"
  );
  equal(
    ranges,
    [
      [0, 13],
      [34, 46],
    ],
    "03.03"
  );
});

// removeHTMLComments=0 - off
test(`04 - outlook "only" type, spaced`, () => {
  let source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });
  equal(result, `<!--[if mso]><img src="fallback"/><![endif]-->`, "04.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "04.02"
  );
  equal(
    ranges,
    [
      [0, 2],
      [15, 17],
      [38, 40],
      [52, 54],
    ],
    "04.03"
  );
});

// removeHTMLComments=1 - only text comments
test(`05 - outlook "only" type, spaced`, () => {
  let source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, `<!--[if mso]><img src="fallback"/><![endif]-->`, "05.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "05.02"
  );
  equal(
    ranges,
    [
      [0, 2],
      [15, 17],
      [38, 40],
      [52, 54],
    ],
    "05.03"
  );
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`06 - outlook "only" type, spaced`, () => {
  let source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `<img src="fallback"/>`, "06.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "06.02"
  );
  equal(
    ranges,
    [
      [0, 17],
      [38, 54],
    ],
    "06.03"
  );
});

// removeHTMLComments=0 - off
test(`07 - stray opening only`, () => {
  let source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, source, "07.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "07.02"
  );
  equal(ranges, null, "07.03");
});

// removeHTMLComments=1 - only text comments
test(`08 - stray opening only`, () => {
  let source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, source, "08.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "08.02"
  );
  equal(ranges, null, "08.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`09 - stray opening only`, () => {
  let source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `abc\n\ndef`, "09.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "09.02"
  );
  equal(ranges, [[4, 30]], "09.03");
});

test.run();
