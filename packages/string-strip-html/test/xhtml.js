import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// XML (sprinkled within HTML)
// -----------------------------------------------------------------------------

tap.test("01 - strips XML - strips Outlook XML fix block, tight", (t) => {
  t.same(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    "abc def",
    "01"
  );
  t.end();
});

tap.test(
  "02 - strips XML - strips Outlook XML fix block, leading space",
  (t) => {
    t.same(
      stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
      "abc def",
      "02"
    );
    t.end();
  }
);

tap.test(
  "03 - strips XML - strips Outlook XML fix block, trailing space",
  (t) => {
    t.same(
      stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
      "abc def",
      "03"
    );
    t.end();
  }
);

tap.test(
  "04 - strips XML - strips Outlook XML fix block, spaces around",
  (t) => {
    t.same(
      stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
      "abc def",
      "04"
    );
    t.end();
  }
);

tap.test("05 - strips XML - generous trailing space", (t) => {
  t.same(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`),
    "abc\n\ndef",
    "05"
  );
  t.end();
});

tap.test("06 - strips XML - trailing linebreaks", (t) => {
  t.same(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `),
    "abc",
    "06"
  );
  t.end();
});

tap.test("07 - strips XML - leading content", (t) => {
  t.same(
    stripHtml(`abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `),
    "abc",
    "07"
  );
  t.end();
});

tap.test("08 - strips XML - leading content", (t) => {
  t.same(
    stripHtml(`      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`),
    "abc",
    "08"
  );
  t.end();
});
