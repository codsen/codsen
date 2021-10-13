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
  `01 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - minimal case`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "z <ul><li>y", opt).res,
        "z\ny",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, removeLineBreaks=on`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
          opt
        ).res,
        "Text First point Second point Third point Text straight after",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<li>b`, opt).res,
        "a\nb",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
          opt
        ).res,
        "Text\nFirst point\nSecond point\nThird point\nText straight after",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=on`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: true,
      useXHTML: true,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
          opt
        ).res,
        "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
        JSON.stringify(opt, null, 0)
      );
    });

    t.equal(
      det1(
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        {
          removeLineBreaks: false,
          removeWidows: false,
          replaceLineBreaks: true,
          useXHTML: true,
          stripHtml: true,
        }
      ).res,
      "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
      "05"
    );

    t.end();
  }
);
