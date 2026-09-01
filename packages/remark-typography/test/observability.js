import { unified } from "unified";
import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";
import { VFile } from "vfile";

import fixTypography from "../dist/remark-typography.esm.js";

function root(...values) {
  return {
    type: "root",
    children: values.map((value) => ({
      type: "paragraph",
      children: [{ type: "text", value }],
    })),
  };
}

function run(tree, options, passOptions = true) {
  const file = new VFile();
  const processor = passOptions
    ? unified().use(fixTypography, options)
    : unified().use(fixTypography);
  processor.runSync(tree, file);
  return file;
}

test("01 - omitted, empty, false, and null progress options are equivalent", () => {
  const omitted = root("That's ... 3 x 4");
  const empty = root("That's ... 3 x 4");
  const disabled = root("That's ... 3 x 4");
  const nullable = root("That's ... 3 x 4");
  run(omitted, undefined, false);
  run(empty, {});
  run(disabled, { reportProgressFunc: false });
  run(nullable, { reportProgressFunc: null });
  equal(empty, omitted, "01.01");
  equal(disabled, omitted, "01.02");
  equal(nullable, omitted, "01.03");
});

test("02 - progress uses inclusive custom endpoints and increases", () => {
  const percentages = [];
  run(root("One two three four five...", "3 x 4", "a - b"), {
    reportProgressFunc: (percentage) => percentages.push(percentage),
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 80,
  });
  equal(percentages[0], 20, "02.01");
  equal(percentages[percentages.length - 1], 80, "02.02");
  ok(percentages.every(Number.isInteger), "02.03");
  ok(
    percentages.every(
      (percentage, index) => !index || percentage > percentages[index - 1],
    ),
    "02.04",
  );
  ok(
    percentages.every((percentage) => percentage >= 20 && percentage <= 80),
    "02.05",
  );
});

test("03 - an empty tree still reports both endpoints", () => {
  const percentages = [];
  run(root(), {
    reportProgressFunc: (percentage) => percentages.push(percentage),
    reportProgressFuncFrom: 10,
    reportProgressFuncTo: 90,
  });
  equal(percentages, [10, 90], "03.01");
});

test("04 - equal progress bounds emit that endpoint once", () => {
  const percentages = [];
  run(root("One two three four five"), {
    reportProgressFunc: (percentage) => percentages.push(percentage),
    reportProgressFuncFrom: 55,
    reportProgressFuncTo: 55,
  });
  equal(percentages, [55], "04.01");
});

test("05 - callback exceptions propagate without semantic recovery", () => {
  const tree = root("Wait...");
  throws(
    () =>
      run(tree, {
        reportProgressFunc: () => {
          throw new Error("stop progress");
        },
      }),
    /stop progress/,
    "05.01",
  );
  equal(tree.children[0].children[0].value, "Wait...", "05.02");
});

test("06 - completion counters retain operations from every block", () => {
  const originalNow = Date.now;
  Date.now = () => 1000;
  try {
    const file = run(root("a - b", "...", "Joe's"), {});
    equal(
      file.data.remarkTypography,
      {
        apostrophesConverted: 1,
        blocksProcessed: 3,
        charactersProcessed: 13,
        dashesConverted: 1,
        ellipsesConverted: 1,
        multiplicationSignsConverted: 0,
        replacementsApplied: 4,
        textNodesChanged: 3,
        textNodesProcessed: 3,
        timeTakenInMilliseconds: 0,
        widowMeasuresAdded: 1,
      },
      "06.01",
    );
  } finally {
    Date.now = originalNow;
  }
});

test("07 - completion data is plain and JSON-representable", () => {
  const completion = run(root("3 x 4"), {}).data.remarkTypography;
  equal(JSON.parse(JSON.stringify(completion)), completion, "07.01");
  ok(Number.isFinite(completion.timeTakenInMilliseconds), "07.02");
  ok(completion.timeTakenInMilliseconds >= 0, "07.03");
});

test("08 - runtime option validation uses ordered throw identifiers", () => {
  throws(() => run(root(), null), /THROW_ID_01/, "08.01");
  throws(() => run(root(), []), /THROW_ID_01/, "08.02");
  throws(() => run(root(), { unknown: true }), /THROW_ID_02/, "08.03");
  throws(
    () => run(root(), { reportProgressFunc: "yes" }),
    /THROW_ID_03/,
    "08.04",
  );
  throws(
    () => run(root(), { reportProgressFuncFrom: -1 }),
    /THROW_ID_04/,
    "08.05",
  );
  throws(
    () => run(root(), { reportProgressFuncFrom: 2.5 }),
    /THROW_ID_04/,
    "08.06",
  );
  throws(
    () => run(root(), { reportProgressFuncTo: 101 }),
    /THROW_ID_04/,
    "08.07",
  );
  throws(
    () =>
      run(root(), {
        reportProgressFuncFrom: 80,
        reportProgressFuncTo: 20,
      }),
    /THROW_ID_05/,
    "08.08",
  );
});

test("09 - unsupported content yields zero deterministic work", () => {
  const code = { type: "code", value: "Wait... 3 x 4 - done" };
  const file = run({ type: "root", children: [code] }, {});
  equal(code.value, "Wait... 3 x 4 - done", "09.01");
  equal(file.data.remarkTypography.blocksProcessed, 0, "09.02");
  equal(file.data.remarkTypography.charactersProcessed, 0, "09.03");
  equal(file.data.remarkTypography.replacementsApplied, 0, "09.04");
});

test("10 - the final endpoint follows mutations and completion data", () => {
  const tree = root("one two three four five");
  const file = new VFile();
  const finalSnapshots = [];

  unified()
    .use(fixTypography, {
      reportProgressFunc: (percentage) => {
        if (percentage === 100) {
          finalSnapshots.push({
            completion: file.data.remarkTypography,
            value: tree.children[0].children[0].value,
          });
        }
      },
    })
    .runSync(tree, file);

  equal(finalSnapshots.length, 1, "10.01");
  equal(finalSnapshots[0].value, "one two three four\u00A0five", "10.02");
  equal(finalSnapshots[0].completion, file.data.remarkTypography, "10.03");
});

test.run();
