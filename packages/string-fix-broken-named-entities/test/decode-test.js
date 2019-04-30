import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";
import allEntities from "../node_modules/all-named-html-entities/src/allNamedEntities.json";
import { decode } from "all-named-html-entities";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`${
  Object.keys(allEntities).length
} - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`, t => {
  Object.keys(allEntities)
    .filter(entity => entity !== "nbsp")
    .forEach((singleEntity, i, arr) => {
      //
      // healthy entity but decode requested:
      //
      t.deepEqual(
        fix(`&${singleEntity};`, {
          decode: true,
          cb: obj => obj
        }),
        [
          {
            ruleName: `encoded-html-entity-${singleEntity}`,
            entityName: singleEntity,
            rangeFrom: 0,
            rangeTo: singleEntity.length + 2,
            rangeValEncoded: `&${singleEntity};`,
            rangeValDecoded: decode(`&${singleEntity};`)
          }
        ],
        `${singleEntity} - 05; ${i + 1}/${arr.length}`
      );
    });
});
