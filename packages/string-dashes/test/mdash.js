import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rawMDash, rawNDash } from "codsen-utils";

import { convertOne } from "../dist/string-dashes.esm.js";
import { pad } from "../../../ops/helpers/common.js";
import { mixer } from "./_util.js";

// -----------------------------------------------------------------------------

test(`01 - m-dash minimal`, () => {
  let input = `Dashes come in two sizes - the en dash and the em dash.`;
  mixer({
    from: 25,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, "&mdash;"]], `01.02.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, rawMDash]], `01.03.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `01.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`02 - n-dash instead of m-dash`, () => {
  let input = `Dashes come in two sizes ${rawNDash} the en dash and the em dash.`;
  mixer({
    from: 25,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `02.01.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, "&mdash;"]], `02.02.${pad(n)}`);
  });
  mixer({
    from: 25,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[25, 26, rawMDash]], `02.03.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `02.04.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `02.05.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`03 - already m-dash, spaced`, () => {
  let input = `Dashes come in two sizes ${rawMDash} the en dash and the em dash.`;
  mixer({
    from: 25,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `03.01.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `03.02.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `03.03.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`04 - edge case - one dash`, () => {
  let input = `-`;
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `04.01.${pad(n)}`);
  });
});

test(`05 - edge case - one m-dash`, () => {
  let input = rawMDash;
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `05.01.${pad(n)}`);
  });
});

test(`06 - edge case - one n-dash`, () => {
  let input = rawNDash;
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `06.01.${pad(n)}`);
  });
});

test(`07 - already m-dash, tight`, () => {
  let input = `Dashes come in two sizes${rawMDash}the en dash and the em dash.`;
  mixer({
    from: 24,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `07.01.${pad(n)}`);
  });

  // nothing to find
  mixer({
    from: 0,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `07.02.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
  mixer({
    from: input.length - 1,
  }).forEach((opt, n) => {
    equal(
      convertOne(input, opt),
      null,
      `07.03.${pad(n)} ${JSON.stringify(opt, null, 0)}`
    );
  });
});

test(`08 - math, spaces`, () => {
  let input = `5 - 2 = 3`;
  mixer({
    from: 2,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `08.01.${pad(n)}`);
  });
  mixer({
    from: 2,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[2, 3, "&ndash;"]], `08.02.${pad(n)}`);
  });
  mixer({
    from: 2,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[2, 3, rawNDash]], `08.03.${pad(n)}`);
  });
});

test(`09 - math, one tab`, () => {
  let input = `5\t-\t2\t=\t3`;
  mixer({
    from: 2,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `08.01.${pad(n)}`);
  });
  mixer({
    from: 2,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[2, 3, "&ndash;"]], `08.02.${pad(n)}`);
  });
  mixer({
    from: 2,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[2, 3, rawNDash]], `08.03.${pad(n)}`);
  });
});

test(`10 - math, lots of whitespace`, () => {
  let input = `5\r\n\t\t\t-\r\n\t\t\t2\r\n\t\t\t=\r\n\t\t\t3`;
  mixer({
    from: 6,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `08.01.${pad(n)}`);
  });
  mixer({
    from: 6,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[6, 7, "&ndash;"]], `08.02.${pad(n)}`);
  });
  mixer({
    from: 6,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[6, 7, rawNDash]], `08.03.${pad(n)}`);
  });
});

test(`11 - currencies, usual position, one space`, () => {
  let input = `$5 - $2 = $3`;
  mixer({
    from: 3,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `09.01.${pad(n)}`);
  });
  mixer({
    from: 3,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[3, 4, "&ndash;"]], `09.02.${pad(n)}`);
  });
  mixer({
    from: 3,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[3, 4, rawNDash]], `09.03.${pad(n)}`);
  });
});

test(`12 - currencies, usual position, lots of whitespace`, () => {
  let input = `$5\n\n\n-\n\n\n$2\n\n\n=\n\n\n$3`;
  mixer({
    from: 5,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `09.01.${pad(n)}`);
  });
  mixer({
    from: 5,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[5, 6, "&ndash;"]], `09.02.${pad(n)}`);
  });
  mixer({
    from: 5,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[5, 6, rawNDash]], `09.03.${pad(n)}`);
  });
});

test(`13 - currencies, unusual position, one space`, () => {
  let input = `5$ - 2$ = 3$`;
  mixer({
    from: 3,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `10.01.${pad(n)}`);
  });
  mixer({
    from: 3,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[3, 4, "&ndash;"]], `10.02.${pad(n)}`);
  });
  mixer({
    from: 3,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[3, 4, rawNDash]], `10.03.${pad(n)}`);
  });
});

test(`14 - currencies, unusual position, lots of whitespace`, () => {
  let input = `5$\n\n\n-\n\n\n2$\n\n\n=\n\n\n3$`;
  mixer({
    from: 5,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `10.01.${pad(n)}`);
  });
  mixer({
    from: 5,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[5, 6, "&ndash;"]], `10.02.${pad(n)}`);
  });
  mixer({
    from: 5,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[5, 6, rawNDash]], `10.03.${pad(n)}`);
  });
});

test(`15 - m-dash, sentence with digits`, () => {
  let input = `My earnings today - 1.234,56 zł!`;
  mixer({
    from: 18,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });
  mixer({
    from: 18,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[18, 19, "&mdash;"]], `01.02.${pad(n)}`);
  });
  mixer({
    from: 18,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[18, 19, rawMDash]], `01.03.${pad(n)}`);
  });
});

test(`16 - cut-off in citation`, () => {
  let input = `I smiled and she said, 'You mean you want me to-'`;
  mixer({
    from: 47,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), null, `01.01.${pad(n)}`);
  });
  mixer({
    from: 47,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[47, 48, "&mdash;"]], `01.02.${pad(n)}`);
  });
  mixer({
    from: 47,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(convertOne(input, opt), [[47, 48, rawMDash]], `01.03.${pad(n)}`);
  });
});

test.run();
