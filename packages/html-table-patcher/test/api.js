import tap from "tap";
import { patcher, defaults, version } from "../dist/html-table-patcher.esm";

// checking the API bits
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - defaults`,
  (t) => {
    t.ok(typeof defaults === "object", "01.01");
    t.ok(Object.keys(defaults).length > 0, "01.02");
    t.end();
  }
);

tap.test(`02 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - version`, (t) => {
  t.match(version, /\d*\.\d*\.\d*/, "02");
  t.end();
});

tap.test(
  `03 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - patcher()`,
  (t) => {
    t.is(patcher(1).result, 1, "03.01");
    t.is(patcher(false).result, false, "03.02");
    t.is(patcher(null).result, null, "03.03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - opts.opts.cssStylesContent`,
  (t) => {
    t.is(
      patcher("<a>", {
        cssStylesContent: 9,
      }).result,
      "<a>",
      "04.01"
    );
    t.is(
      patcher(false, {
        cssStylesContent: "",
      }).result,
      false,
      "04.02"
    );
    t.is(
      patcher(null, {
        cssStylesContent: 9,
      }).result,
      null,
      "04.03"
    );
    t.end();
  }
);
