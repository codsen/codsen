import test from "ava";
import {
  // all,
  entStartsWith,
  entEndsWith,
  decode
} from "../dist/all-named-html-entities.esm";

// test(`all is an array`, t => {
//   t.true(Array.isArray(all));
// });
//
// test(`all length is more than 2000`, t => {
//   t.true(all.length > 2000);
// });

test(`entStartsWith is set`, t => {
  t.true(entStartsWith.A.E[0] === "AElig");
  t.true(entStartsWith.A.E[1] === undefined);
});

test(`endsWith is set`, t => {
  t.true(entEndsWith["1"].p[0] === "sup1");
  t.true(entEndsWith["1"].p[1] === undefined);
});

test(`decode throws if a non-entity is given`, t => {
  const error1 = t.throws(() => {
    decode("zzz");
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test(`decode existing`, t => {
  t.is(decode("&aleph;"), "\u2135");
});

test(`decode non-existing`, t => {
  t.is(decode("&lsdjhfkhgjd;"), null);
});

test(`decode numeric`, t => {
  // &#x2135; is &aleph; only numeric version of it
  t.is(decode("&#x2135;"), null);
});
