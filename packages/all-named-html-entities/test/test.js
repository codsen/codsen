import tap from "tap";
import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain,
} from "../dist/all-named-html-entities.esm.js";

tap.test(`01 - entStartsWith is set`, (t) => {
  t.ok(entStartsWith.A.E[0] === "AElig", "01.01");
  t.ok(entStartsWith.A.E[1] === undefined, "01.02");
  t.end();
});

tap.test(`02 - entStartsWithCaseInsensitive is set`, (t) => {
  // it's not a real entity:
  t.ok(entStartsWithCaseInsensitive.a.e[0] === "aelig", "02.01");
  t.ok(entStartsWithCaseInsensitive.a.e[1] === undefined, "02.02");
  t.end();
});

tap.test(`03 - entEndsWith is set`, (t) => {
  t.ok(entEndsWith["1"].p[0] === "sup1", "03.01");
  t.ok(entEndsWith["1"].p[1] === undefined, "03.02");
  t.end();
});

tap.test(`04 - entEndsWithCaseInsensitive is set`, (t) => {
  t.ok(entEndsWithCaseInsensitive.u.m[0] === "mu", "04.01");
  t.ok(entEndsWithCaseInsensitive.u.m[1] === undefined, "04.02");
  t.ok(entEndsWithCaseInsensitive.U === undefined, "04.03");
  t.end();
});

tap.test(`05 - decode throws if a non-entity is given`, (t) => {
  t.throws(() => {
    decode("zzz");
  }, /THROW_ID_01/g);
  t.end();
});

tap.test(`06 - decode existing`, (t) => {
  t.equal(decode("&aleph;"), "\u2135", "06");
  t.end();
});

tap.test(`07 - decode non-existing`, (t) => {
  t.equal(decode("&lsdjhfkhgjd;"), null, "07");
  t.end();
});

tap.test(`08 - decode numeric`, (t) => {
  // &#x2135; is &aleph; only numeric version of it
  t.equal(decode("&#x2135;"), null, "08");
  t.end();
});

tap.test(`09 - brokenNamedEntities.json is OK`, (t) => {
  t.ok(typeof brokenNamedEntities === "object", "09.01");
  t.ok(Object.keys(brokenNamedEntities).length > 0, "09.02");
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
  t.ok(Number.isInteger(minLength), "10.01");
  t.ok(minLength > 0, "10.02");
  t.end();
});

tap.test(`11 - maxLength is numeric`, (t) => {
  t.ok(Number.isInteger(maxLength), "11.01");
  t.ok(maxLength > 0, "11.02");
  t.end();
});

tap.test(`12 - allNamedEntities checks`, (t) => {
  t.ok(Object.keys(allNamedEntities).length > 0, "12");
  t.end();
});

tap.test(`13 - uncertain list is set`, (t) => {
  t.ok(!!uncertain.Alpha, "13.01");
  t.ok(!!uncertain.alpha, "13.02");
  t.ok(!!uncertain.amp, "13.03");
  t.ok(!!uncertain.And, "13.04");
  t.ok(!!uncertain.and, "13.05");
  t.end();
});

tap.test(`14 - allNamedEntitiesSetOnly is exported and is a set`, (t) => {
  t.equal(typeof allNamedEntitiesSetOnly, "object", "14.01");
  t.equal(allNamedEntitiesSetOnly.size, 2125, "14.02");
  t.end();
});

tap.test(
  `15 - allNamedEntitiesSetOnlyCaseInsensitive is exported and is a set`,
  (t) => {
    t.equal(typeof allNamedEntitiesSetOnlyCaseInsensitive, "object", "15.01");
    t.equal(allNamedEntitiesSetOnlyCaseInsensitive.size, 1722, "15.02");
    t.end();
  }
);
