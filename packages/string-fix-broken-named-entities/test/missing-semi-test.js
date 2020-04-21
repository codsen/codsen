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
        // semicolon missing, isolated:
        //
        t.same(
          fix(`&${singleEntity}`, {
            cb: (obj) => obj,
          }),
          [
            {
              ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
              entityName: singleEntity,
              rangeFrom: 0,
              rangeTo: singleEntity.length + 1,
              rangeValEncoded: `&${singleEntity};`,
              rangeValDecoded: decode(`&${singleEntity};`),
            },
          ],
          `${singleEntity} - 02; ${i + 1}/${arr.length}`
        );
      });
    t.end();
  }
);

tap.test("02 - single pi", (t) => {
  t.same(fix("&pi"), [[0, 3, "&pi;"]], "02");
  t.end();
});

tap.test("03 - larger set", (t) => {
  t.same(
    fix("aaa&pi&piv&pi&pivaaa"),
    [
      [3, 6, "&pi;"],
      [6, 10, "&piv;"],
      [10, 13, "&pi;"],
      [13, 17, "&piv;"],
    ],
    "03"
  );
  t.end();
});

tap.test("04 - letters follow tightly", (t) => {
  t.same(
    fix("aaa&ang&angst&ang&angstaaa"),
    [
      [3, 7, "&ang;"],
      [7, 13, "&angst;"],
      [13, 17, "&ang;"],
      [17, 23, "&angst;"],
    ],
    "04"
  );
  t.end();
});
