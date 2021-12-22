import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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

test(`01 - entStartsWith is set`, () => {
  equal(entStartsWith.A.E[0], "AElig", "01.01");
  equal(entStartsWith.A.E[1], undefined, "01.02");
});

test(`02 - entStartsWithCaseInsensitive is set`, () => {
  // it's not a real entity:
  equal(entStartsWithCaseInsensitive.a.e[0], "aelig", "02.01");
  equal(entStartsWithCaseInsensitive.a.e[1], undefined, "02.02");
});

test(`03 - entEndsWith is set`, () => {
  equal(entEndsWith["1"].p[0], "sup1", "03.01");
  equal(entEndsWith["1"].p[1], undefined, "03.02");
});

test(`04 - entEndsWithCaseInsensitive is set`, () => {
  equal(entEndsWithCaseInsensitive.u.m[0], "mu", "04.01");
  equal(entEndsWithCaseInsensitive.u.m[1], undefined, "04.02");
  equal(entEndsWithCaseInsensitive.U, undefined, "04.03");
});

test(`05 - decode throws if a non-entity is given`, () => {
  throws(() => decode("zzz"), /THROW_ID_01/);
});

test(`06 - decode existing`, () => {
  equal(decode("&aleph;"), "\u2135");
});

test(`07 - decode non-existing`, () => {
  equal(decode("&lsdjhfkhgjd;"), null);
});

test(`08 - decode numeric`, () => {
  // &#x2135; is &aleph; only numeric version of it
  equal(decode("&#x2135;"), null);
});

test(`09 - brokenNamedEntities.json is OK`, () => {
  type(brokenNamedEntities, "object", "09.01");
  ok(Object.keys(brokenNamedEntities).length);
  Object.keys(brokenNamedEntities).forEach((oneOfEntities, i) => {
    // 1. ensure all are keys unique:
    Object.keys(brokenNamedEntities).forEach((entity, y) =>
      ok(
        !(entity === oneOfEntities && i !== y),
        `key "${oneOfEntities}" is not unique`
      )
    );

    // 2. ensure "oneOfEntities" is not used by any keys:
    Object.keys(brokenNamedEntities).forEach((entity) =>
      ok(
        entity !== brokenNamedEntities[oneOfEntities],
        `value "${brokenNamedEntities[oneOfEntities]}" is used among key names`
      )
    );
  });
});

test(`10 - minLength is numeric`, () => {
  ok(Number.isInteger(minLength));
  ok(minLength);
});

test(`11 - maxLength is numeric`, () => {
  ok(Number.isInteger(maxLength));
  ok(maxLength > 0);
});

test(`12 - allNamedEntities checks`, () => {
  ok(Object.keys(allNamedEntities).length);
});

test(`13 - uncertain list is set`, () => {
  ok(uncertain.Alpha);
  ok(uncertain.alpha);
  ok(uncertain.amp);
  ok(uncertain.And);
  ok(uncertain.and);
});

test(`14 - allNamedEntitiesSetOnly is exported and is a set`, () => {
  type(allNamedEntitiesSetOnly, "object");
  equal(allNamedEntitiesSetOnly.size, 2125);
});

test(`15 - allNamedEntitiesSetOnlyCaseInsensitive is exported and is a set`, () => {
  type(allNamedEntitiesSetOnlyCaseInsensitive, "object");
  equal(allNamedEntitiesSetOnlyCaseInsensitive.size, 1722);
});

test.run();
