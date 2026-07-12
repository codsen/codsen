// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { allNamedEntities, decode } from "all-named-html-entities";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import fix from "./util/util.js";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`01 - ${`${
  Object.keys(allNamedEntities).length
} - ${`\u001b[${36}m${"programmatic tests"}\u001b[${39}m`}`}`, () => {
  Object.keys(allNamedEntities)
    .filter((entity) => entity !== "nbsp")
    .forEach((singleEntity, i, arr) => {
      //
      // healthy entity but decode requested:
      //
      equal(
        fix(ok, `&${singleEntity};`, {
          decode: true,
          cb: (obj) => obj,
        }),
        [
          {
            ruleName: `bad-html-entity-encoded-${singleEntity}`,
            entityName: singleEntity,
            rangeFrom: 0,
            rangeTo: singleEntity.length + 2,
            rangeValEncoded: `&${singleEntity};`,
            rangeValDecoded: decode(`&${singleEntity};`),
          },
        ],
        `01.01 - ${`${singleEntity} - 05; ${i + 1}/${arr.length}`}`,
      );
    });
});

test(`02 - decode - one of entities`, () => {
  let gathered = [];
  equal(
    fix(ok, "&EmptyVerySmallSquare;", {
      decode: true,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-EmptyVerySmallSquare",
        entityName: "EmptyVerySmallSquare",
        rangeFrom: 0,
        rangeTo: 22,
        rangeValEncoded: "&EmptyVerySmallSquare;",
        rangeValDecoded: decode("&EmptyVerySmallSquare;"),
      },
    ],
    "02.01",
  );
  equal(gathered, [], "02.02");
});

test.run();
