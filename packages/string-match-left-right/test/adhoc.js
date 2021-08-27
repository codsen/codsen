import tap from "tap";
import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

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

tap.test(`10`, (t) => {
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 23, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    false,
    "10.01"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 23, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "10.02"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 23, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "10.03"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 23, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "10.04"
  );
  t.end();
});

tap.test(`11`, (t) => {
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 24, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "11.01"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 24, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "11.02"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 24, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    false,
    "11.03"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 24, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "11.04"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 24, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "11.05"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !important}`, 24, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "11.06"
  );
  t.end();
});

tap.test(`12`, (t) => {
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !impotant}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "12.01"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !impotant}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "12.02"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !impotant}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    "!important",
    "12.03"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !impotant}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    "!important",
    "12.04"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !impotant}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "12.05"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !impotant}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    "!important",
    "12.06"
  );
  t.end();
});

tap.test(`13`, (t) => {
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !IMPOR.TANT}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "13.01"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !IMPOR.TANT}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "13.02"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !IMPOR.TANT}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    "!important",
    "13.03"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !IMPOR.TANT}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    "!important",
    "13.04"
  );

  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !IMPOR.TANT}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "13.05"
  );
  t.equal(
    matchRight(`.a{padding:1px 2px 3px 4px !IMPOR.TANT}`, 26, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    "!important",
    "13.06"
  );
  t.end();
});

tap.test(`14`, (t) => {
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 18, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "14.01"
  );
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 19, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    "!important",
    "14.02"
  );
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 18, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "14.03"
  );
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 19, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "14.04"
  );

  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 18, ["!important"], {
      i: false,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "14.05"
  );
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 19, ["!important"], {
      i: false,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "14.06"
  );
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 18, ["!important"], {
      i: false,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "14.07"
  );
  t.equal(
    matchRightIncl(`<style>.a{color:red!IMPOTANT;}`, 19, ["!important"], {
      i: false,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "14.08"
  );
  t.end();
});

tap.test(`15`, (t) => {
  t.equal(
    matchRightIncl(`abc important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 0,
    }),
    false,
    "15.01"
  );
  t.equal(
    matchRightIncl(`abc important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "15.02"
  );
  t.equal(
    matchRightIncl(`abc important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: true,
      maxMismatches: 2,
    }),
    false,
    "15.03"
  );

  t.equal(
    matchRightIncl(`abc important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 0,
    }),
    false,
    "15.04"
  );
  t.equal(
    matchRightIncl(`abc important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 1,
    }),
    false,
    "15.05"
  );
  t.equal(
    matchRightIncl(`abc important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "15.06"
  );
  t.end();
});

tap.test(`16 - tight`, (t) => {
  t.equal(
    matchRight(`1px!important}`, 0, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "16.01"
  );
  t.equal(
    matchRight(`1px!important}`, 1, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "16.02"
  );
  t.equal(
    matchRight(`1px!important}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "16.03"
  );
  t.end();
});

tap.test(`17 - tight`, (t) => {
  t.equal(
    matchRight(`1pximportant}`, 0, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "17.01"
  );
  t.equal(
    matchRight(`1pximportant}`, 1, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "17.02"
  );
  t.equal(
    matchRight(`1pximportant}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "17.03"
  );
  t.end();
});

tap.test(`18 - tight`, (t) => {
  t.equal(
    matchRightIncl(`1pximportant}`, 0, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "18.01"
  );
  t.equal(
    matchRightIncl(`1pximportant}`, 1, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "18.02"
  );
  t.equal(
    matchRightIncl(`1pximportant}`, 2, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    false,
    "18.03"
  );
  t.equal(
    matchRightIncl(`1pximportant}`, 3, ["!important"], {
      i: true,
      trimBeforeMatching: false,
      maxMismatches: 2,
    }),
    "!important",
    "18.04"
  );
  t.end();
});
