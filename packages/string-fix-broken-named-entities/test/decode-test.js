import tap from "tap";
import { decode, allNamedEntities } from "all-named-html-entities";
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
      .filter((entity) => entity !== "nbsp")
      .forEach((singleEntity, i, arr) => {
        //
        // healthy entity but decode requested:
        //
        t.same(
          fix(`&${singleEntity};`, {
            decode: true,
            cb: (obj) => obj,
          }),
          [
            {
              ruleName: `encoded-html-entity-${singleEntity}`,
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
    t.end();
  }
);
