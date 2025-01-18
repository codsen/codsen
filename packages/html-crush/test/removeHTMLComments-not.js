import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// outlook "not" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

// removeHTMLComments=0 - off
test('01 - outlook "not" type, tight', () => {
  let source = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
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
    "01.02",
  );
  equal(ranges, null, "01.03");
});

// removeHTMLComments=1 - only text comments
test('02 - outlook "not" type, tight', () => {
  let source = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
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
    "02.02",
  );
  equal(ranges, null, "02.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
test('03 - outlook "not" type, tight', () => {
  let source = '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->';
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, '<img src="gif"/>', "03.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "03.02",
  );
  equal(
    ranges,
    [
      [0, 19],
      [35, 51],
    ],
    "03.03",
  );
});

// removeHTMLComments=0 - off
test('04 - outlook "not" type, spaced', () => {
  let source = '  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->';
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->', "04.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "04.02",
  );
  equal(
    ranges,
    [
      [0, 2],
      [16, 18],
      [23, 25],
      [41, 43],
    ],
    "04.03",
  );
});

// removeHTMLComments=1 - only text comments
test('05 - outlook "not" type, spaced', () => {
  let source = '  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->';
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, '<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->', "05.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "05.02",
  );
  equal(
    ranges,
    [
      [0, 2],
      [16, 18],
      [23, 25],
      [41, 43],
    ],
    "05.03",
  );
});

// removeHTMLComments=2 - includes outlook conditional comments
test('06 - outlook "not" type, spaced', () => {
  let source = '  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->';
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, '<img src="gif"/>', "06.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "06.02",
  );
  equal(
    ranges,
    [
      [0, 25],
      [41, 59],
    ],
    "06.03",
  );
});

test.run();
