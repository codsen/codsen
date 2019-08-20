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

test("02 - single pi", t => {
  t.deepEqual(fix("&pi"), [[0, 3, "&pi;"]], "02");
});

test("03 - larger set", t => {
  t.deepEqual(
    fix("aaa&pi&piv&pi&pivaaa"),
    [[3, 6, "&pi;"], [6, 10, "&piv;"], [10, 13, "&pi;"], [13, 17, "&piv;"]],
    "03"
  );
});
