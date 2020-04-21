import tap from "tap";
import {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain,
} from "../dist/all-named-html-entities.umd";

tap.test(`01 - entStartsWith is set`, (t) => {
  t.ok(entStartsWith.A.E[0] === "AElig");
  t.ok(entStartsWith.A.E[1] === undefined);
  t.end();
});

tap.test(`02 - entStartsWithCaseInsensitive is set`, (t) => {
  // it's not a real entity:
  t.ok(entStartsWithCaseInsensitive.a.e[0] === "aelig");
  t.ok(entStartsWithCaseInsensitive.a.e[1] === undefined);
  t.end();
});

tap.test(`03 - entEndsWith is set`, (t) => {
  t.ok(entEndsWith["1"].p[0] === "sup1");
  t.ok(entEndsWith["1"].p[1] === undefined);
  t.end();
});

tap.test(`04 - entEndsWithCaseInsensitive is set`, (t) => {
  t.ok(entEndsWithCaseInsensitive.u.m[0] === "mu");
  t.ok(entEndsWithCaseInsensitive.u.m[1] === undefined);
  t.ok(entEndsWithCaseInsensitive.U === undefined);
  t.end();
});

tap.test(`05 - decode throws if a non-entity is given`, (t) => {
  t.throws(() => {
    decode("zzz");
  }, /THROW_ID_01/g);
  t.end();
});

tap.test(`06 - decode existing`, (t) => {
  t.equal(decode("&aleph;"), "\u2135");
  t.end();
});

tap.test(`07 - decode non-existing`, (t) => {
  t.equal(decode("&lsdjhfkhgjd;"), null);
  t.end();
});

tap.test(`08 - decode numeric`, (t) => {
  // &#x2135; is &aleph; only numeric version of it
  t.equal(decode("&#x2135;"), null);
  t.end();
});

tap.test(`09 - brokenNamedEntities.json is OK`, (t) => {
  t.ok(typeof brokenNamedEntities === "object");
  t.ok(Object.keys(brokenNamedEntities).length > 0);
  Object.keys(brokenNamedEntities).forEach((oneOfEntities, i) => {
    // 1. ensure all are keys unique:
    Object.keys(brokenNamedEntities).forEach((entity, y) =>
      t.ok(
        !(entity === oneOfEntities && i !== y),
        `key "${oneOfEntities}" is not unique`
      )
    );

    // 2. ensure "oneOfEntities" is not used by any keys:
    Object.keys(brokenNamedEntities).forEach((entity) =>
      t.ok(
        entity !== brokenNamedEntities[oneOfEntities],
        `value "${brokenNamedEntities[oneOfEntities]}" is used among key names`
      )
    );
  });
  t.end();
});

tap.test(`10 - minLength is numeric`, (t) => {
  t.ok(Number.isInteger(minLength));
  t.ok(minLength > 0);
  t.end();
});

tap.test(`11 - maxLength is numeric`, (t) => {
  t.ok(Number.isInteger(maxLength));
  t.ok(maxLength > 0);
  t.end();
});

tap.test(`12 - allNamedEntities checks`, (t) => {
  t.ok(Object.keys(allNamedEntities).length > 0);
  t.end();
});

tap.test(`13 - uncertain list is set`, (t) => {
  t.ok(!!uncertain.Alpha);
  t.ok(!!uncertain.alpha);
  t.ok(!!uncertain.amp);
  t.ok(!!uncertain.And);
  t.ok(!!uncertain.and);
  t.end();
});
