import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
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

test(`01 - ${allNamedEntitiesSetOnly.size} programmatic tests in total`, () => {
  [...allNamedEntitiesSetOnly]
    .filter((entity) => !Object.keys(uncertain).includes(entity))
    .forEach((singleEntity, i, arr) => {
      //
      // ampersand missing, isolated:
      //
      equal(
        fix(ok, `${singleEntity};`, {
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
        `${singleEntity} - 01; ${i + 1}/${arr.length}`,
      );
    });
});

test("02 - ad hoc #1", () => {
  let inp1 = "amp;";
  let outp1 = [[0, 4, "&amp;"]];
  equal(fix(ok, inp1), outp1, "02.01");
});

test("03 - false positive prevention", () => {
  falseCases.forEach((str) => {
    equal(fix(ok, str), [], `03* - ${`\u001b[${33}m${str}\u001b[${39}m`}`);
  });
  equal(fix(ok, "paste & copy & paste again"), [], "03.01");
});

test(`04 - ${`\u001b[${33}m${"missing amp"}\u001b[${39}m`} - aacute vs acute`, () => {
  let gathered = [];
  let input = "z &aacute; y";
  let result = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "04.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "04.02",
  );
  equal(gathered, [], "04.03");
});

test(`05 - ${`\u001b[${33}m${"missing amp"}\u001b[${39}m`} - aacute vs acute`, () => {
  let gathered = [];
  let input = "z &acute; y";
  let result = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "05.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "05.02",
  );
  equal(gathered, [], "05.03");
});

test(`06 - ${`\u001b[${33}m${"missing amp"}\u001b[${39}m`} - aacute vs acute, false positive`, () => {
  equal(
    fix(ok, "Diagnosis can be acute; it is up to a doctor to"),
    [],
    "06.01",
  );
});

test(`07 - ${`\u001b[${33}m${"missing amp"}\u001b[${39}m`} - minimal isolated, named, rarrpl`, () => {
  let inp1 = "rarrpl;";
  let outp1 = [[0, 7, "&rarrpl;"]];
  equal(fix(ok, inp1), outp1, "07.01");
  equal(fix(ok, inp1, { cb }), outp1, "07.02");
});

test(`08 - ${`\u001b[${33}m${"missing amp"}\u001b[${39}m`} - &block; vs. display:block`, () => {
  let input =
    "<img src=abc.jpg width=123 height=456 border=0 style=display:block; alt=xyz/>";
  equal(fix(ok, input), [], "08.01");
});

test("09 - nbsp", () => {
  let gathered = [];
  let input = "nbsp;";
  let result = [[0, 5, "&nbsp;"]];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "09.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "09.02",
  );
  equal(gathered, [], "09.03");
});

test("10 - red & bull;", () => {
  let gathered = [];
  let input = "red & bull;";
  let result = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "10.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "10.02",
  );
  equal(gathered, [4], "10.03");
});

test.run();
