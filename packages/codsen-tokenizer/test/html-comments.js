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

t.test(
  `01.03 - ${`\u001b[${36}m${`regular`}\u001b[${39}m`} - dash missing`,
  t => {
    const gathered = [];
    ct(`a<!--b->c`, {
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
          end: 1,
          value: "a"
        },
        {
          type: "comment",
          start: 1,
          end: 5,
          value: "<!--",
          kind: "simple",
          closing: false
        },
        {
          type: "text",
          start: 5,
          end: 9,
          value: "b->c"
        }
      ],
      "01.03"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${36}m${`regular`}\u001b[${39}m`} - dash missing`,
  t => {
    const gathered = [];
    ct(`a<!-b-->c`, {
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
          end: 1,
          value: "a"
        },
        {
          type: "comment",
          start: 1,
          end: 4,
          value: "<!-",
          kind: "simple",
          closing: false
        },
        {
          type: "text",
          start: 4,
          end: 5,
          value: "b"
        },
        {
          type: "comment",
          start: 5,
          end: 8,
          value: "-->",
          kind: "simple",
          closing: true
        },
        {
          type: "text",
          start: 8,
          end: 9,
          value: "c"
        }
      ],
      "01.04"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${36}m${`regular`}\u001b[${39}m`} - dash missing`,
  t => {
    const gathered = [];
    ct(`a<--b-->c`, {
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
          end: 5,
          value: "a<--b"
        },
        {
          type: "comment",
          start: 5,
          end: 8,
          value: "-->",
          kind: "simple",
          closing: true
        },
        {
          type: "text",
          start: 8,
          end: 9,
          value: "c"
        }
      ],
      "01.05"
    );
    t.end();
  }
);

// 02. outlook conditionals: only
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - outlook conditionals, minimal`,
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

t.test(
  `02.02 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - outlook conditionals, complex, with xml`,
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
          end: 22,
          kind: "only",
          closing: false
        },
        {
          type: "tag",
          start: 22,
          end: 27,
          kind: "xml",
          closing: false
        },
        {
          type: "text",
          start: 27,
          end: 135
        },
        {
          type: "tag",
          start: 135,
          end: 141,
          kind: "xml",
          closing: true
        },
        {
          type: "comment",
          start: 141,
          end: 153,
          kind: "only",
          closing: true
        },
        {
          type: "text",
          start: 153,
          end: 156
        }
      ],
      "02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - outlook conditionals, minimal, tag inside`,
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

t.test(
  `02.04 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - missing excl. mark`,
  t => {
    const gathered = [];
    ct(`<!--[if gte mso 9]>x<[endif]-->`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "comment",
          start: 0,
          end: 19,
          value: "<!--[if gte mso 9]>",
          kind: "only",
          closing: false
        },
        {
          type: "text",
          start: 19,
          end: 20,
          value: "x"
        },
        {
          type: "comment",
          start: 20,
          end: 31,
          value: "<[endif]-->",
          kind: "only",
          closing: true
        }
      ],
      "02.04"
    );
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - empty conditional`,
  t => {
    const gathered = [];
    ct(`<!--[if gte mso 9]><![endif]-->`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "comment",
          start: 0,
          end: 19,
          kind: "only",
          closing: false
        },
        {
          type: "comment",
          start: 19,
          end: 31,
          kind: "only",
          closing: true
        }
      ],
      "02.05"
    );
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - swapped excl. mark`,
  t => {
    const gathered = [];
    ct(`<!--[if gte mso 9]>x<[!endif]-->`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "comment",
          start: 0,
          end: 19,
          kind: "only",
          closing: false
        },
        {
          type: "text",
          start: 19,
          end: 20
        },
        {
          type: "comment",
          start: 20,
          end: 32,
          kind: "only",
          closing: true
        }
      ],
      "02.06"
    );
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${35}m${`kind - only`}\u001b[${39}m`} - 1 instead of !`,
  t => {
    const gathered = [];
    ct(`<!--[if gte mso 9]>x<1[endif]-->`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });

    t.match(
      gathered,
      [
        {
          type: "comment",
          start: 0,
          end: 19,
          kind: "only",
          closing: false
        },
        {
          type: "text",
          start: 19,
          end: 20
        },
        {
          type: "comment",
          start: 20,
          end: 32,
          value: "<1[endif]-->",
          kind: "only",
          closing: true
        }
      ],
      "02.07"
    );
    t.end();
  }
);

// 03. outlook conditionals: only-not
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`kind - only not`}\u001b[${39}m`} - outlook conditionals with xml, minimal`,
  t => {
    const gathered = [];
    ct(`a<!--[if !mso]><!-->x<!--<![endif]-->z`, {
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
          kind: "not",
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
          end: 37,
          kind: "not",
          closing: true
        },
        {
          type: "text",
          start: 37,
          end: 38
        }
      ],
      "03.01"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------

// For a reference:
// ===============

// a<!--b-->c

// abc<!--[if gte mso 9]><xml>
// <o:OfficeDocumentSettings>
// <o:AllowPNG/>
// <o:PixelsPerInch>96</o:PixelsPerInch>
// </o:OfficeDocumentSettings>
// </xml><![endif]-->def

// <!--[if mso]>
//     <img src="fallback">
// <![endif]-->

// <!--[if !mso]><!-->
//     <img src="gif">
// <!--<![endif]-->
