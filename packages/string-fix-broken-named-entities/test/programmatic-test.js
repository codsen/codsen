import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";
import allEntities from "../node_modules/all-named-html-entities/src/allNamedEntities.json";
import { decode } from "all-named-html-entities";

// -----------------------------------------------------------------------------
// helper functions
// -----------------------------------------------------------------------------

function charIsUppercase(char) {
  return char.toUpperCase() === char;
}
function flipCase(char) {
  if (charIsUppercase(char)) {
    return char.toLowerCase();
  } // ELSE:
  return char.toUpperCase();
}

// -----------------------------------------------------------------------------
// 20. programmatic tests
// -----------------------------------------------------------------------------

test(`20.1-${
  Object.keys(allEntities).length
} - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`, t => {
  Object.keys(allEntities)
    .filter(entity => entity !== "nbsp")
    .forEach((singleEntity, i, arr) => {
      //
      // 1. ampersand missing, isolated:
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

      //
      // 2. semicolon missing, isolated:
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

      //
      // 3. insert spaces between each character, once for every position
      // for example:
      // & nbsp; - &n bsp; - &nb sp; - &nbs p; - &nbsp ;
      // there are one count more variations than entity's length

      // if (i < 10) {
      //   console.log("-");
      // }
      for (let y = singleEntity.length + 1; y--; ) {
        const entityWithSpaceInserted = `${`&${singleEntity};`.slice(
          0,
          singleEntity.length - y + 1
        )} ${`&${singleEntity};`.slice(singleEntity.length - y + 1)}`;
        // if (i < 10) {
        //   console.log(
        //     `${`\u001b[${33}m${`entityWithSpaceInserted`}\u001b[${39}m`} = "${entityWithSpaceInserted}"`
        //   );
        // }
        t.deepEqual(
          fix(entityWithSpaceInserted, {
            cb: obj => obj
          }),
          [
            {
              ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
              entityName: singleEntity,
              rangeFrom: 0,
              rangeTo: singleEntity.length + 3,
              rangeValEncoded: `&${singleEntity};`,
              rangeValDecoded: decode(`&${singleEntity};`)
            }
          ],
          `"${entityWithSpaceInserted}" - 03; ${i + 1}/${arr.length}`
        );
      }

      // 4. Flip the case of each character, then ensure such entity doesn't
      // exist, then see if it's being fixed

      // if (i < 10) {
      //   console.log("-");
      // }
      for (let y = singleEntity.length; y--; ) {
        const entityWithFlippedCharacter = `${`${singleEntity}`.slice(
          0,
          singleEntity.length - y - 1
        )}${flipCase(
          `${singleEntity}`[singleEntity.length - y - 1]
        )}${`${singleEntity}`.slice(singleEntity.length - y)}`;
        // if (i < 10) {
        //   console.log(
        //     `${`\u001b[${33}m${`entityWithFlippedCharacter`}\u001b[${39}m`} = "${entityWithFlippedCharacter}"`
        //   );
        // }

        // console.log("███████████████████████████████████████");
        // console.log(`singleEntity = "${singleEntity}"`);
        // console.log(
        //   `flipped ${singleEntity.length -
        //     y}th char: ${entityWithFlippedCharacter}`
        // );
        // console.log(
        //   `Object.keys(allEntities)[15] = ${Object.keys(allEntities)[15]}`
        // );
        // console.log("----\n\n\n");
        if (!Object.keys(allEntities).includes(entityWithFlippedCharacter)) {
          const res = fix(`&${entityWithFlippedCharacter};`, {
            cb: obj => obj
          });
          // if it's not one of ambiguous cases, match it:
          if (
            res[0] &&
            res[0].ruleName !== "bad-named-html-entity-unrecognised"
          ) {
            t.deepEqual(
              res,
              [
                {
                  ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
                  entityName: singleEntity,
                  rangeFrom: 0,
                  rangeTo: singleEntity.length + 2,
                  rangeValEncoded: `&${singleEntity};`,
                  rangeValDecoded: decode(`&${singleEntity};`)
                }
              ],
              `"${entityWithFlippedCharacter}" - 04; ${i + 1}/${arr.length}`
            );
          }
        } // else {
        //   console.log(
        //     `1 test.js: "${entityWithFlippedCharacter}" was legit so we skipped checking this messed up case variation`
        //   );
        // }
      }
    });
});
