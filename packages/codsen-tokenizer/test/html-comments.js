const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. outlook conditionals
// -----------------------------------------------------------------------------

t.todo("01.01 - outlook conditionals with xml", t => {
  const gathered = [];
  ct(
    `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`,
    {
      tagCb: obj => {
        gathered.push(obj);
      }
    }
  );

  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3
      },
      {
        type: "html",
        start: 2,
        end: 5
      },
      {
        type: "text",
        start: 5,
        end: 6
      }
    ],
    "01.01"
  );
  t.end();
});
