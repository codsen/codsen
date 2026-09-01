import { test } from "uvu";
import { equal, match } from "uvu/assert";

import {
  auditUnitTestNumbering,
  fixUnitTestNumbering,
} from "../unitTestNumbering.js";

function messages(source) {
  return auditUnitTestNumbering(
    `import { test } from "uvu";\nimport { equal } from "uvu/assert";\n${source}`,
    "fixture.js",
  )
    .problems.map(({ message }) => message)
    .join("\n");
}

test("01 - accepts static and established dynamic numbering", () => {
  const result = auditUnitTestNumbering(
    `
      import { test } from "uvu";
      import { equal } from "uvu/assert";
      ["a", "b"].forEach((value, index) => {
        const testNumber = String(index + 1).padStart(2, "0");
        test(\`${"$"}{testNumber} - dynamic\`, () => {
          equal(value, value, \`${"$"}{testNumber}.01\`);
        });
      });
      test("03 - static", () => {
        equal(1, 1, "03.01");
      });
    `,
    "fixture.js",
  );

  equal(result.problems, [], "01.01");
  equal(result.testCount, 3, "01.02");
  equal(result.equalCount, 2, "01.03");
});

test("02 - rejects duplicate, missing, and out-of-order test numbers", () => {
  const result = messages(`
    test("01", () => {});
    test("01 - duplicate", () => {});
    test("04 - gap", () => {});
  `);

  match(result, /test number 1 must be 02/, "02.01");
  match(result, /test number 4 must be 03/, "02.02");
});

test("03 - rejects malformed titles and inconsistent padding", () => {
  const malformed = messages(`test("01-bad", () => {});`);
  const padding = messages(`
    test("001", () => {});
    test("002", () => {});
  `);

  match(malformed, /test title must start/, "03.01");
  match(padding, /must use 2-digit padding/, "03.02");
});

test("04 - rejects missing, mismatched, and out-of-order equal labels", () => {
  const result = messages(`
    test("01 - assertions", () => {
      equal(1, 1);
      equal(2, 2, "02.01");
      equal(3, 3, "01.03");
      equal(4, 4, "01.02");
    });
  `);

  match(result, /must have a numbered third argument/, "04.01");
  match(result, /label must start with test number 01/, "04.02");
  match(result, /assertion number 02 must be greater than 03/, "04.03");
});

test("05 - rejects unsupported dynamic titles without evaluating code", () => {
  const result = messages(`
    const title = "01 - hidden";
    test(title, () => {});
  `);

  match(result, /test title must start/, "05.01");
});

test("06 - fixes static titles and assertion labels", () => {
  const source = `test("09 - first", () => {
  equal(1, 1, "09.07 - result");
  equal(2, 2);
  equal(3, 3, "09.04 - stale");
});
test(\`12 - second\`, () => {
  equal(4, 4, \`12.04\`);
});
`;
  const expected = `test("01 - first", () => {
  equal(1, 1, "01.07 - result");
  equal(2, 2, "01.08");
  equal(3, 3, "01.09 - stale");
});
test(\`02 - second\`, () => {
  equal(4, 4, \`02.04\`);
});
`;
  const result = fixUnitTestNumbering(source, "fixture.js");

  equal(result.problems, [], "06.01");
  equal(result.source, expected, "06.02");
  equal(result.changed, true, "06.03");
  equal(
    fixUnitTestNumbering(result.source, "fixture.js").changed,
    false,
    "06.04",
  );
});

test("07 - fixes dynamic test ranges and labels", () => {
  const source = `[
  "a",
  "b",
].forEach((value, index) => {
  const testNumber = String(index + 8).padStart(2, "0");
  test(\`${"$"}{testNumber} - dynamic\`, () => {
    equal(value, value, \`${"$"}{wrongNumber}.09 - first\`);
    equal(value, value);
  });
});
test("12 - after", () => {
  equal(1, 1, "12.04");
});
`;
  const expected = `[
  "a",
  "b",
].forEach((value, index) => {
  const testNumber = String(index + 1).padStart(2, "0");
  test(\`${"$"}{testNumber} - dynamic\`, () => {
    equal(value, value, \`${"$"}{testNumber}.09 - first\`);
    equal(value, value, \`${"$"}{testNumber}.10\`);
  });
});
test("03 - after", () => {
  equal(1, 1, "03.04");
});
`;
  const result = fixUnitTestNumbering(source, "fixture.js");

  equal(result.problems, [], "07.01");
  equal(result.source, expected, "07.02");
  equal(result.testCount, 3, "07.03");
  equal(result.equalCount, 3, "07.04");
});

test("08 - normalises short prefixes and preserves dynamic descriptions", () => {
  const source = `test("1 - first", () => {
  equal(1, 1, "7.9 - result");
  equal(2, 2, \`7.${"$"}{caseNumber}\`);
});
test(\`named ${"$"}{variant}\`, () => {});
`;
  const expected = `test("01 - first", () => {
  equal(1, 1, "01.01 - result");
  equal(2, 2, \`01.02 - ${"$"}{caseNumber}\`);
});
test(\`02 - named ${"$"}{variant}\`, () => {});
`;
  const result = fixUnitTestNumbering(source, "fixture.js");

  equal(result.problems, [], "08.01");
  equal(result.source, expected, "08.02");
});

test("09 - applies a configured three-digit package width", () => {
  const source = `["a"].forEach((value, index) => {
  const testNumber = String(index + 1).padStart(2, "0");
  test(\`${"$"}{testNumber} - first\`, () => {
    equal(value, value, \`${"$"}{testNumber}.01\`);
  });
});
test("02 - second", () => {});
`;
  const result = fixUnitTestNumbering(source, "fixture.js", {
    requiredWidth: 3,
  });

  equal(result.problems, [], "09.01");
  match(result.source, /padStart\(3, "0"\)/, "09.02");
  match(result.source, /\$\{testNumber\}\.01/, "09.03");
  match(result.source, /test\("002 - second"/, "09.04");
});

test("10 - leaves unsafe expression titles visible to the verifier", () => {
  const source = `const title = "hidden";
test(title, () => {
  equal(1, 1);
});
`;
  const result = fixUnitTestNumbering(source, "fixture.js");
  const dynamicSource = `items.forEach((item, index) => {
  const testNumber = String(index + 1);
  test(\`${"$"}{testNumber} - unsupported\`, () => {});
});
`;
  const dynamicResult = fixUnitTestNumbering(dynamicSource, "fixture.js");

  equal(result.changed, false, "10.01");
  match(result.problems[0].message, /test title must start/, "10.02");
  equal(dynamicResult.changed, false, "10.03");
  match(dynamicResult.problems[0].message, /dynamic test title/, "10.04");
});

test.run();
