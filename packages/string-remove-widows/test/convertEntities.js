import tap from "tap";
import {
  removeWidows,
  // version
} from "../dist/string-remove-widows.esm";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "../src/util";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// opts.convertEntities
// -----------------------------------------------------------------------------

tap.test(
  `01 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - entities, one line string no full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - entities, one line string with full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.`, {
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.`,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - no entities, one line string no full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - no entities, one line string with full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd.`,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break - widow fix needed`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd\neee fff ggg hhh.`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd\neee fff ggg${encodedNbspHtml}hhh.`,
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break -  - one line break, with full stop - widow fix needed`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.\neee fff ggg hhh.`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.\neee fff ggg${encodedNbspHtml}hhh.`,
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - trailing space`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.  \n\neee fff ggg hhh`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.  \n\neee fff ggg${encodedNbspHtml}hhh`,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - trailing tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.\t\t\n\neee fff ggg hhh\t\t`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.\t\t\n\neee fff ggg${encodedNbspHtml}hhh\t\t`,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
  (t) => {
    const sources = [
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    ];
    sources.forEach((str, idx) => {
      t.equal(removeWidows(str).res, str, `02.09.0${1 + idx}`);
    });
    t.end();
  }
);

tap.test(
  `10 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc&#160;ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc&#160;ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`,
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc  ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc  ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc\tddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc\tddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "17"
    );
    t.end();
  }
);

// existing, neighbour nbsp's get converted
tap.test(
  `18 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`,
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        targetLanguage: `css`,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspCss}ccc${encodedNbspCss}ddd`,
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        targetLanguage: `js`,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspJs}ccc${encodedNbspJs}ddd`,
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc ddd`,
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc ddd`,
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: true,
        targetLanguage: `css`,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspCss}ccc ddd`,
      "24"
    );
    t.end();
  }
);

// 3 words, min count 4

tap.test(`25`, (t) => {
  t.equal(
    removeWidows(`Abc;${rawnbsp}de fg.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg.`,
    "25"
  );
  t.end();
});

tap.test(`26`, (t) => {
  t.equal(
    removeWidows(`Abc;${rawnbsp}de fg.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg.`,
    "26"
  );
  t.end();
});

tap.test(`27`, (t) => {
  t.equal(
    removeWidows(`Abc;&nbsp;de fg.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg.`,
    "27"
  );
  t.end();
});

tap.test(`28`, (t) => {
  t.equal(
    removeWidows(`Abc;&nbsp;de fg.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg.`,
    "28"
  );
  t.end();
});

// 4 words, min count 4

tap.test(`29`, (t) => {
  t.equal(
    removeWidows(`Abc;${rawnbsp}de fg hijklm.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg&nbsp;hijklm.`,
    "29"
  );
  t.end();
});

tap.test(`30`, (t) => {
  t.equal(
    removeWidows(`Abc;${rawnbsp}de fg hijklm.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg${rawnbsp}hijklm.`,
    "30"
  );
  t.end();
});

tap.test(`31`, (t) => {
  t.equal(
    removeWidows(`Abc;&nbsp;de fg hijklm.`, {
      convertEntities: true,
      minWordCount: 4,
    }).res,
    `Abc;&nbsp;de fg&nbsp;hijklm.`,
    "31"
  );
  t.end();
});

tap.test(`32`, (t) => {
  t.equal(
    removeWidows(`Abc;&nbsp;de fg hijklm.`, {
      convertEntities: false,
      minWordCount: 4,
    }).res,
    `Abc;${rawnbsp}de fg${rawnbsp}hijklm.`,
    "32"
  );
  t.end();
});
