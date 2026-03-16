// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// ==============================
// opts.stripHtmlButIgnoreTags
// ==============================

test("001 - simple case", () => {
  equal(det(ok, not, 0, "a <div><a>z</a></div> c").res, "a z c", "001.01");
});

test("002 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "a",
    }).res,
    "a <a>z</a> c",
    "002.01",
  );
});

test("003 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a"],
    }).res,
    "a <a>z</a> c",
    "003.01",
  );
});

test("004 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "div",
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "004.01",
  );
});

test("005 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["div"],
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "005.01",
  );
});

test("006 - both tags ignored", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a", "div"],
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "006.01",
  );
});

test("007 - other tags ignored, not present in the input", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["article", "z"],
      removeWidows: false,
    }).res,
    "a z c",
    "007.01",
  );
});

test("008 - control for stripHtml", () => {
  equal(det(ok, not, 0, "a <div><a>z</a></div> c").res, "a z c", "008.01");
});

test("009 - no ignores", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "009.01",
  );
});

test("010 - no ignores", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "010.01",
  );
});

test("011 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "a",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "011.01",
  );
});

test("012 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "a",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "012.01",
  );
});

test("013 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "013.01",
  );
});

test("014 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <a>z</a> c",
    "014.01",
  );
});

test("015 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "div",
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "015.01",
  );
});

test("016 - single tag to ignore, given as string", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: "div",
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "016.01",
  );
});

test("017 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "017.01",
  );
});

test("018 - single tag to ignore, given as string in an array", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div>z</div> c",
    "018.01",
  );
});

test("019 - both tags ignored", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "019.01",
  );
});

test("020 - both tags ignored", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["a", "div"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "020.01",
  );
});

test("021 - other tags ignored, not present in the input", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: false,
      removeWidows: false,
    }).res,
    "a <div><a>z</a></div> c",
    "021.01",
  );
});

test("022 - other tags ignored, not present in the input", () => {
  equal(
    det(ok, not, 0, "a <div><a>z</a></div> c", {
      stripHtmlButIgnoreTags: ["article", "z"],
      stripHtml: true,
      removeWidows: false,
    }).res,
    "a z c",
    "022.01",
  );
});

test("023 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtmlButIgnoreTags: [],
      stripHtml: true,
    }).res,
    "",
    "023.01",
  );
});

test("024 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtml: true,
    }).res,
    "<sup>",
    "024.01",
  );
});

test("025 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtmlButIgnoreTags: ["sup"],
      stripHtml: true,
    }).res,
    "<sup>",
    "025.01",
  );
});

test("026 - ad hoc - one tag", () => {
  equal(
    det(ok, not, 0, "<sup>", {
      stripHtmlButIgnoreTags: ["a"],
      stripHtml: true,
    }).res,
    "",
    "026.01",
  );
});

test("027 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["a", "b", "c"],
      stripHtml: true,
    }).res,
    "<a><b><c>",
    "027.01",
  );
});

test("028 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["sup", "b", "c"],
      stripHtml: true,
    }).res,
    "<sup><b><c>",
    "028.01",
  );
});

test("029 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["sup", "a", "c"],
      stripHtml: true,
    }).res,
    "<sup><a><c>",
    "029.01",
  );
});

test("030 - ad hoc - four tags", () => {
  equal(
    det(ok, not, 0, "<sup><a><b><c>", {
      stripHtmlButIgnoreTags: ["sup", "a", "b"],
      stripHtml: true,
    }).res,
    "<sup><a><b>",
    "030.01",
  );
});

test("031 - br variations, not ignored", () => {
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
      "031.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "031.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "031.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "031.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc def",
      "031.05",
    );
  });
});

test("032 - br variations, not ignored", () => {
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
      "032.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "032.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "032.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "032.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "032.05",
    );
  });
});

test("033 - br variations, not ignored", () => {
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
      "033.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "033.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "033.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "033.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "033.05",
    );
  });
});

test("034 - br variations, ignored", () => {
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
      "034.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "034.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "034.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "034.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "034.05",
    );
  });
});

test("035 - br variations, ignored", () => {
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
      "035.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "035.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "035.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "035.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "035.05",
    );
  });
});

test("036 - br variations, ignored", () => {
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
      "036.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "036.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "036.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "036.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br>def",
      "036.05",
    );
  });
});

test("037 - br variations, ignored", () => {
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
      "037.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "037.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "037.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "037.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: [],
      }).res,
      "abc<br/>def",
      "037.05",
    );
  });
});

test("038 - br variations, not ignored - stripHtmlAddNewLine br", () => {
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
      "038.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "038.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "038.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "038.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc\ndef",
      "038.05",
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
      "038.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "038.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "038.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "038.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "038.10",
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
      "038.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "038.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "038.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "038.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "038.15",
    );
  });
});

test("039 - br variations, ignored - stripHtmlAddNewLine br", () => {
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
      "039.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.05",
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
      "039.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.10",
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
      "039.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br>def",
      "039.15",
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
      "039.16",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.17",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.18",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.19",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br"],
      }).res,
      "abc<br/>def",
      "039.20",
    );
  });
});

test("040 - br variations, not ignored - stripHtmlAddNewLine br/", () => {
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
      "040.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "040.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "040.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "040.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc\ndef",
      "040.05",
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
      "040.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "040.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "040.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "040.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "040.10",
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
      "040.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "040.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "040.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "040.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "040.15",
    );
  });
});

test("041 - strip but ignore", () => {
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
      "041.01",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.02",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.03",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.04",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.05",
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
      "041.06",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.07",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.08",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.09",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.10",
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
      "041.11",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.12",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.13",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.14",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br/>def",
      "041.15",
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
      "041.16",
    );
    equal(
      det(ok, not, n, "abc<br />def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.17",
    );
    equal(
      det(ok, not, n, "abc<br/ >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.18",
    );
    equal(
      det(ok, not, n, "abc<br / >def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.19",
    );
    equal(
      det(ok, not, n, "abc<br>def", {
        ...opt,
        stripHtmlButIgnoreTags: ["br"],
        stripHtmlAddNewLine: ["br/"],
      }).res,
      "abc<br>def",
      "041.20",
    );
  });
});

test.run();
