const t = require("tap");
const fix = require("../dist/string-fix-broken-named-entities.cjs");
const {
  decode,
  uncertain,
  allNamedEntities
} = require("all-named-html-entities");
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

t.test(
  `${
    Object.keys(allNamedEntities).length
  } - ${`\u001b[${36}m${`programmatic tests`}\u001b[${39}m`}`,
  t => {
    Object.keys(allNamedEntities)
      .filter(
        entity => entity !== "nbsp" && !Object.keys(uncertain).includes(entity)
      )
      .forEach((singleEntity, i, arr) => {
        //
        // ampersand missing, isolated:
        //
        t.same(
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

    t.end();
  }
);

t.test(`02 - ad hoc #1`, t => {
  const inp1 = "amp;";
  const outp1 = [[0, 4, "&amp;"]];
  t.same(fix(inp1), outp1, "02");
  t.end();
});

t.test(`03 - false positive prevention`, t => {
  falseCases.forEach(str => {
    t.same(fix(str), [], `03* - ${`\u001b[${33}m${str}\u001b[${39}m`}`);
  });

  t.same(fix("paste & copy & paste again"), [], "03.01");
  t.end();
});
