import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm";
import { det, mixer } from "../t-util/util";

// ==============================
// opts.stripHtmlButIgnoreTags
// ==============================

tap.test(`01 - simple case`, (t) => {
  t.equal(det(t, 0, `a <div><a>z</a></div> c`).res, "a z c", "01 - control");
  t.end();
});

tap.test(`02 - single tag to ignore, given as string`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "a",
    }).res,
    "a <a>z</a> c",
    "02"
  );
  t.end();
});

tap.test(`03 - single tag to ignore, given as string in an array`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a"],
    }).res,
    "a <a>z</a> c",
    "03"
  );
  t.end();
});

tap.test(`04 - single tag to ignore, given as string`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "div",
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "04"
  );
  t.end();
});

tap.test(`05 - single tag to ignore, given as string in an array`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["div"],
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "05"
  );
  t.end();
});

tap.test(`06 - both tags ignored`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a", "div"],
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "06"
  );
  t.end();
});

tap.test(`07 - other tags ignored, not present in the input`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["article", "z"],
      removeWidows: false,
    }).res,
    "a z c",
    "07"
  );
  t.end();
});

tap.test(`08 - control for stripHtml`, (t) => {
  t.equal(det(t, 0, `a <div><a>z</a></div> c`).res, "a z c", "08 - control");
  t.end();
});

tap.test(`09 - no ignores`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "09"
  );
  t.end();
});

tap.test(`10 - no ignores`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "10"
  );
  t.end();
});

tap.test(`11 - single tag to ignore, given as string`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "a",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "11"
  );
  t.end();
});

tap.test(`12 - single tag to ignore, given as string`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "a",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "12"
  );
  t.end();
});

tap.test(`13 - single tag to ignore, given as string in an array`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "13"
  );
  t.end();
});

tap.test(`14 - single tag to ignore, given as string in an array`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "14"
  );
  t.end();
});

tap.test(`15 - single tag to ignore, given as string`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "div",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "15"
  );
  t.end();
});

tap.test(`16 - single tag to ignore, given as string`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: "div",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "16"
  );
  t.end();
});

tap.test(`17 - single tag to ignore, given as string in an array`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "17"
  );
  t.end();
});

tap.test(`18 - single tag to ignore, given as string in an array`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div> z </div> c",
    "18"
  );
  t.end();
});

tap.test(`19 - both tags ignored`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "19"
  );
  t.end();
});

tap.test(`20 - both tags ignored`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "20"
  );
  t.end();
});

tap.test(`21 - other tags ignored, not present in the input`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "21"
  );
  t.end();
});

tap.test(`22 - other tags ignored, not present in the input`, (t) => {
  t.equal(
    det(t, 0, `a <div><a>z</a></div> c`, {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "22"
  );
  t.end();
});

tap.test(`23 - ad hoc - one tag`, (t) => {
  t.equal(
    det(t, 0, `<sup>`, {
      stripHtmlButIgnoreTags: [],
      stripHtml: true,
    }).res,
    "",
    "23"
  );
  t.end();
});

tap.test(`24 - ad hoc - one tag`, (t) => {
  t.equal(
    det(t, 0, `<sup>`, {
      stripHtml: true,
    }).res,
    "<sup>",
    "24"
  );
  t.end();
});

tap.test(`25 - ad hoc - one tag`, (t) => {
  t.equal(
    det(t, 0, `<sup>`, {
      stripHtmlButIgnoreTags: ["sup"],
      stripHtml: true,
    }).res,
    "<sup>",
    "25"
  );
  t.end();
});

tap.test(`26 - ad hoc - one tag`, (t) => {
  t.equal(
    det(t, 0, `<sup>`, {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
    }).res,
    "",
    "26"
  );
  t.end();
});

tap.test(`27 - ad hoc - four tags`, (t) => {
  t.equal(
    det(t, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["a", "b", "c"],
      stripHtml: true,
    }).res,
    "<a><b><c>",
    "27"
  );
  t.end();
});

tap.test(`28 - ad hoc - four tags`, (t) => {
  t.equal(
    det(t, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["sup", "b", "c"],
      stripHtml: true,
    }).res,
    "<sup> <b><c>",
    "28"
  );
  t.end();
});

tap.test(`29 - ad hoc - four tags`, (t) => {
  t.equal(
    det(t, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["sup", "a", "c"],
      stripHtml: true,
    }).res,
    "<sup><a> <c>",
    "29"
  );
  t.end();
});

tap.test(`30 - ad hoc - four tags`, (t) => {
  t.equal(
    det(t, 0, `<sup><a><b><c>`, {
      stripHtmlButIgnoreTags: ["sup", "a", "b"],
      stripHtml: true,
    }).res,
    "<sup><a><b>",
    "30"
  );
  t.end();
});

tap.test(`31 - br variations, not ignored`, (t) => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`32 - br variations, not ignored`, (t) => {
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`33 - br variations, not ignored`, (t) => {
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`34 - br variations, ignored`, (t) => {
  // useXHTML=false
  mixer({
    stripHtml: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      `abc<br>def`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`35 - br variations, ignored`, (t) => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    // useXHTML=true
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`36 - br variations, ignored`, (t) => {
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`37 - br variations, ignored`, (t) => {
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`38 - br variations, not ignored - stripHtmlAddNewLine br`, (t) => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`39 - br variations, ignored - stripHtmlAddNewLine br`, (t) => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`40 - br variations, not ignored - stripHtmlAddNewLine br/`, (t) => {
  mixer({
    stripHtml: true,
    removeLineBreaks: false,
    replaceLineBreaks: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`41 - strip but ignore`, (t) => {
  mixer({
    stripHtml: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
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
    t.equal(
      det(t, n, `abc<br/>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br />def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br/ >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br / >def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
    t.equal(
      det(t, n, `abc<br>def`, {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      JSON.stringify(opt, null, 4)
    );
  });

  t.end();
});
