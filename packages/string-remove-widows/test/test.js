import test from "ava";
import { removeWidows, version } from "../dist/string-remove-widows.esm";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  rawNdash,
  // encodedNdashHtml,
  // encodedNdashCss,
  // encodedNdashJs,
  rawMdash
  // encodedMdashHtml,
  // encodedMdashCss,
  // encodedMdashJs
} from "../dist/util.esm";

const languages = ["html", "css", "js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
const eolTypes = ["LF", "CR", "CRLF"];

// -----------------------------------------------------------------------------
// 00. api bits
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported removeWidows() is a function`, t => {
  t.is(typeof removeWidows, "function", "00.01");
});

test(`00.02 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`, t => {
  t.is(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "00.02");
});

test(`00.03 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - sanity check`, t => {
  t.is(rawnbsp, "\u00A0", "00.03.01");
  t.is(encodedNbspHtml, "&nbsp;", "00.03.02");
});

test(`00.04 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - empty opts obj`, t => {
  t.is(removeWidows(`aaa bbb ccc`, {}).res, `aaa bbb ccc`);
});

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

// test.only(`deleteme`, t => {
//   t.is(
//     removeWidows("aaa bbb&nbsp;ccc ddd", {
//       language: "css",
//       convertEntities: true
//     }).res,
//     `aaa bbb${encodedNbspCss}ccc${encodedNbspCss}ddd`,
//     "02.11.03"
//   );
// });

test(`01.00 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - most basic`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "01.00.01"
  );
  t.is(
    removeWidows("aaa bbb ccc  ddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "01.00.02 - two spaces"
  );
});

test(`01.01 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single sentence, no full stop`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows("aaa bbb ccc ddd", {
        convertEntities: true,
        language,
        minCharCount: 5
      }).res,
      `aaa bbb ccc${encodedNbsps[i]}ddd`,
      `01.01.0${1 + i} - ${language}`
    );
    t.is(
      removeWidows("aaa bbb ccc ddd", {
        convertEntities: false,
        language,
        minCharCount: 5
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      `01.01.0${2 + i} - ${language}`
    );
    t.is(
      removeWidows("aaa bbb ccc ddd", {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        language,
        minCharCount: 5
      }).res,
      `aaa bbb ccc ddd`,
      `01.01.0${3 + i} - ${language}`
    );
  });
});

test(`01.02 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single sentence, full stop`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows("Aaa bbb ccc ddd.", {
        convertEntities: true,
        language,
        minCharCount: 5
      }).res,
      `Aaa bbb ccc${encodedNbsps[i]}ddd.`,
      `01.02.0${1 + i} - ${language}`
    );
    t.is(
      removeWidows("Aaa bbb ccc ddd.", {
        convertEntities: false,
        language,
        minCharCount: 5
      }).res,
      `Aaa bbb ccc${rawnbsp}ddd.`,
      `01.02.0${2 + i} - ${language}`
    );
    t.is(
      removeWidows("Aaa bbb ccc ddd.", {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        language,
        minCharCount: 5
      }).res,
      `Aaa bbb ccc ddd.`,
      `01.02.0${3 + i} - ${language}`
    );
  });
});

test(`01.03 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, full stops`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          {
            convertEntities: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
        `01.03.0${1 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - convertEntities=true`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          {
            convertEntities: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
        `01.03.0${2 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - convertEntities=false`
      );

      // nbsp in place already:
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            convertEntities: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
        `01.03.0${3 + i + idx} - ${language} - ${eolTypes[idx]}`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            convertEntities: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
        `01.03.0${4 + i + idx} - ${language} - ${eolTypes[idx]}`
      );

      // opts.removeWidowPreventionMeasures=on
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            removeWidowPreventionMeasures: true,
            convertEntities: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
        `01.03.0${5 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - convertEntities=false`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            removeWidowPreventionMeasures: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
        `01.03.0${6 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - convertEntities=true`
      );
    });
  });
});

test(`01.04 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - raw non-breaking space already there`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        convertEntities: true,
        language,
        minCharCount: 5
      }).res,
      `aaa bbb ccc${encodedNbsps[i]}ddd`,
      `01.04.0${1 + i} - ${language}`
    );
    t.is(
      removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        convertEntities: false,
        minCharCount: 5
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      `01.04.0${2 + i} - ${language}`
    );
    t.is(
      removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        minCharCount: 5
      }).res,
      `aaa bbb ccc ddd`,
      `01.04.0${3 + i} - ${language}`
    );
  });
});

test(`01.05 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            removeWidowPreventionMeasures: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
        `01.05.0${1 + i + idx} - ${language} - ${eolTypes[idx]}`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            removeWidowPreventionMeasures: false,
            convertEntities: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
        `01.05.0${2 + i + idx} - ${language} - ${eolTypes[idx]}`
      );

      // removeWidowPreventionMeasures: true
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            removeWidowPreventionMeasures: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
        `01.05.0${3 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - removeWidowPreventionMeasures`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            removeWidowPreventionMeasures: true,
            convertEntities: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
        `01.05.0${4 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - removeWidowPreventionMeasures`
      );
    });
  });
});

test(`01.06 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed and encoded but in wrong format`, t => {
  encodedNbsps.forEach((singleEncodedNbsp, z) => {
    ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
      languages.forEach((language, i) => {
        t.is(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${singleEncodedNbsp}hhh.`,
            {
              convertEntities: true,
              language,
              minCharCount: 5
            }
          ).res,
          `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
          `01.06.0${1 +
            i +
            idx +
            z} - requested lang. ${language} - existing lang. ${
            languages[z]
          } - ${eolTypes[idx]}`
        );

        t.is(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${singleEncodedNbsp}hhh.`,
            {
              convertEntities: false,
              language,
              minCharCount: 5
            }
          ).res,
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          `01.06.0${2 +
            i +
            idx +
            z} - requested lang. ${language} - existing lang. ${
            languages[z]
          } - ${eolTypes[idx]}`
        );
      });
    });
  });
});

test(`01.07 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single word`, t => {
  const str = "fhkdfhgkhdfjkghdkjfgjdfjgkdhfgkjhdkjfgdkfgdfjkh";
  languages.forEach((language, i) => {
    // removeWidowPreventionMeasures false
    t.is(
      removeWidows(str, {
        convertEntities: true,
        language
      }).res,
      str,
      `01.07.0${1 + i} - ${language}`
    );
    t.is(
      removeWidows(str, {
        convertEntities: false,
        language
      }).res,
      str,
      `01.07.0${2 + i} - ${language}`
    );

    // removeWidowPreventionMeasures: true
    t.is(
      removeWidows(str, {
        removeWidowPreventionMeasures: true,
        language
      }).res,
      str,
      `01.07.0${3 + i} - ${language}`
    );
    t.is(
      removeWidows(str, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        language
      }).res,
      str,
      `01.07.0${4 + i} - ${language}`
    );

    t.is(
      removeWidows(str, {
        convertEntities: false,
        language,
        minCharCount: 0
      }).res,
      str,
      `01.07.0${5 + i} - ${language}`
    );
  });
});

test(`01.08 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't touch empty strings`, t => {
  const sources = [
    "",
    " ",
    "\t",
    " \t",
    "\t ",
    " \t ",
    " \t\t\t\t",
    "\n",
    "\r",
    "\r\n",
    "\n\n",
    "\r\r",
    "\r\n\r\n",
    "\r\n",
    "\n \n",
    "\r \r",
    "\r\n \r\n",
    "\n \t \n",
    "\r \t \r",
    "\r\n \t \r\n"
  ];
  sources.forEach(str => {
    t.is(
      removeWidows("", {
        convertEntities: true
      }).res,
      "",
      `01.08 - "${JSON.stringify(str, null, 4)}"`
    );
  });
});

// 02 - opts.convertEntities
// -----------------------------------------------------------------------------

test(`02.01 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd", {
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "02.01.01 - entities, one line string no full stop"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd.", {
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.`,
    "02.01.02 - entities, one line string with full stop"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd", { convertEntities: false, minCharCount: 5 })
      .res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "02.01.03 - no entities, one line string no full stop"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd.", {
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${rawnbsp}ddd.`,
    "02.01.04 - no entities, one line string with full stop"
  );
});

test(`02.02 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd\neee fff ggg hhh.", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    "aaa bbb ccc ddd\neee fff ggg&nbsp;hhh.",
    "02.02.01"
  );

  // but,

  t.is(
    removeWidows("aaa bbb ccc ddd.\neee fff ggg hhh.", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.\neee fff ggg${encodedNbspHtml}hhh.`,
    "02.02.06 - one line break, with full stop - widow fix needed"
  );
});

test(`02.03 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - with trailing whitespace`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd.  \n\neee fff ggg hhh", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.  \n\neee fff ggg${encodedNbspHtml}hhh`,
    "02.03.01 - trailing space"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd.\t\t\n\neee fff ggg hhh\t\t", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd.\t\t\n\neee fff ggg${encodedNbspHtml}hhh\t\t`,
    "02.03.02 - trailing tabs"
  );
});

test(`02.05 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  const sources = [
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  ];
  sources.forEach((str, idx) => {
    t.is(removeWidows(str).res, str, `02.05.0${1 + idx}`);
  });
});

test(`02.07 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`, t => {
  t.is(
    removeWidows("aaa bbb ccc&#160;ddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "02.07.01"
  );
  t.is(
    removeWidows("aaa bbb ccc&#160;ddd", {
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "02.07.02"
  );
});

test(`02.08 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`, t => {
  t.is(
    removeWidows("aaa bbb&nbsp;ccc&#160;ddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    "aaa bbb&nbsp;ccc&nbsp;ddd",
    "02.08.01"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc&#160;ddd", {
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
    "02.08.02"
  );
});

test(`02.09 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`, t => {
  t.is(
    removeWidows("aaa bbb ccc  ddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "02.09.01"
  );
  t.is(
    removeWidows("aaa bbb ccc  ddd", {
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "02.09.02"
  );
});

test(`02.10 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`, t => {
  t.is(
    removeWidows("aaa bbb ccc\tddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "02.10.01"
  );
  t.is(
    removeWidows("aaa bbb ccc\tddd", {
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "02.10.02"
  );
});

test(`02.11 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`, t => {
  // existing, neighbour nbsp's get converted
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      convertEntities: true,
      minCharCount: 5
    }).res,
    "aaa bbb&nbsp;ccc&nbsp;ddd",
    "02.11.01"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
    "02.11.02"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      language: "css",
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb${encodedNbspCss}ccc${encodedNbspCss}ddd`,
    "02.11.03"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      language: "js",
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb${encodedNbspJs}ccc${encodedNbspJs}ddd`,
    "02.11.04"
  );

  // removeWidowPreventionMeasures
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      removeWidowPreventionMeasures: true,
      convertEntities: false,
      minCharCount: 5
    }).res,
    `aaa bbb${rawnbsp}ccc ddd`,
    "02.11.05"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      removeWidowPreventionMeasures: true,
      convertEntities: true,
      minCharCount: 5
    }).res,
    `aaa bbb${encodedNbspHtml}ccc ddd`,
    "02.11.06"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc ddd", {
      removeWidowPreventionMeasures: true,
      convertEntities: true,
      language: "css",
      minCharCount: 5
    }).res,
    `aaa bbb${encodedNbspCss}ccc ddd`,
    "02.11.07"
  );
});

// 03 - hyphens
// -----------------------------------------------------------------------------

test(`03.01 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - in front of dashes`, t => {
  [rawMdash, rawNdash, "-"].forEach(oneOfDashes => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: false,
            hyphens: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of text${rawnbsp}${oneOfDashes} not too long${rawnbsp}though`,
        `03.01.01 - ${oneOfDashes} - ${language}`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: true,
            hyphens: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of text${encodedNbsps[i]}${oneOfDashes} not too long${encodedNbsps[i]}though`,
        `03.01.02 - ${oneOfDashes} - ${language}`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: false,
            hyphens: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of text ${oneOfDashes} not too long${rawnbsp}though`,
        `03.01.03 - ${oneOfDashes} - ${language}`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: true,
            hyphens: false,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of text ${oneOfDashes} not too long${encodedNbsps[i]}though`,
        `03.01.04 - ${oneOfDashes} - ${language}`
      );
    });
  });
});

// -----------------------------------------------------------------------------
// 04. line endings
// -----------------------------------------------------------------------------

test(`04.01 - \u001b[${34}m${`line endings`}\u001b[${39}m - does not mangle string with consistent line endings`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
          {
            convertEntities: false,
            hyphens: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text`,
        `04.01.01.0${1 + i + idx} - ${language} - raw - two ${eolTypes[idx]}`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
          {
            convertEntities: true,
            hyphens: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text`,
        `04.01.02.0${2 + i + idx} - ${language} - encoded - two ${
          eolTypes[idx]
        }`
      );

      // trailing line breaks:
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
          {
            convertEntities: false,
            hyphens: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}`,
        `04.01.03.0${3 + i + idx} - ${language} - raw - two ${
          eolTypes[idx]
        } - trailing line breaks`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
          {
            convertEntities: true,
            hyphens: true,
            language,
            minCharCount: 5
          }
        ).res,
        `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}`,
        `04.01.04.0${4 + i + idx} - ${language} - encoded - two ${
          eolTypes[idx]
        } - trailing line breaks`
      );
    });
  });
});

// -----------------------------------------------------------------------------
// 05. opts.ignore - Nunjucks
// -----------------------------------------------------------------------------

test(`05.01 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and nothing happens`, t => {
  //
  // ganged cases where nothing should happen:
  const vals = [
    `{% if something %} some text and more text {% endif %}`,
    "{%- if something -%}\n\nsome text and more text\n\n{%- endif -%}",
    "{{ something else here with many words }}",
    "{% if something else and also another thing %}",
    "Something here and there and then, {% if something else and also another thing %}"
  ];
  vals.forEach((val, i) => {
    t.is(
      removeWidows(val, {
        ignore: "jinja"
      }).res,
      val,
      `05.01.0${1 + i} - templating chunks`
    );
  });
});

test(`05.02 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`, t => {
  const source =
    "{% if something else and also another thing %}tralala {% endif %}some text here";
  const res =
    "{% if something else and also another thing %}tralala {% endif %}some text&nbsp;here";
  t.is(
    removeWidows(source, { minCharCount: 5 }).res,
    res,
    "05.02.01 - words under threshold outside templating chunk which completes the threshold"
  );
  t.is(
    removeWidows(source, {
      ignore: "jinja",
      minCharCount: 5
    }).res,
    res,
    "05.02.02"
  );
});

test(`05.03 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows(
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more text.`,
        {
          convertEntities: false,
          language,
          ignore: ["jinja"],
          minCharCount: 5
        }
      ).res,
      `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
      `05.03.0${1 + i} - min word count threshold + ignore jinja combo`
    );
    t.is(
      removeWidows(
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
        {
          convertEntities: true,
          language,
          ignore: ["jinja"],
          minCharCount: 5
        }
      ).res,
      `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${encodedNbsps[i]}text.`,
      `05.03.0${2 + i} - min word count threshold + ignore jinja combo`
    );
    t.is(
      removeWidows(
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more text.`,
        {
          convertEntities: false,
          language,
          ignore: "jinja",
          minCharCount: 5
        }
      ).res,
      `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
      `05.03.0${1 + i} - min word count threshold + ignore jinja combo`
    );
    t.is(
      removeWidows(
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
        {
          convertEntities: true,
          language,
          ignore: "jinja",
          minCharCount: 5
        }
      ).res,
      `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${encodedNbsps[i]}text.`,
      `05.03.0${2 + i} - min word count threshold + ignore jinja combo`
    );
  });
});

// -----------------------------------------------------------------------------
// opts.UKPostcodes
// -----------------------------------------------------------------------------

test(`06.01 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, t => {
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    "Some text SW1A 1AA and some more&nbsp;text.",
    "06.01.01"
  );
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      UKPostcodes: true,
      minCharCount: 5
    }).res,
    "Some text SW1A&nbsp;1AA and some more&nbsp;text.",
    "06.01.02"
  );
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      UKPostcodes: true,
      convertEntities: false,
      minCharCount: 5
    }).res,
    `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
    "06.01.03"
  );
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      UKPostcodes: true,
      convertEntities: true,
      language: "css",
      minCharCount: 5
    }).res,
    `Some text SW1A${encodedNbspCss}1AA and some more${encodedNbspCss}text.`,
    "06.01.04"
  );
});

test(`06.02 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`, t => {
  t.is(
    removeWidows(
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      { UKPostcodes: false }
    ).res,
    "Some text SW1A 1AA and some more text SW1A 1AA and some more&nbsp;text.",
    "06.02.01"
  );
  t.is(
    removeWidows(
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      { UKPostcodes: true }
    ).res,
    "Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.",
    "06.02.02"
  );
});

test(`06.03 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`, t => {
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    "This very long line of text ends with a postcode SW1A&nbsp;1AA.",
    "06.03.01"
  );
  t.is(
    removeWidows("Postcode SW1A 1AA.", {
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    "Postcode SW1A 1AA.",
    "06.03.02 - default minimum word count (4) kicks in"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      UKPostcodes: true,
      minCharCount: 5
    }).res,
    "This very long line of text ends with a postcode SW1A&nbsp;1AA.",
    "06.03.03"
  );

  // language === "js"
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      language: "js",
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`,
    "06.03.04"
  );
  t.is(
    removeWidows("Postcode SW1A 1AA.", {
      language: "js",
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    "Postcode SW1A 1AA.",
    "06.03.05 - default minimum word count (4) kicks in"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      language: "js",
      UKPostcodes: true,
      minCharCount: 5
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`,
    "06.03.06"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      language: "js",
      UKPostcodes: true,
      convertEntities: false,
      minCharCount: 5
    }).res,
    `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
    "06.03.07"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      language: "js",
      UKPostcodes: true,
      convertEntities: false,
      removeWidowPreventionMeasures: true,
      minCharCount: 5
    }).res,
    `This very long line of text ends with a postcode SW1A 1AA.`,
    "06.03.08"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      language: "js",
      UKPostcodes: true,
      convertEntities: false,
      removeWidowPreventionMeasures: true,
      minCharCount: 5
    }).res,
    `This very long line of text ends with a postcode SW1A 1AA.`,
    "06.03.09"
  );
});

test(`06.04 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`, t => {
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      removeWidowPreventionMeasures: true,
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    "This very long line of text ends with a postcode SW1A 1AA.",
    "06.04.01"
  );
  t.is(
    removeWidows(
      `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
      {
        removeWidowPreventionMeasures: true,
        UKPostcodes: true,
        minCharCount: 5
      }
    ).res,
    "This very long line of text ends with a postcode SW1A 1AA.",
    "06.04.02 - removeWidowPreventionMeasures trumps UKPostcodes"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      removeWidowPreventionMeasures: false,
      UKPostcodes: false,
      minCharCount: 5
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
    "06.04.03 - added because of last two words"
  );
  t.is(
    removeWidows(
      `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
      {
        removeWidowPreventionMeasures: false,
        UKPostcodes: true,
        minCharCount: 5
      }
    ).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
    "06.04.04 - added because of opts.UKPostcodes"
  );
});

test(`06.05 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`, t => {
  t.is(
    removeWidows(
      "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa",
      {
        UKPostcodes: true,
        convertEntities: true,
        minCharCount: 5
      }
    ).res,
    "\uD83E\uDD84 some text text text SW1A&nbsp;1AA more text text text \uD83E\uDD84&nbsp;aaa",
    "06.05.01"
  );
  t.is(
    removeWidows(
      "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa",
      {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A${rawnbsp}1AA more text text text \uD83E\uDD84${rawnbsp}aaa`,
    "06.05.02"
  );
  t.is(
    removeWidows(
      "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa",
      {
        UKPostcodes: false,
        convertEntities: true,
        minCharCount: 5
      }
    ).res,
    "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84&nbsp;aaa",
    "06.05.03"
  );
  t.is(
    removeWidows(
      "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa",
      {
        UKPostcodes: false,
        convertEntities: false,
        minCharCount: 5
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${rawnbsp}aaa`,
    "06.05.04"
  );
});

test(`06.06 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`, t => {
  t.is(
    removeWidows("Some text SW1A 1Aa and some more text.", {
      UKPostcodes: false,
      convertEntities: true,
      minCharCount: 5
    }).res,
    `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`,
    "06.06.01"
  );
  t.is(
    removeWidows("Some text SW1A 1Aa and some more text.", {
      UKPostcodes: true,
      convertEntities: true,
      minCharCount: 5
    }).res,
    `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`,
    "06.06.02"
  );
});

test(`06.07 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, t => {
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      UKPostcodes: false,
      convertEntities: false,
      minCharCount: 5
    }).res,
    `Some text SW1A 1AA and some more${rawnbsp}text.`,
    "06.07.01"
  );
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      UKPostcodes: true,
      convertEntities: false,
      minCharCount: 5
    }).res,
    `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
    "06.07.02"
  );
});

test(`06.08 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`, t => {
  t.is(
    removeWidows(
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      {
        UKPostcodes: false,
        convertEntities: false
      }
    ).res,
    "Some text SW1A 1AA and some more text SW1A 1AA and some more\u00A0text.",
    "06.08.01"
  );
  t.is(
    removeWidows(
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      {
        UKPostcodes: true,
        convertEntities: false
      }
    ).res,
    `Some text SW1A${rawnbsp}1AA and some more text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
    "06.08.02"
  );
});

test(`06.09 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`, t => {
  t.is(
    removeWidows(
      "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa",
      {
        UKPostcodes: false,
        convertEntities: false,
        minCharCount: 5
      }
    ).res,
    "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84\u00A0aaa",
    "06.09.01"
  );
  t.is(
    removeWidows(
      "\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa",
      {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5
      }
    ).res,
    "\uD83E\uDD84 some text text text SW1A\u00A01AA more text text text \uD83E\uDD84\u00A0aaa",
    "06.09.02"
  );
});

// -----------------------------------------------------------------------------
// opts.removeWidowPreventionMeasures
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - baseline`, t => {
  t.is(
    removeWidows(
      `Lorem&nbsp;ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      {
        convertEntities: true
      }
    ).res,
    `Lorem&nbsp;ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est&nbsp;laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est&nbsp;laborum.`,
    "07.01"
  );
});

test(`07.02 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - comes in without nbsp's`, t => {
  t.is(
    removeWidows(
      `Lorem&nbsp;ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      {
        removeWidowPreventionMeasures: true,
        convertEntities: true
      }
    ).res,
    `Lorem&nbsp;ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    "07.02"
  );
});

test(`07.03 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - comes in with nbsp's`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Lorem${encodedNbsps[i]}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbsps[i]}laborum.${eolType}${eolType}Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbsps[i]}laborum.`,
          {
            removeWidowPreventionMeasures: true,
            convertEntities: true,
            language
          }
        ).res,
        `Lorem${encodedNbsps[i]}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.${eolType}${eolType}Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        `07.03.0${1 + i + idx} - ${language} - ${
          eolTypes[idx]
        } - convertEntities=true`
      );
    });
  });
});

// -----------------------------------------------------------------------------
// 08. opts.minWordCount
// -----------------------------------------------------------------------------

test(`08.01 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = zero`, t => {
  t.is(
    removeWidows("aaa bbb", {
      minWordCount: 0,
      minCharCount: 5
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "08.01"
  );
});

test(`08.02 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`, t => {
  t.is(
    removeWidows("aaa bbb", {
      language: "css",
      minWordCount: null,
      minCharCount: 5
    }).res,
    `aaa${encodedNbspCss}bbb`,
    "08.02.01"
  );
  t.is(
    removeWidows("aaa bbb", {
      language: "css",
      minWordCount: false,
      minCharCount: 5
    }).res,
    `aaa${encodedNbspCss}bbb`,
    "08.02.02"
  );
});

test(`08.03 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is less than words in the input`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd", {
      minWordCount: 2,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "08.03"
  );
});

test(`08.04 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is equal to words count in the input`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd", {
      minWordCount: 4,
      minCharCount: 5
    }).res,
    `aaa bbb ccc${encodedNbspHtml}ddd`,
    "08.04"
  );
});

test(`08.05 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is more than words in the input`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd", {
      minWordCount: 999,
      minCharCount: 5
    }).res,
    `aaa bbb ccc ddd`,
    "08.05"
  );
});

// -----------------------------------------------------------------------------
// 09. opts.minCharCount
// -----------------------------------------------------------------------------

test(`09.01 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = zero`, t => {
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 0
    }).res,
    `aaa bbb`,
    "09.01.01 - default word count 4 kicks in and makes program skip this"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 0,
      minWordCount: 0
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.01.02"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 5,
      minWordCount: 0
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.01.03"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 6,
      minWordCount: 0
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.01.04"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 7,
      minWordCount: 0
    }).res,
    `aaa bbb`,
    "09.01.05"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 99,
      minWordCount: 0
    }).res,
    `aaa bbb`,
    "09.01.06"
  );
});

test(`09.02 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = falsey`, t => {
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: false
    }).res,
    `aaa bbb`,
    "09.02.01"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: false,
      minWordCount: 0
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.02.02"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: false,
      minWordCount: false
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.02.03"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: null,
      minWordCount: null
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.02.04"
  );
  t.is(
    removeWidows("aaa bbb", {
      minCharCount: 0,
      minWordCount: 0
    }).res,
    `aaa${encodedNbspHtml}bbb`,
    "09.02.05"
  );
});

// -----------------------------------------------------------------------------
// opts.reportProgressFunc
// -----------------------------------------------------------------------------

// TODO
