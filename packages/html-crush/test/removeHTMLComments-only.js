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
test(`01.00 - outlook "only" type, tight`, () => {
  let source = `<!--[if mso]><img src="fallback"/><![endif]-->`;
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
test(`01.01 - outlook "only" type, tight`, () => {
  let source = `<!--[if mso]><img src="fallback"/><![endif]-->`;
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
// eslint-disable-next-line test-num/correct-test-num
test(`01.02 - outlook "only" type, tight`, () => {
  let source = `<!--[if mso]><img src="fallback"/><![endif]-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `<img src="fallback"/>`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 13],
    [34, 46],
  ]);
});

// removeHTMLComments=0 - off
test(`02.00 - outlook "only" type, spaced`, () => {
  let source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });
  equal(result, `<!--[if mso]><img src="fallback"/><![endif]-->`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 2],
    [15, 17],
    [38, 40],
    [52, 54],
  ]);
});

// removeHTMLComments=1 - only text comments
test(`02.01 - outlook "only" type, spaced`, () => {
  let source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, `<!--[if mso]><img src="fallback"/><![endif]-->`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 2],
    [15, 17],
    [38, 40],
    [52, 54],
  ]);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`02.02 - outlook "only" type, spaced`, () => {
  let source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `<img src="fallback"/>`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 17],
    [38, 54],
  ]);
});

// removeHTMLComments=0 - off
test(`03.00 - stray opening only`, () => {
  let source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;
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
test(`03.01 - stray opening only`, () => {
  let source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;
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
test(`03.02 - stray opening only`, () => {
  let source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, `abc\n\ndef`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[4, 30]]);
});

test.run();
