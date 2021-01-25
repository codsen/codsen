import tap from "tap";
import { m } from "./util/util";

// whitespace around tag brackets, inside tag
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - whitespace before closing bracket on opening tag`,
  (t) => {
    t.strictSame(
      m(t, `x<a >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a>y`,
      "01.01"
    );
    t.strictSame(
      m(t, `x<a > y`, {
        removeLineBreaks: true,
      }).result,
      `x<a> y`,
      "01.02"
    );
    t.strictSame(
      m(t, `x<a>y`, {
        removeLineBreaks: true,
      }).result,
      `x<a>y`,
      "01.03"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - div - block level`,
  (t) => {
    t.strictSame(
      m(t, `x<div >y`, {
        removeLineBreaks: true,
      }).result,
      `x<div>y`,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - a - inline tag`,
  (t) => {
    t.strictSame(
      m(t, `x<a >y`, {
        removeLineBreaks: false,
      }).result,
      `x<a>y`,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - removeLineBreaks = off`,
  (t) => {
    t.strictSame(
      m(t, `x<div >y`, {
        removeLineBreaks: false,
      }).result,
      `x<div>y`,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - all opts off, inline tag`,
  (t) => {
    t.strictSame(
      m(t, `x<a >y`, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      `x<a>y`,
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - all opts off, block level tag`,
  (t) => {
    t.strictSame(
      m(t, `x<div >y`, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      `x<div>y`,
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - before closing slash`,
  (t) => {
    t.strictSame(
      m(t, `x<a />y`, {
        removeLineBreaks: true,
      }).result,
      `x<a/>y`,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - after closing slash`,
  (t) => {
    t.strictSame(
      m(t, `x<a/ >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a/>y`,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - around closing slash`,
  (t) => {
    t.strictSame(
      m(t, `x<a / >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a/>y`,
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - around closing slash - non inline tag`,
  (t) => {
    t.strictSame(
      m(t, `x<div / >y`, {
        removeLineBreaks: true,
      }).result,
      `x<div/>y`,
      "10"
    );
    t.end();
  }
);
