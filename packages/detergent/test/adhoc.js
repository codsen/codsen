import tap from "tap";
import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(
  `01 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `something ----> anything`, opt).res,
        "something ----> anything",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `something ----> anything`, opt).res,
        "something ----&gt; anything",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `something ---> anything --> everything -> thing`, opt).res,
        "something ---> anything --> everything -> thing",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - widow removal and single space between ] and (`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaaaaa bbbbbbb [cccccc] (ddddddd)`, opt).res,
        "aaaaaa bbbbbbb [cccccc]&nbsp;(ddddddd)",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
          opt
        ).res,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=off`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
          opt
        ).res,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - consecutive empty lines full of whitespace symbols`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
          opt
        ).res,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - less than sign`,
  (t) => {
    mixer({
      convertEntities: true,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a < b`, opt).res,
        "a &lt; b",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - greater than sign`,
  (t) => {
    mixer({
      convertEntities: true,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a > b`, opt).res,
        "a &gt; b",
        JSON.stringify(opt, null, 0)
      );
    });

    t.match(
      det1(`a > b`, {
        convertEntities: true,
      }),
      {
        res: "a &gt; b",
        applicableOpts: {
          fixBrokenEntities: false,
          removeWidows: false,
          convertEntities: true,
          convertDashes: false,
          convertApostrophes: false,
          replaceLineBreaks: false,
          removeLineBreaks: false,
          useXHTML: false,
          dontEncodeNonLatin: false,
          addMissingSpaces: false,
          convertDotsToEllipsis: false,
          stripHtml: false,
          eol: false,
        },
      },
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, CR requested`,
  (t) => {
    const source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
    const opts = {
      eol: "cr",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
      "10.01 - CR requested"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, LF requested`,
  (t) => {
    const source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
    const opts = {
      eol: "lf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "11.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, CRLF requested`,
  (t) => {
    const source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
    const opts = {
      eol: "crlf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
      "12.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, CR requested`,
  (t) => {
    const source = `aaa\n\nbbb\n\nccc`;
    const opts = {
      eol: "cr",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
      "13.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, LF requested`,
  (t) => {
    const source = `aaa\n\nbbb\n\nccc`;
    const opts = {
      eol: "lf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "14.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, CRLF requested`,
  (t) => {
    const source = `aaa\n\nbbb\n\nccc`;
    const opts = {
      eol: "crlf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
      "15.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "15.02");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, CR requested`,
  (t) => {
    const source = `aaa\r\rbbb\r\rccc`;
    const opts = {
      eol: "cr",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
      "16.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "16.02");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, LF requested`,
  (t) => {
    const source = `aaa\r\rbbb\r\rccc`;
    const opts = {
      eol: "lf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "17.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "17.02");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, CRLF requested`,
  (t) => {
    const source = `aaa\r\rbbb\r\rccc`;
    const opts = {
      eol: "crlf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
      "18.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "18.02");
    t.end();
  }
);
