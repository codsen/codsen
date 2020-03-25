import t from "tap";
import splitByWhitespace from "../../src/util/splitByWhitespace";

// 01. no config
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - no whitespace`,
  (t) => {
    const gatheredChunks = [];
    const gatheredWhitespace = [];
    splitByWhitespace(
      "abc",
      (valuesArr) => {
        gatheredChunks.push(valuesArr);
      },
      (whitespaceArr) => {
        gatheredWhitespace.push(whitespaceArr);
      }
    );
    t.match(gatheredChunks, [[0, 3]]);
    t.match(gatheredWhitespace, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`,
  (t) => {
    const gatheredChunks = [];
    const gatheredWhitespace = [];
    splitByWhitespace(
      "   ",
      (valuesArr) => {
        gatheredChunks.push(valuesArr);
      },
      (whitespaceArr) => {
        gatheredWhitespace.push(whitespaceArr);
      }
    );
    t.match(gatheredChunks, []);
    t.match(gatheredWhitespace, [[0, 3]]);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`,
  (t) => {
    const gatheredChunks = [];
    const gatheredWhitespace = [];
    splitByWhitespace(
      "   abc   def  ",
      (valuesArr) => {
        gatheredChunks.push(valuesArr);
      },
      (whitespaceArr) => {
        gatheredWhitespace.push(whitespaceArr);
      }
    );
    t.match(gatheredChunks, [
      [3, 6],
      [9, 12],
    ]);
    t.match(gatheredWhitespace, [
      [0, 3],
      [6, 9],
      [12, 14],
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`,
  (t) => {
    const gatheredChunks = [];
    const gatheredWhitespace = [];
    splitByWhitespace(
      "abc \t  def",
      (valuesArr) => {
        gatheredChunks.push(valuesArr);
      },
      (whitespaceArr) => {
        gatheredWhitespace.push(whitespaceArr);
      }
    );
    t.match(gatheredChunks, [
      [0, 3],
      [7, 10],
    ]);
    t.match(gatheredWhitespace, [[3, 7]]);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - extracts classes`,
  (t) => {
    const gatheredChunks = [];
    const gatheredWhitespace = [];
    splitByWhitespace(
      " kk  \t ll ",
      (valuesArr) => {
        gatheredChunks.push(valuesArr);
      },
      (whitespaceArr) => {
        gatheredWhitespace.push(whitespaceArr);
      }
    );
    t.match(gatheredChunks, [
      [1, 3],
      [7, 9],
    ]);
    t.match(gatheredWhitespace, [
      [0, 1],
      [3, 7],
      [9, 10],
    ]);
    t.end();
  }
);

// 02. with custom range
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`custom`}\u001b[${39}m`} - crops inside`,
  (t) => {
    const gatheredChunks = [];
    const gatheredWhitespace = [];
    splitByWhitespace(
      "  abc \t  def   ",
      (valuesArr) => {
        gatheredChunks.push(valuesArr);
      },
      (whitespaceArr) => {
        gatheredWhitespace.push(whitespaceArr);
      },
      {
        from: 3,
        to: 11,
      }
    );
    t.match(gatheredChunks, [
      [3, 5],
      [9, 11],
    ]);
    t.match(gatheredWhitespace, [[5, 9]]);
    t.end();
  }
);
