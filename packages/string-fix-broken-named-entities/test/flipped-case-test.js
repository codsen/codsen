const t = require("tap");
const fix = require("../dist/string-fix-broken-named-entities.cjs");
const { decode, allNamedEntities } = require("all-named-html-entities");

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
// programmatic tests
// -----------------------------------------------------------------------------

t.test(
  `${
    Object.keys(allNamedEntities).length
  } - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`,
  (t) => {
    Object.keys(allNamedEntities)
      .filter((entity) => entity !== "nbsp")
      .forEach((singleEntity, i, arr) => {
        // flip the case of each character, then ensure such entity doesn't
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
          //   `Object.keys(allNamedEntities)[15] = ${Object.keys(allNamedEntities)[15]}`
          // );
          // console.log("----\n\n\n");
          if (
            !Object.keys(allNamedEntities).includes(entityWithFlippedCharacter)
          ) {
            const res = fix(`&${entityWithFlippedCharacter};`, {
              cb: (obj) => obj,
            });
            // if it's not one of ambiguous cases, match it:
            if (
              res[0] &&
              res[0].ruleName !== "bad-named-html-entity-unrecognised"
            ) {
              t.same(
                res,
                [
                  {
                    ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
                    entityName: singleEntity,
                    rangeFrom: 0,
                    rangeTo: singleEntity.length + 2,
                    rangeValEncoded: `&${singleEntity};`,
                    rangeValDecoded: decode(`&${singleEntity};`),
                  },
                ],
                `"${entityWithFlippedCharacter}" - 04; ${i + 1}/${arr.length}`
              );
            }
          } // else {
          //   console.log(
          //     `088 test.js: "${entityWithFlippedCharacter}" was legit so we skipped checking this messed up case variation`
          //   );
          // }
        }
      });
    t.end();
  }
);
