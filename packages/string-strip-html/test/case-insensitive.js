import { test } from "uvu";
import { equal } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("001 - default paired tags are case-insensitive", () => {
  equal(stripHtml("a<SCRIPT>x</SCRIPT>b").result, "a b", "001.01");
  equal(stripHtml("a<script>x</SCRIPT>b").result, "a b", "001.02");
  equal(stripHtml("a<StYlE>x</sTyLe>b").result, "a b", "001.03");
  equal(
    stripHtml('a<SCRIPT>if (x < y) { const tag = "<div>"; }</sCrIpT>b').result,
    "a b",
    "001.04",
  );
});

test("002 - configured paired tags are case-insensitive", () => {
  equal(
    stripHtml("a<DiV>x</dIv>b", {
      stripTogetherWithTheirContents: ["DIV"],
    }).result,
    "a b",
    "002.01",
  );
});

test("003 - href dumping matches mixed-case anchor tags", () => {
  equal(
    stripHtml('<A HREF="https://example.test">link</a>', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "link https://example.test",
    "003.01",
  );
  equal(
    stripHtml('<a href="https://example.test">link</A>', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "link https://example.test",
    "003.02",
  );
});

test.run();
