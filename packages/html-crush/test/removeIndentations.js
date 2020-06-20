import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

// opts.removeIndentations
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - collapses whitespace on removeIndentations`,
  (t) => {
    t.same(
      m("a   b\nc    d", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a b\nc d",
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - trailing whitespace on removeIndentations`,
  (t) => {
    t.same(
      m("a   \nb    ", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a\nb",
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - leading whitespace`,
  (t) => {
    t.same(
      m(
        `



<!DOCTYPE HTML>
<html>
<head>
`,
        {
          removeLineBreaks: false,
          removeIndentations: true,
        }
      ).result,
      `<!DOCTYPE HTML>
<html>
<head>
`,
      "03"
    );
    t.end();
  }
);
