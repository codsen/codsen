import tap from "tap";
import { util } from "../../dist/emlint.esm.js";
const { splitByWhitespace } = util;

// 01. no config
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - no whitespace`,
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
    t.match(gatheredChunks, [[0, 3]], "01.01");
    t.match(gatheredWhitespace, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`,
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
    t.match(gatheredChunks, [], "02.01");
    t.match(gatheredWhitespace, [[0, 3]], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`,
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
    t.match(
      gatheredChunks,
      [
        [3, 6],
        [9, 12],
      ],
      "03.01"
    );
    t.match(
      gatheredWhitespace,
      [
        [0, 3],
        [6, 9],
        [12, 14],
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`,
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
    t.match(
      gatheredChunks,
      [
        [0, 3],
        [7, 10],
      ],
      "04.01"
    );
    t.match(gatheredWhitespace, [[3, 7]], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - extracts classes`,
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
    t.match(
      gatheredChunks,
      [
        [1, 3],
        [7, 9],
      ],
      "05.01"
    );
    t.match(
      gatheredWhitespace,
      [
        [0, 1],
        [3, 7],
        [9, 10],
      ],
      "05.02"
    );
    t.end();
  }
);

// 02. with custom range
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`custom`}\u001b[${39}m`} - crops inside`,
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
    t.match(
      gatheredChunks,
      [
        [3, 5],
        [9, 11],
      ],
      "06.01"
    );
    t.match(gatheredWhitespace, [[5, 9]], "06.02");
    t.end();
  }
);
