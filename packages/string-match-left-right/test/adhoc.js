import tap from "tap";
import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm";

// 13. Ad-hoc
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(matchRight('<a class="something"> text', 19, ">"), ">", "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight('<a class="something"> text', 19, ">", {
        cb: (char) => typeof char === "string" && char.trim() === "",
      }),
      ">",
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRightIncl('<a class="something"> text', 20, "> t"),
      "> t",
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(matchRight('<a class="something"> text', 19, "> t"), "> t", "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight("ab      cdef", 1, "cde", { trimBeforeMatching: true }),
      "cde",
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight('<a class="something"> text', 19, ">", {
        cb: (char) => char === " ",
      }),
      ">",
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight("ab      cdef", 1, "cde", {
        cb: (char) => char === "f",
        trimBeforeMatching: true,
      }),
      "cde",
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    matchRight("ab      cdef", 1, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      },
    });
    t.end();
  }
);

tap.test(`09 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, set #02`, (t) => {
  t.equal(
    matchRight("a<!DOCTYPE html>b", 1, ["!--", "doctype", "xml", "cdata"], {
      i: true,
      trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
    }),
    "doctype",
    "09"
  );
  t.end();
});
