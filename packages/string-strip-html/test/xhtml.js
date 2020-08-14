import tap from "tap";
import applyR from "ranges-apply";
import stripHtml from "../dist/string-strip-html.esm";

// XML (sprinkled within HTML)
// -----------------------------------------------------------------------------

tap.test("01 - strips XML - strips Outlook XML fix block, tight", (t) => {
  const input = `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`;
  const res = "abc def";
  t.same(stripHtml(input), res, "01.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "01.02"
  );
  t.end();
});

tap.test(
  "02 - strips XML - strips Outlook XML fix block, leading space",
  (t) => {
    const input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`;
    const res = "abc def";
    t.same(stripHtml(input), res, "02.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      res,
      "02.02"
    );
    t.end();
  }
);

tap.test(
  "03 - strips XML - strips Outlook XML fix block, trailing space",
  (t) => {
    const input = `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`;
    const res = "abc def";
    t.same(stripHtml(input), res, "03.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      res,
      "03.02"
    );
    t.end();
  }
);

tap.test(
  "04 - strips XML - strips Outlook XML fix block, spaces around",
  (t) => {
    const input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`;
    const res = "abc def";
    t.same(stripHtml(input), res, "04.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      res,
      "04.02"
    );
    t.end();
  }
);

tap.test("05 - strips XML - generous trailing space", (t) => {
  const input = `abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`;
  const res = "abc\n\ndef";
  t.same(stripHtml(input), res, "05.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "05.02"
  );
  t.end();
});

tap.test("06 - strips XML - text-whitespace-tag", (t) => {
  const input = `abc  <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `;
  const res = "abc";
  t.same(stripHtml(input), res, "06.01");
  t.same(stripHtml(input, { returnRangesOnly: true }), [[3, 159]], "06.02");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "06.03"
  );
  t.end();
});

tap.test("07 - strips XML - text-tabs-tag", (t) => {
  const input = `abc\t\t<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `;
  const res = "abc";
  t.same(stripHtml(input), res, "07.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "07.02"
  );
  t.end();
});

tap.test("08 - strips XML - tag-whitespace-text", (t) => {
  const input = `    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->  abc

  `;
  const res = "abc";
  t.same(stripHtml(input), res, "08.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "08.02"
  );
  t.end();
});

tap.test("09 - strips XML - tag-tabs-text", (t) => {
  const input = `    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->\t\tabc

  `;
  const res = "abc";
  t.same(stripHtml(input), res, "09.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "09.02"
  );
  t.end();
});

tap.test("10 - strips XML - leading content", (t) => {
  const input = `abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `;
  const res = "abc";
  t.same(stripHtml(input), res, "10.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "10.02"
  );
  t.end();
});

tap.test("11 - strips XML - leading content", (t) => {
  const input = `      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`;
  const res = "abc";
  t.same(stripHtml(input), res, "11.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "11.02"
  );
  t.end();
});
