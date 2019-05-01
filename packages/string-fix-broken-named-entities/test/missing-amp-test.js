import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";
import allEntities from "../node_modules/all-named-html-entities/src/allNamedEntities.json";
import { decode, uncertain } from "all-named-html-entities";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`${
  Object.keys(allEntities).length
} - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`, t => {
  Object.keys(allEntities)
    .filter(entity => entity !== "nbsp" && !uncertain.includes(entity))
    .forEach((singleEntity, i, arr) => {
      //
      // ampersand missing, isolated:
      //
      t.deepEqual(
        fix(`${singleEntity};`, {
          cb: obj => obj
        }),
        [
          {
            ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
            entityName: singleEntity,
            rangeFrom: 0,
            rangeTo: singleEntity.length + 1,
            rangeValEncoded: `&${singleEntity};`,
            rangeValDecoded: decode(`&${singleEntity};`)
          }
        ],
        `${singleEntity} - 01; ${i + 1}/${arr.length}`
      );
    });
});
