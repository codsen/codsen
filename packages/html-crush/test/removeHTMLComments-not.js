import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// outlook "not" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

// removeHTMLComments=0 - off
test(`01.00 - outlook "not" type, tight`, () => {
  let source = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, source);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, null);
});

// removeHTMLComments=1 - only text comments
test(`01.01 - outlook "not" type, tight`, () => {
  let source = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, source);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, null);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`01.02 - outlook "not" type, tight`, () => {
  let source = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `<img src="gif"/>`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 19],
    [35, 51],
  ]);
});

// removeHTMLComments=0 - off
test(`02.00 - outlook "not" type, spaced`, () => {
  let source = `  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 2],
    [16, 18],
    [23, 25],
    [41, 43],
  ]);
});

// removeHTMLComments=1 - only text comments
test(`02.01 - outlook "not" type, spaced`, () => {
  let source = `  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 2],
    [16, 18],
    [23, 25],
    [41, 43],
  ]);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`02.02 - outlook "not" type, spaced`, () => {
  let source = `  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `<img src="gif"/>`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 25],
    [41, 59],
  ]);
});

test.run();
