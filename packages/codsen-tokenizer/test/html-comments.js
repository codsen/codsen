const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. regular comments
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`regular`}\u001b[${39}m`} - simple case`,
  t => {
    const gathered = [];
    ct(`a<!--b-->c`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 1
        },
        {
          type: "comment",
          start: 1,
          end: 5,
          kind: "simple",
          closing: false
        },
        {
          type: "text",
          start: 5,
          end: 6
        },
        {
          type: "comment",
          start: 6,
          end: 9,
          kind: "simple",
          closing: true
        },
        {
          type: "text",
          start: 9,
          end: 10
        }
      ],
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`regular`}\u001b[${39}m`} - broken simple case, with space`,
  t => {
    const gathered = [];
    ct(`a<! --b-- >c`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 1
        },
        {
          type: "comment",
          start: 1,
          end: 6,
          kind: "simple",
          closing: false
        },
        {
          type: "text",
          start: 6,
          end: 7
        },
        {
          type: "comment",
          start: 7,
          end: 11,
          kind: "simple",
          closing: true
        },
        {
          type: "text",
          start: 11,
          end: 12
        }
      ],
      "01.02"
    );
    t.end();
  }
);

// 02. outlook conditionals
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`outlook conditionals`}\u001b[${39}m`} - outlook conditionals with xml, minimal`,
  t => {
    const gathered = [];
    ct(`a<!--[if gte mso 9]>x<![endif]-->z`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 1
        },
        {
          type: "comment",
          start: 1,
          end: 20,
          kind: "only",
          closing: false
        },
        {
          type: "text",
          start: 20,
          end: 21
        },
        {
          type: "comment",
          start: 21,
          end: 33,
          kind: "only",
          closing: true
        },
        {
          type: "text",
          start: 33,
          end: 34
        }
      ],
      "02.01"
    );
    t.end();
  }
);

t.todo(
  `02.02 - ${`\u001b[${35}m${`outlook conditionals`}\u001b[${39}m`} - outlook conditionals with xml, complex`,
  t => {
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
          type: "comment",
          start: 3,
          end: 22
        },
        {
          type: "tag",
          start: 22,
          end: 27
        },
        {
          type: "text",
          start: 5,
          end: 6
        }
      ],
      "02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${35}m${`outlook conditionals`}\u001b[${39}m`} - outlook conditionals with xml, minimal, tag inside`,
  t => {
    const gathered = [];
    ct(`<a><!--[if gte mso 9]><b><![endif]--><i>`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3
        },
        {
          type: "comment",
          start: 3,
          end: 22,
          kind: "only",
          closing: false
        },
        {
          type: "tag",
          start: 22,
          end: 25
        },
        {
          type: "comment",
          start: 25,
          end: 37,
          kind: "only",
          closing: true
        },
        {
          type: "tag",
          start: 37,
          end: 40
        }
      ],
      "02.03"
    );
    t.end();
  }
);

// For a reference:
// ===============

// a<!--b-->c

// abc<!--[if gte mso 9]><xml>
// <o:OfficeDocumentSettings>
// <o:AllowPNG/>
// <o:PixelsPerInch>96</o:PixelsPerInch>
// </o:OfficeDocumentSettings>
// </xml><![endif]-->def

// <!--[if !mso]><!-->
//     <img src="gif">
// <!--<![endif]-->

// <!--[if mso]>
//     <img src="fallback">
// <![endif]-->
