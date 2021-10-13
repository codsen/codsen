import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(`01 - recursive entity de-coding, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&amp;nbsp;`, opt).res,
      `${rawNbsp}`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`02 - recursive entity de-coding, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&amp;pound;`, opt).res,
      "£",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`03 - recursive entity de-coding, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&amp;amp;amp;amp;pound;`, opt).res,
      "£",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`04 - recursive entity de-coding, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&#x26;#xA9;`, opt).res,
      "©",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`05 - recursive entity de-coding, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a&#x26;#x26;amp;b`, opt).res,
      "a&b",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`06 - recursive entity de-coding, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&amp;nbsp;`, opt).res,
      "&nbsp;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`07 - recursive entity de-coding, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&amp;pound;`, opt).res,
      "&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`08 - recursive entity de-coding, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&amp;amp;amp;amp;pound;`, opt).res,
      "&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`09 - recursive entity de-coding, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&#x26;#xA9;`, opt).res,
      "&copy;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`10 - recursive entity de-coding, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a&#x26;#x26;amp;b`, opt).res,
      "a&amp;b",
      JSON.stringify(opt, null, 0)
    );
  });

  t.end();
});
