import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test(`01 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `something ----> anything`, opt).res,
      "something ----> anything",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=on`, () => {
  mixer({
    convertEntities: true,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `something ----> anything`, opt).res,
      "something ----&gt; anything",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`, () => {
  mixer({
    convertEntities: false,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `something ---> anything --> everything -> thing`, opt)
        .res,
      "something ---> anything --> everything -> thing",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - widow removal and single space between ] and (`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaaaaa bbbbbbb [cccccc] (ddddddd)`, opt).res,
      "aaaaaa bbbbbbb [cccccc]&nbsp;(ddddddd)",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=on`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=off`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - consecutive empty lines full of whitespace symbols`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - less than sign`, () => {
  mixer({
    convertEntities: true,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a < b`, opt).res,
      "a &lt; b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - greater than sign`, () => {
  mixer({
    convertEntities: true,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a > b`, opt).res,
      "a &gt; b",
      JSON.stringify(opt, null, 0)
    );
  });

  compare(
    ok,
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
});

test(`10 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, CR requested`, () => {
  let source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
  let opts = {
    eol: "cr",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "10.01 - CR requested"
  );
  ok(det1(source, opts).applicableOpts.eol, "10.02");
});

test(`11 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, LF requested`, () => {
  let source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
  let opts = {
    eol: "lf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "11.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "11.02");
});

test(`12 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, CRLF requested`, () => {
  let source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
  let opts = {
    eol: "crlf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "12.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "12.02");
});

test(`13 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, CR requested`, () => {
  let source = `aaa\n\nbbb\n\nccc`;
  let opts = {
    eol: "cr",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "13.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "13.02");
});

test(`14 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, LF requested`, () => {
  let source = `aaa\n\nbbb\n\nccc`;
  let opts = {
    eol: "lf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "14.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "14.02");
});

test(`15 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, CRLF requested`, () => {
  let source = `aaa\n\nbbb\n\nccc`;
  let opts = {
    eol: "crlf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "15.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "15.02");
});

test(`16 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, CR requested`, () => {
  let source = `aaa\r\rbbb\r\rccc`;
  let opts = {
    eol: "cr",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "16.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "16.02");
});

test(`17 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, LF requested`, () => {
  let source = `aaa\r\rbbb\r\rccc`;
  let opts = {
    eol: "lf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "17.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "17.02");
});

test(`18 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, CRLF requested`, () => {
  let source = `aaa\r\rbbb\r\rccc`;
  let opts = {
    eol: "crlf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "18.01"
  );
  ok(det1(source, opts).applicableOpts.eol, "18.02");
});

test.run();
