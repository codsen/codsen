// avanotonly

import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";
import allEntities from "../node_modules/all-named-html-entities/src/allNamedEntities.json";
import { decode, uncertain } from "all-named-html-entities";
const falseCases = [
  "First we went to a camp;",
  "lamp;",
  "Mr. Ruflac;",
  "red & bull;",
  "Andalusia",
  "and the Band;",
  "<<camp;>>",
  "formats of mpeg and flac;",
  "bac",
  "lamp",
  "app",
  "APP",
  "a caring husband",
  "it happened because of...",
  "Because of this,",
  "paste & copy & paste again"
];

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`${
  Object.keys(allEntities).length
} - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`, t => {
  Object.keys(allEntities)
    .filter(
      entity => entity !== "nbsp" && !Object.keys(uncertain).includes(entity)
    )
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

test(`02 - ad hoc #1`, t => {
  const inp1 = "amp;";
  const outp1 = [[0, 4, "&amp;"]];
  t.deepEqual(fix(inp1), outp1, "02");
});

test(`03 - false positive prevention`, t => {
  falseCases.forEach(str => {
    t.deepEqual(fix(str), [], `03* - ${`\u001b[${33}m${str}\u001b[${39}m`}`);
  });

  t.deepEqual(fix("paste & copy & paste again"), [], "03.01");
});
