import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// ==============================
// opts.stripHtmlButIgnoreTags
// ==============================

test("01 - simple case", () => {
  equal(det(ok, not, 0, "a <div><a>z</a></div> c").res, "a z c", "01.01");
});

test("02 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "a",
    }).res,
    "a <a>z</a> c",
    "02.01",
  );
});

test("03 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a"],
    }).res,
    "a <a>z</a> c",
    "03.01",
  );
});

test("04 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "div",
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "04.01",
  );
});

test("05 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["div"],
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "05.01",
  );
});

test("06 - both tags ignored", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a", "div"],
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "06.01",
  );
});

test("07 - other tags ignored, not present in the input", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["article", "z"],
      removeWidows: false,
    }).res,
    "a z c",
    "07.01",
  );
});

test("08 - control for stripHtml", () => {
  equal(det(ok, not, 0, "a <div><a>z</a></div> c").res, "a z c", "08.01");
});

test("09 - no ignores", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "09.01",
  );
});

test("10 - no ignores", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "10.01",
  );
});

test("11 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "a",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "11.01",
  );
});

test("12 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "a",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "12.01",
  );
});

test("13 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "13.01",
  );
});

test("14 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "14.01",
  );
});

test("15 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "div",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "15.01",
  );
});

test("16 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "div",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "16.01",
  );
});

test("17 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "17.01",
  );
});

test("18 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "18.01",
  );
});

test("19 - both tags ignored", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "19.01",
  );
});

test("20 - both tags ignored", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "20.01",
  );
});

test("21 - other tags ignored, not present in the input", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "21.01",
  );
});

test("22 - other tags ignored, not present in the input", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "22.01",
  );
});

test("23 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtmlButIgnoreTags: [],
      stripHtml: true,
    }).res,
    "",
    "23.01",
  );
});

test("24 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtml: true,
    }).res,
    "<sup>",
    "24.01",
  );
});

test("25 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtmlButIgnoreTags: ["sup"],
      stripHtml: true,
    }).res,
    "<sup>",
    "25.01",
  );
});

test("26 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
    }).res,
    "",
    "26.01",
  );
});

test("27 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["a", "b", "c"],
      stripHtml: true,
    }).res,
    "<a><b><c>",
    "27.01",
  );
});

test("28 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["sup", "b", "c"],
      stripHtml: true,
    }).res,
    "<sup><b><c>",
    "28.01",
  );
});

test("29 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["sup", "a", "c"],
      stripHtml: true,
    }).res,
    "<sup><a><c>",
    "29.01",
  );
});

test("30 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["sup", "a", "b"],
      stripHtml: true,
    }).res,
    "<sup><a><b>",
    "30.01",
  );
});

test("31 - br variations, not ignored", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "31.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "31.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "31.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "31.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "31.05",
    );
  });
});

test("32 - br variations, not ignored", () => {
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "32.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "32.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "32.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "32.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "32.05",
    );
  });
});

test("33 - br variations, not ignored", () => {
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "33.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "33.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "33.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "33.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "33.05",
    );
  });
});

test("34 - br variations, ignored", () => {
  // useXHTML=false
  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "34.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "34.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "34.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "34.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "34.05",
    );
  });
});

test("35 - br variations, ignored", () => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    // useXHTML=true
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "35.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "35.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "35.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "35.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "35.05",
    );
  });
});

test("36 - br variations, ignored", () => {
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "36.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "36.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "36.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "36.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "36.05",
    );
  });
});

test("37 - br variations, ignored", () => {
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "37.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "37.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "37.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "37.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "37.05",
    );
  });
});

test("38 - br variations, not ignored - stripHtmlAddNewLine br", () => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "38.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "38.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "38.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "38.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "38.05",
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "38.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "38.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "38.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "38.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "38.10",
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "38.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "38.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "38.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "38.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "38.15",
    );
  });
});

test("39 - br variations, ignored - stripHtmlAddNewLine br", () => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.05",
    );
  });
  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.10",
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "39.15",
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.16",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.17",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.18",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.19",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "39.20",
    );
  });
});

test("40 - br variations, not ignored - stripHtmlAddNewLine br/", () => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "40.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "40.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "40.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "40.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "40.05",
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "40.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "40.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "40.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "40.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "40.10",
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "40.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "40.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "40.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "40.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "40.15",
    );
  });
});

test("41 - strip but ignore", () => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.05",
    );
  });

  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.10",
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "41.15",
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "abc<br/>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.16",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.17",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.18",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.19",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "41.20",
    );
  });
});

test.run();
