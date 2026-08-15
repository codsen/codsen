import { test } from "uvu";
import { equal, match } from "uvu/assert";

import { auditUnitTestNumbering } from "../unitTestNumbering.js";

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

test.run();
