// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// XML (sprinkled within HTML)
// -----------------------------------------------------------------------------

test("001 - strips XML - strips Outlook XML fix block, tight", () => {
  let input = `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "001.01");
  equal(rApply(input, stripHtml(input).ranges), result, "001.02");
});

test("002 - strips XML - strips Outlook XML fix block, leading space", () => {
  let input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "002.01");
  equal(rApply(input, stripHtml(input).ranges), result, "002.02");
});

test("003 - strips XML - strips Outlook XML fix block, trailing space", () => {
  let input = `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "003.01");
  equal(rApply(input, stripHtml(input).ranges), result, "003.02");
});

test("004 - strips XML - strips Outlook XML fix block, spaces around", () => {
  let input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "004.01");
  equal(rApply(input, stripHtml(input).ranges), result, "004.02");
});

test("005 - strips XML - generous trailing space", () => {
  let input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`;
  let result = "abc\n\ndef";
  equal(stripHtml(input).result, result, "005.01");
  equal(rApply(input, stripHtml(input).ranges), result, "005.02");
});

test("006 - strips XML - text-whitespace-tag", () => {
  let input = `abc  <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "006.01");
  equal(ranges, [[3, 159]], "006.02");
  equal(rApply(input, ranges), result, "006.03");
});

test("007 - strips XML - text-tabs-tag", () => {
  let input = `abc\t\t<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "007.01");
  equal(rApply(input, ranges), result, "007.02");
});

test("008 - strips XML - tag-whitespace-text", () => {
  let input = `    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->  abc

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "008.01");
  equal(rApply(input, ranges), result, "008.02");
});

test("009 - strips XML - tag-tabs-text", () => {
  let input = `    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->\t\tabc

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "009.01");
  equal(rApply(input, ranges), result, "009.02");
});

test("010 - strips XML - leading content", () => {
  let input = `abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "010.01");
  equal(rApply(input, ranges), result, "010.02");
});

test("011 - strips XML - leading content", () => {
  let input = `      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "011.01");
  equal(rApply(input, ranges), result, "011.02");
});

test.run();
