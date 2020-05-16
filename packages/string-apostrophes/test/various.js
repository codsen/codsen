import tap from "tap";
import { convertAll } from "../dist/string-apostrophes.esm";

// const leftSingleQuote = "\u2018";
// const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";

tap.test(
  `01 - ${`\u001b[${35}m${`various`}\u001b[${39}m`} - edge cases`,
  (t) => {
    const input = `" " `;
    t.same(
      convertAll(input, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      input,
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`various`}\u001b[${39}m`} - edge cases`,
  (t) => {
    const input = ` " " `;
    t.same(
      convertAll(input, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      input,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`various`}\u001b[${39}m`} - edge cases`,
  (t) => {
    const input = ` " "`;
    t.same(
      convertAll(input, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      input,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`various`}\u001b[${39}m`} - edge cases`,
  (t) => {
    const input = ` ${leftDoubleQuote}-${rightDoubleQuote} `;
    t.same(
      convertAll(input, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      ` "-" `,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`various`}\u001b[${39}m`} - target 776`,
  (t) => {
    const input = ` a${rightDoubleQuote}`;
    t.same(
      convertAll(input, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      ` a"`,
      "05"
    );
    t.end();
  }
);
