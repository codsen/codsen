import tap from "tap";
import { decode, uncertain, allNamedEntities } from "all-named-html-entities";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

tap.test(
  `${
    Object.keys(allNamedEntities).length
  } - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`,
  (t) => {
    Object.keys(allNamedEntities)
      .filter(
        (entity) =>
          entity !== "nbsp" && !Object.keys(uncertain).includes(entity)
      )
      .forEach((singleEntity, i, arr) => {
        //
        // insert spaces between each character, once for every position
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
          t.same(
            fix(entityWithSpaceInserted, {
              cb: (obj) => obj,
            }),
            [
              {
                ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
                entityName: singleEntity,
                rangeFrom: 0,
                rangeTo: singleEntity.length + 3,
                rangeValEncoded: `&${singleEntity};`,
                rangeValDecoded: decode(`&${singleEntity};`),
              },
            ],
            `"${entityWithSpaceInserted}" - 03; ${i + 1}/${arr.length}`
          );
        }
      });
    t.end();
  }
);
