import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";
import { decode, uncertain, allNamedEntities } from "all-named-html-entities";
// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`${
  Object.keys(allNamedEntities).length
} - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`, t => {
  Object.keys(allNamedEntities)
    .filter(
      entity => entity !== "nbsp" && !Object.keys(uncertain).includes(entity)
    )
    .forEach((singleEntity, i, arr) => {
      //
      // semicolon missing, isolated:
      //
      t.deepEqual(
        fix(`&${singleEntity}`, {
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
        `${singleEntity} - 02; ${i + 1}/${arr.length}`
      );
    });
});
