// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test("001 - ad-hoc - improvised arrows are not mangled, convertEntities=off", () => {
  mixer({
    convertEntities: false,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "something ----> anything", opt).res,
      "something ----> anything",
      `001.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("002 - ad-hoc - improvised arrows are not mangled, convertEntities=on", () => {
  mixer({
    convertEntities: true,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "something ----> anything", opt).res,
      "something ----&gt; anything",
      `002.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("003 - ad-hoc - improvised arrows are not mangled, convertEntities=off", () => {
  mixer({
    convertEntities: false,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "something ---> anything --> everything -> thing", opt)
        .res,
      "something ---> anything --> everything -> thing",
      `003.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("004 - ad-hoc - widow removal and single space between ] and (", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaaaaa bbbbbbb [cccccc] (ddddddd)", opt).res,
      "aaaaaa bbbbbbb [cccccc]&nbsp;(ddddddd)",
      `004.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("005 - ad-hoc - unlinked .co.uk in the text, removeWidows=on", () => {
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
        opt,
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
      `005.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("006 - ad-hoc - unlinked .co.uk in the text, removeWidows=off", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt,
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
      `006.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("007 - ad-hoc - consecutive empty lines full of whitespace symbols", () => {
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
        opt,
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
      `007.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("008 - ad-hoc - less than sign", () => {
  mixer({
    convertEntities: true,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a < b", opt).res,
      "a &lt; b",
      `008.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("009 - ad-hoc - greater than sign", () => {
  mixer({
    convertEntities: true,
    removeLineBreaks: true,
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a > b", opt).res,
      "a &gt; b",
      `009.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });

  compare(
    ok,
    det1("a > b", {
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
    "09",
  );
});

test("010 - ad-hoc - custom EOL - CRLF present, CR requested", () => {
  let source = "aaa\r\n\r\nbbb\r\n\r\nccc";
  let opts = {
    eol: "cr",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "010.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "10.02");
});

test("011 - ad-hoc - custom EOL - CRLF present, LF requested", () => {
  let source = "aaa\r\n\r\nbbb\r\n\r\nccc";
  let opts = {
    eol: "lf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "011.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "11.02");
});

test("012 - ad-hoc - custom EOL - CRLF present, CRLF requested", () => {
  let source = "aaa\r\n\r\nbbb\r\n\r\nccc";
  let opts = {
    eol: "crlf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "012.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "12.02");
});

test("013 - ad-hoc - custom EOL - LF present, CR requested", () => {
  let source = "aaa\n\nbbb\n\nccc";
  let opts = {
    eol: "cr",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "013.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "13.02");
});

test("014 - ad-hoc - custom EOL - LF present, LF requested", () => {
  let source = "aaa\n\nbbb\n\nccc";
  let opts = {
    eol: "lf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "014.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "14.02");
});

test("015 - ad-hoc - custom EOL - LF present, CRLF requested", () => {
  let source = "aaa\n\nbbb\n\nccc";
  let opts = {
    eol: "crlf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "015.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "15.02");
});

test("016 - ad-hoc - custom EOL - CR present, CR requested", () => {
  let source = "aaa\r\rbbb\r\rccc";
  let opts = {
    eol: "cr",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "016.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "16.02");
});

test("017 - ad-hoc - custom EOL - CR present, LF requested", () => {
  let source = "aaa\r\rbbb\r\rccc";
  let opts = {
    eol: "lf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "017.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "17.02");
});

test("018 - ad-hoc - custom EOL - CR present, CRLF requested", () => {
  let source = "aaa\r\rbbb\r\rccc";
  let opts = {
    eol: "crlf",
  };
  equal(
    det(ok, not, 0, source, opts).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "018.01",
  );
  ok(det1(source, opts).applicableOpts.eol, "18.02");
});

test.run();
