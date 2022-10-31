import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rApply } from "ranges-apply";

import { stripHtml } from "./util/noLog.js";

// XML (sprinkled within HTML)
// -----------------------------------------------------------------------------

test("01 - strips XML - strips Outlook XML fix block, tight", () => {
  let input = `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "01.01");
  equal(rApply(input, stripHtml(input).ranges), result, "01.02");
});

test("02 - strips XML - strips Outlook XML fix block, leading space", () => {
  let input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "02.01");
  equal(rApply(input, stripHtml(input).ranges), result, "02.02");
});

test("03 - strips XML - strips Outlook XML fix block, trailing space", () => {
  let input = `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "03.01");
  equal(rApply(input, stripHtml(input).ranges), result, "03.02");
});

test("04 - strips XML - strips Outlook XML fix block, spaces around", () => {
  let input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`;
  let result = "abc def";
  equal(stripHtml(input).result, result, "04.01");
  equal(rApply(input, stripHtml(input).ranges), result, "04.02");
});

test("05 - strips XML - generous trailing space", () => {
  let input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`;
  let result = "abc\n\ndef";
  equal(stripHtml(input).result, result, "05.01");
  equal(rApply(input, stripHtml(input).ranges), result, "05.02");
});

test("06 - strips XML - text-whitespace-tag", () => {
  let input = `abc  <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "06.01");
  equal(ranges, [[3, 159]], "06.02");
  equal(rApply(input, ranges), result, "06.03");
});

test("07 - strips XML - text-tabs-tag", () => {
  let input = `abc\t\t<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "07.01");
  equal(rApply(input, ranges), result, "07.02");
});

test("08 - strips XML - tag-whitespace-text", () => {
  let input = `    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->  abc

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "08.01");
  equal(rApply(input, ranges), result, "08.02");
});

test("09 - strips XML - tag-tabs-text", () => {
  let input = `    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->\t\tabc

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "09.01");
  equal(rApply(input, ranges), result, "09.02");
});

test("10 - strips XML - leading content", () => {
  let input = `abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "10.01");
  equal(rApply(input, ranges), result, "10.02");
});

test("11 - strips XML - leading content", () => {
  let input = `      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`;
  let { result, ranges } = stripHtml(input);
  equal(result, "abc", "11.01");
  equal(rApply(input, ranges), result, "11.02");
});

test.run();
