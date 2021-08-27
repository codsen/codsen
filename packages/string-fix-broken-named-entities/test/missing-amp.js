import tap from "tap";
import {
  decode,
  uncertain,
  allNamedEntitiesSetOnly,
} from "all-named-html-entities";
import fix from "./util/util.js";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

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
  "paste & copy & paste again",
];

// -----------------------------------------------------------------------------
// helper functions
// -----------------------------------------------------------------------------

function cb(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]
    : [obj.rangeFrom, obj.rangeTo];
}

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${allNamedEntitiesSetOnly.size} programmatic tests in total`,
  (t) => {
    [...allNamedEntitiesSetOnly]
      .filter((entity) => !Object.keys(uncertain).includes(entity))
      .forEach((singleEntity, i, arr) => {
        //
        // ampersand missing, isolated:
        //
        t.strictSame(
          fix(t, `${singleEntity};`, {
            cb: (obj) => obj,
          }),
          [
            {
              ruleName: `bad-html-entity-malformed-${singleEntity}`,
              entityName: singleEntity,
              rangeFrom: 0,
              rangeTo: singleEntity.length + 1,
              rangeValEncoded: `&${singleEntity};`,
              rangeValDecoded: decode(`&${singleEntity};`),
            },
          ],
          `${singleEntity} - 01; ${i + 1}/${arr.length}`
        );
      });

    t.end();
  }
);

tap.test(`02 - ad hoc #1`, (t) => {
  const inp1 = "amp;";
  const outp1 = [[0, 4, "&amp;"]];
  t.strictSame(fix(t, inp1), outp1, "02");
  t.end();
});

tap.test(`03 - false positive prevention`, (t) => {
  falseCases.forEach((str) => {
    t.strictSame(
      fix(t, str),
      [],
      `03* - ${`\u001b[${33}m${str}\u001b[${39}m`}`
    );
  });
  t.strictSame(fix(t, "paste & copy & paste again"), [], "03");
  t.end();
});

tap.test(
  `04 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - aacute vs acute`,
  (t) => {
    const gathered = [];
    const input = "z &aacute; y";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "04.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "04.02"
    );
    t.strictSame(gathered, [], "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - aacute vs acute`,
  (t) => {
    const gathered = [];
    const input = "z &acute; y";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "05.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "05.02"
    );
    t.strictSame(gathered, [], "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - aacute vs acute, false positive`,
  (t) => {
    t.strictSame(
      fix(t, "Diagnosis can be acute; it is up to a doctor to"),
      [],
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, rarrpl`,
  (t) => {
    const inp1 = "rarrpl;";
    const outp1 = [[0, 7, "&rarrpl;"]];
    t.strictSame(fix(t, inp1), outp1, "07.01");
    t.strictSame(fix(t, inp1, { cb }), outp1, "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - &block; vs. display:block`,
  (t) => {
    const input = `<img src=abc.jpg width=123 height=456 border=0 style=display:block; alt=xyz/>`;
    t.strictSame(fix(t, input), [], "08");
    t.end();
  }
);

tap.test(`09 - nbsp`, (t) => {
  const gathered = [];
  const input = "nbsp;";
  const result = [[0, 5, "&nbsp;"]];
  t.strictSame(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "09.01"
  );
  t.strictSame(
    fix(t, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "09.02"
  );
  t.strictSame(gathered, [], "09.03");
  t.end();
});

tap.test(`10 - red & bull;`, (t) => {
  const gathered = [];
  const input = "red & bull;";
  const result = [];
  t.strictSame(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "10.01"
  );
  t.strictSame(
    fix(t, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "10.02"
  );
  t.strictSame(gathered, [4], "10.03");
  t.end();
});
