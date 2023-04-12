import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { decode, allNamedEntities } from "all-named-html-entities";

import fix from "./util/util.js";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`${
  Object.keys(allNamedEntities).length
} - ${`\u001b[${36}m${"programmatic tests"}\u001b[${39}m`}`, () => {
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
        `${singleEntity} - 05; ${i + 1}/${arr.length}`
      );
    });
});

test(`02 - ${`\u001b[${36}m${"decode"}\u001b[${39}m`} - one of entities`, () => {
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
    "02.01"
  );
  equal(gathered, [], "02.02");
});

test.run();
