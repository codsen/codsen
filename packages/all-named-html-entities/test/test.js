import test from "ava";
import {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength
} from "../dist/all-named-html-entities.esm";

test(`01 - entStartsWith is set`, t => {
  t.true(entStartsWith.A.E[0] === "AElig");
  t.true(entStartsWith.A.E[1] === undefined);
});

test(`02 - entStartsWithCaseInsensitive is set`, t => {
  // it's not a real entity:
  t.true(entStartsWithCaseInsensitive.a.e[0] === "aelig");
  t.true(entStartsWithCaseInsensitive.a.e[1] === undefined);
});

test(`03 - entEndsWith is set`, t => {
  t.true(entEndsWith["1"].p[0] === "sup1");
  t.true(entEndsWith["1"].p[1] === undefined);
});

test(`04 - entEndsWithCaseInsensitive is set`, t => {
  t.true(entEndsWithCaseInsensitive["u"].m[0] === "mu");
  t.true(entEndsWithCaseInsensitive["u"].m[1] === undefined);
  t.true(entEndsWithCaseInsensitive["U"] === undefined);
});

test(`05 - decode throws if a non-entity is given`, t => {
  const error1 = t.throws(() => {
    decode("zzz");
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test(`06 - decode existing`, t => {
  t.is(decode("&aleph;"), "\u2135");
});

test(`07 - decode non-existing`, t => {
  t.is(decode("&lsdjhfkhgjd;"), null);
});

test(`08 - decode numeric`, t => {
  // &#x2135; is &aleph; only numeric version of it
  t.is(decode("&#x2135;"), null);
});

test(`09 - brokenNamedEntities.json is OK`, t => {
  // t.true(typeof brokenNamedEntities === "object");
  // t.true(Object.keys(brokenNamedEntities).length > 0);
  Object.keys(brokenNamedEntities).forEach((oneOfEntities, i) => {
    // 1. ensure all are keys unique:
    Object.keys(brokenNamedEntities).forEach((entity, y) =>
      t.true(
        !(entity === oneOfEntities && i !== y),
        `key "${oneOfEntities}" is not unique`
      )
    );

    // 2. ensure "oneOfEntities" is not used by any keys:
    Object.keys(brokenNamedEntities).forEach(entity =>
      t.true(
        entity !== brokenNamedEntities[oneOfEntities],
        `value "${brokenNamedEntities[oneOfEntities]}" is used among key names`
      )
    );
  });
});

test(`10 - minLength is numeric`, t => {
  t.true(Number.isInteger(minLength));
  t.true(minLength > 0);
});

test(`11 - maxLength is numeric`, t => {
  t.true(Number.isInteger(maxLength));
  t.true(maxLength > 0);
});

test(`12 - allNamedEntities checks`, t => {
  t.true(Object.keys(allNamedEntities).length > 0);
});
