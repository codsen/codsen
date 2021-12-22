import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// ==============================
// opts.stripHtmlButIgnoreTags
// ==============================

test(`01 - simple case`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`).res,
    "a z c",
    "01 - control"
  );
});

test(`02 - single tag to ignore, given as string`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "a",
    }).res,
    "a <a>z</a> c",
    "02"
  );
});

test(`03 - single tag to ignore, given as string in an array`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a"],
    }).res,
    "a <a>z</a> c",
    "03"
  );
});

test(`04 - single tag to ignore, given as string`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "div",
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "04"
  );
});

test(`05 - single tag to ignore, given as string in an array`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["div"],
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "05"
  );
});

test(`06 - both tags ignored`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a", "div"],
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "06"
  );
});

test(`07 - other tags ignored, not present in the input`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["article", "z"],
      removeWidows: false,
    }).res,
    "a z c",
    "07"
  );
});

test(`08 - control for stripHtml`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`).res,
    "a z c",
    "08 - control"
  );
});

test(`09 - no ignores`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "09"
  );
});

test(`10 - no ignores`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "10"
  );
});

test(`11 - single tag to ignore, given as string`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "a",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "11"
  );
});

test(`12 - single tag to ignore, given as string`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "a",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "12"
  );
});

test(`13 - single tag to ignore, given as string in an array`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "13"
  );
});

test(`14 - single tag to ignore, given as string in an array`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "14"
  );
});

test(`15 - single tag to ignore, given as string`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "div",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "15"
  );
});

test(`16 - single tag to ignore, given as string`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "div",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "16"
  );
});

test(`17 - single tag to ignore, given as string in an array`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "17"
  );
});

test(`18 - single tag to ignore, given as string in an array`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "18"
  );
});

test(`19 - both tags ignored`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "19"
  );
});

test(`20 - both tags ignored`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "20"
  );
});

test(`21 - other tags ignored, not present in the input`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "21"
  );
});

test(`22 - other tags ignored, not present in the input`, () => {
  equal(
    det(ok, not, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "22"
  );
});

test(`23 - ad hoc - one tag`, () => {
  equal(
    det(ok, not, 0, `<sup>`, {
      stripHtmlButIgnoreTags: [],
      stripHtml: true,
    }).res,
    "",
    "23"
  );
});

test(`24 - ad hoc - one tag`, () => {
  equal(
    det(ok, not, 0, `<sup>`, {
      stripHtml: true,
    }).res,
    "<sup>",
    "24"
  );
});

test(`25 - ad hoc - one tag`, () => {
  equal(
    det(ok, not, 0, `<sup>`, {
      stripHtmlButIgnoreTags: ["sup"],
      stripHtml: true,
    }).res,
    "<sup>",
    "25"
  );
});

test(`26 - ad hoc - one tag`, () => {
  equal(
    det(ok, not, 0, `<sup>`, {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
    }).res,
    "",
    "26"
  );
});

test(`27 - ad hoc - four tags`, () => {
  equal(
    det(ok, not, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["a", "b", "c"],
      stripHtml: true,
    }).res,
    "<a><b><c>",
    "27"
  );
});

test(`28 - ad hoc - four tags`, () => {
  equal(
    det(ok, not, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["sup", "b", "c"],
      stripHtml: true,
    }).res,
    "<sup> <b><c>",
    "28"
  );
});

test(`29 - ad hoc - four tags`, () => {
  equal(
    det(ok, not, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["sup", "a", "c"],
      stripHtml: true,
    }).res,
    "<sup><a> <c>",
    "29"
  );
});

test(`30 - ad hoc - four tags`, () => {
  equal(
    det(ok, not, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["sup", "a", "b"],
      stripHtml: true,
    }).res,
    "<sup><a><b>",
    "30"
  );
});

test(`31 - br variations, not ignored`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`32 - br variations, not ignored`, () => {
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`33 - br variations, not ignored`, () => {
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`34 - br variations, ignored`, () => {
  // useXHTML=false
  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`35 - br variations, ignored`, () => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    // useXHTML=true
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`36 - br variations, ignored`, () => {
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`37 - br variations, ignored`, () => {
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`38 - br variations, not ignored - stripHtmlAddNewLine br`, () => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`39 - br variations, ignored - stripHtmlAddNewLine br`, () => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`40 - br variations, not ignored - stripHtmlAddNewLine br/`, () => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`41 - strip but ignore`, () => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    equal(
      det(ok, not, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
});

test.run();
