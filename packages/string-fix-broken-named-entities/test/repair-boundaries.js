import { allNamedEntities } from "all-named-html-entities";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test("01 - encoded ampersands preserve following uncertain prose", () => {
  for (const amp of ["amp", "AMP"]) {
    for (const gap of [" ", "\n", "\t", ""]) {
      for (const [word, suffix] of [
        ["female", " employees"],
        ["minus", " signs"],
        ["female", "<b> employees</b>"],
      ]) {
        const input = `text &${amp};${gap}${word}${suffix}`;
        equal(fixEnt(input), [], "01.01");
        equal(
          rApply(input, fixEnt(input, { decode: true })),
          `text &${gap}${word}${suffix}`,
          "01.02",
        );
        const explicit = `text &${amp};${gap}${word};${suffix}`;
        equal(
          rApply(explicit, fixEnt(explicit)),
          `text &${word};${suffix}`,
          "01.03",
        );
        equal(
          rApply(explicit, fixEnt(explicit, { decode: true })),
          `text ${allNamedEntities[word]}${suffix}`,
          "01.04",
        );
      }
    }
  }
});

test("02 - repeated ampersand aliases retain final entity case", () => {
  for (const layers of [
    "AMP;",
    "amp;AMP;",
    "AMP;amp;",
    "AMP;AMP;",
    "AMP;amp;AMP;",
    " A M P ; a m p ; ",
  ]) {
    for (const name of ["nbsp", "amp", "AMP", "Not", "not"]) {
      for (const suffix of ["", " prose", "<b>text</b>"]) {
        const entity = `&${layers}${name};`;
        const input = `${entity}${suffix}`;
        equal(fixEnt(input), [[0, entity.length, `&${name};`]], "02.01");
        equal(
          rApply(input, fixEnt(input, { decode: true })),
          `${allNamedEntities[name]}${suffix}`,
          "02.02",
        );
      }
    }
  }
});

test("03 - combined repairs consume the opening ampersand", () => {
  for (const broken of ["nbsp", "NBSP", "nsp", "nbsq"]) {
    for (const syntax of [`&;${broken};`, `& ; ${broken} ;`]) {
      for (const prefix of ["", "text "]) {
        const input = `${prefix}${syntax} tail &`;
        const from = prefix.length;
        const to = from + syntax.length;
        for (const decode of [false, true]) {
          const amps = [];
          const output = fixEnt(input, {
            decode,
            textAmpersandCatcherCb: (index) => amps.push(index),
          });
          equal(output, [[from, to, decode ? "\xA0" : "&nbsp;"]], "03.01");
          equal(
            rApply(input, output),
            `${prefix}${decode ? "\xA0" : "&nbsp;"} tail &`,
            "03.02",
          );
          equal(
            fixEnt(input, { decode, cb: null }),
            [
              {
                ruleName: "bad-html-entity-malformed-nbsp",
                entityName: "nbsp",
                rangeFrom: from,
                rangeTo: to,
                rangeValEncoded: "&nbsp;",
                rangeValDecoded: "\xA0",
              },
            ],
            "03.03",
          );
          equal(amps, [input.length - 1], "03.04");
        }
      }
    }
  }
});

test("04 - long numeric padding remains healthy with original coordinates", () => {
  for (const count of [45, 46, 47, 48, 49, 50, 60, 1000]) {
    for (const body of [
      `#${"0".repeat(count)}65`,
      `#x${"0".repeat(count)}41`,
      `#X${"0".repeat(count)}41`,
    ]) {
      const entity = `&${body};`;
      const input = `text ${entity} &`;
      for (const decode of [false, true]) {
        const entities = [];
        const amps = [];
        equal(
          fixEnt(input, {
            decode,
            entityCatcherCb: (from, to) => entities.push([from, to]),
            textAmpersandCatcherCb: (index) => amps.push(index),
          }),
          decode ? [[5, 5 + entity.length, "A"]] : [],
          "04.01",
        );
        equal(entities, [[5, 5 + entity.length]], "04.02");
        equal(amps, [input.length - 1], "04.03");
      }
    }
  }
});

test("05 - long candidates retain gaps and prose escape boundaries", () => {
  for (const gap of [" ".repeat(45), " ".repeat(60), "\n\t".repeat(500)]) {
    for (const name of [`n${gap}bsp`, `N${gap}BSP`, `n${gap}bsq`]) {
      const input = `&${name};`;
      equal(fixEnt(input), [[0, input.length, "&nbsp;"]], "05.01");
      equal(
        fixEnt(input, { decode: true }),
        [[0, input.length, "\xA0"]],
        "05.02",
      );
    }
  }
  for (const input of [
    `&${"unrelated prose ".repeat(100)};`,
    `&#hello ${"unrelated prose ".repeat(100)};`,
    `#x26${"a".repeat(51)} hello;`,
  ]) {
    equal(fixEnt(input), [], "05.03");
    equal(fixEnt(input, { decode: true }), [], "05.04");
  }
  for (const count of [49, 50, 51, 60, 100, 1000]) {
    for (const marker of ["&#", "&#x"]) {
      const prefix = `${marker}${"0".repeat(count)}`;
      const input = `${prefix}nb sp;`;
      // Once the numeric candidate is abandoned, the following name still
      // begins at its own first letter, even when the scan budget was cached.
      if (prefix.length > 51) {
        equal(
          fixEnt(input),
          [[prefix.length, input.length, "&nbsp;"]],
          "05.05",
        );
        equal(
          fixEnt(input, { decode: true }),
          [[prefix.length, input.length, "\xA0"]],
          "05.06",
        );
      }
    }
  }
});

test("06 - oversized numeric values retain malformed deletion diagnostics", () => {
  for (const input of [`&#${"9".repeat(1000)};`, `&#x${"F".repeat(1000)};`]) {
    for (const decode of [false, true]) {
      equal(fixEnt(input, { decode }), [[0, input.length]], "06.01");
      equal(
        fixEnt(input, { decode, cb: null })[0].ruleName,
        "bad-html-entity-malformed-numeric",
        "06.02",
      );
    }
  }
});

test("07 - missing ampersands recognize every hexadecimal leading digit", () => {
  for (const digit of "0123456789abcdefABCDEF") {
    for (const marker of ["x", "X"]) {
      for (const prefix of ["", "abc"]) {
        const entity = `#${marker}${digit}3;`;
        const input = `${prefix}${entity}def`;
        for (const decode of [false, true]) {
          equal(
            fixEnt(input, { decode }),
            [[prefix.length, prefix.length + entity.length]],
            "07.01",
          );
          equal(
            fixEnt(input, { decode, cb: null }),
            [
              {
                ruleName: "bad-html-entity-malformed-numeric",
                entityName: null,
                rangeFrom: prefix.length,
                rangeTo: prefix.length + entity.length,
                rangeValEncoded: null,
                rangeValDecoded: null,
              },
            ],
            "07.02",
          );
          equal(
            fixEnt(`${prefix}#${marker}${digit}3! prose;`, { decode }),
            [],
            "07.03",
          );
        }
      }
    }
  }
});

test("08 - large raw ampersand queues report every index once in order", () => {
  const raw = "&".repeat(32000);
  const input = `${raw}&nbsp; &;NBSP; &AMP;nbsp; tail &`;
  for (const decode of [false, true]) {
    const amps = [];
    const inputRanges = fixEnt(input, {
      decode,
      textAmpersandCatcherCb: (index) => amps.push(index),
    });
    equal(
      amps,
      [
        ...Array.from({ length: raw.length }, (_, index) => index),
        input.length - 1,
      ],
      "08.01",
    );
    equal(
      rApply(input, inputRanges),
      `${raw}${decode ? "\xA0 \xA0 \xA0" : "&nbsp; &nbsp; &nbsp;"} tail &`,
      "08.02",
    );
  }
});

test("09 - callbacks retain raw, mapped, tuple and void output modes", () => {
  const input = "&nsp;";
  equal(
    fixEnt(input, { cb: null }),
    fixEnt(input, { cb: (finding) => finding }),
    "09.01",
  );
  equal(
    fixEnt(input, { cb: (finding) => ({ rule: finding.ruleName }) }),
    [{ rule: "bad-html-entity-malformed-nbsp" }],
    "09.02",
  );
  equal(
    fixEnt(input, { cb: ({ rangeFrom, rangeTo }) => [rangeFrom, rangeTo] }),
    [[0, 5]],
    "09.03",
  );
  equal(fixEnt(input, { cb: () => {} }), [undefined], "09.04");
});

test.run();
