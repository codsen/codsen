import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// https://github.com/codsen/codsen/issues/17
test("01", () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"> b', opt).res,
      'a <mj-image src="foo.jpg"> b',
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"> b', opt).res,
      "a b",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("02", () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"></mj-image> b', opt).res,
      'a <mj-image src="foo.jpg"></mj-image> b',
      JSON.stringify(opt, null, 4),
    );
  });
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"></mj-image> b', opt).res,
      "a b",
      JSON.stringify(opt, null, 4),
    );
  });
});

test.run();
