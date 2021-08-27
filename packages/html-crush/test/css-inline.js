import tap from "tap";
import { m } from "./util/util.js";

// 08. inline CSS minification
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - one tag, minimal - double quotes`,
  (t) => {
    const input1 = `  <a style="a: 100%; b: c-d; ">`;
    const indentationsOnly = `<a style="a: 100%; b: c-d; ">`;
    t.strictSame(
      m(t, input1, {
        removeLineBreaks: true,
      }).result,
      `<a style="a:100%;b:c-d;">`,
      "01.01"
    );
    t.strictSame(
      m(t, input1, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      `<a style="a:100%;b:c-d;">`,
      "01.02"
    );
    t.strictSame(
      m(t, input1, {
        removeLineBreaks: false,
      }).result,
      indentationsOnly,
      "01.03 - indentations are removed on default settings"
    );
    t.strictSame(
      m(t, input1, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      input1,
      "01.04 - indentations off"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - inline CSS comments`,
  (t) => {
    t.strictSame(
      m(t, `<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
      }).result,
      `<a style="a:100%;e:f;">`,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - line length limit falls in the middle of inline CSS comment`,
  (t) => {
    t.strictSame(
      m(t, `<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
        lineLengthLimit: 18,
      }).result,
      `<a style="a:100%;\ne:f;">`,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - line length becomes all right because of truncation`,
  (t) => {
    t.strictSame(
      m(t, `<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
        lineLengthLimit: 30,
      }).result,
      `<a style="a:100%;e:f;">`,
      "04 - deletion makes it to be within a limit"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - leading whitespace inside double quotes`,
  (t) => {
    t.strictSame(
      m(t, `<a href="zzz" style=" font-size: 1px; ">`, {
        removeLineBreaks: true,
      }).result,
      `<a href="zzz" style="font-size:1px;">`,
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - leading whitespace inside single quotes`,
  (t) => {
    t.strictSame(
      m(t, `<a href='zzz' style=' font-size: 1px; '>`, {
        removeLineBreaks: true,
      }).result,
      `<a href='zzz' style='font-size:1px;'>`,
      "06"
    );
    t.end();
  }
);
