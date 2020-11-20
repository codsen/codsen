import tap from "tap";
import { removeWidows, version } from "../dist/string-remove-widows.esm";
import {
  rawnbsp,
  encodedNbspHtml,
  // encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "../src/util";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// api bits
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported removeWidows() is a function`,
  (t) => {
    t.equal(typeof removeWidows, `function`, `01`);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`,
  (t) => {
    t.equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, `02`);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - sanity check`,
  (t) => {
    t.equal(rawnbsp, `\u00A0`, `03.01`);
    t.equal(encodedNbspHtml, `${encodedNbspHtml}`, `03.02`);
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - empty opts obj`,
  (t) => {
    t.equal(removeWidows(`aaa bbb ccc`, {}).res, `aaa bbb ccc`, "04");
    t.end();
  }
);
