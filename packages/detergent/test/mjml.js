// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// https://github.com/codsen/codsen/issues/17
test("001", () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"> b', opt).res,
      'a <mj-image src="foo.jpg"> b',
      `001.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"> b', opt).res,
      "a b",
      `001.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("002", () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"></mj-image> b', opt).res,
      'a <mj-image src="foo.jpg"></mj-image> b',
      `002.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a <mj-image src="foo.jpg"></mj-image> b', opt).res,
      "a b",
      `002.02 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.run();
