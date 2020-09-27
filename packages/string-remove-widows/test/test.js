import tap from "tap";
import { removeWidows, version } from "../dist/string-remove-widows.esm";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  rawNdash,
  rawMdash,
} from "../src/util";

const languages = ["html`, `css`, `js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// 00. api bits
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported removeWidows() is a function`,
  (t) => {
    t.equal(typeof removeWidows, `function`, `01`);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`,
  (t) => {
    t.equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, `02`);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - sanity check`,
  (t) => {
    t.equal(rawnbsp, `\u00A0`, `03.01`);
    t.equal(encodedNbspHtml, `${encodedNbspHtml}`, `03.02`);
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - empty opts obj`,
  (t) => {
    t.equal(removeWidows(`aaa bbb ccc`, {}).res, `aaa bbb ccc`, "04");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - most basic`,
  (t) => {
    const resObj = removeWidows(`aaa bbb ccc ddd`, {
      convertEntities: true,
      minCharCount: 5,
    });
    t.equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`, "05.01");
    t.strictSame(
      resObj.whatWasDone,
      {
        removeWidows: true,
        convertEntities: false,
      },
      "05.02"
    );
    t.strictSame(resObj.ranges, [[11, 12, encodedNbspHtml]], "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - most basic`,
  (t) => {
    const resObj = removeWidows(`aaa bbb ccc  ddd`, {
      convertEntities: true,
      minCharCount: 5,
    });
    t.equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`, "06.01");
    t.strictSame(
      resObj.whatWasDone,
      {
        removeWidows: true,
        convertEntities: false,
      },
      "06.02"
    );
    t.strictSame(resObj.ranges, [[11, 13, encodedNbspHtml]], "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single sentence, no full stop`,
  (t) => {
    languages.forEach((targetLanguage, i) => {
      t.equal(
        removeWidows(`aaa bbb ccc ddd`, {
          convertEntities: true,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `aaa bbb ccc${encodedNbsps[i]}ddd`,
        `01.03.0${1 + i} - ${targetLanguage}`
      );
      t.equal(
        removeWidows(`aaa bbb ccc ddd`, {
          convertEntities: false,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `aaa bbb ccc${rawnbsp}ddd`,
        `01.03.0${2 + i} - ${targetLanguage}`
      );
      t.equal(
        removeWidows(`aaa bbb ccc ddd`, {
          removeWidowPreventionMeasures: true,
          convertEntities: false,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `aaa bbb ccc ddd`,
        `01.03.0${3 + i} - ${targetLanguage}`
      );
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single sentence, full stop`,
  (t) => {
    languages.forEach((targetLanguage, i) => {
      t.equal(
        removeWidows(`Aaa bbb ccc ddd.`, {
          convertEntities: true,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `Aaa bbb ccc${encodedNbsps[i]}ddd.`,
        `01.04.0${1 + i} - ${targetLanguage}`
      );
      t.equal(
        removeWidows(`Aaa bbb ccc ddd.`, {
          convertEntities: false,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `Aaa bbb ccc${rawnbsp}ddd.`,
        `01.04.0${2 + i} - ${targetLanguage}`
      );
      t.equal(
        removeWidows(`Aaa bbb ccc ddd.`, {
          removeWidowPreventionMeasures: true,
          convertEntities: false,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `Aaa bbb ccc ddd.`,
        `01.04.0${3 + i} - ${targetLanguage}`
      );
    });
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, full stops`,
  (t) => {
    ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(
            `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
            {
              convertEntities: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
          `01.05.0${1 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - convertEntities=true`
        );
        t.equal(
          removeWidows(
            `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
            {
              convertEntities: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          `01.05.0${2 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - convertEntities=false`
        );

        // nbsp in place already:
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              convertEntities: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
          `01.05.0${3 + i + idx} - ${targetLanguage} - ${eolTypes[idx]}`
        );
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              convertEntities: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          `01.05.0${4 + i + idx} - ${targetLanguage} - ${eolTypes[idx]}`
        );

        // opts.removeWidowPreventionMeasures=on
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              removeWidowPreventionMeasures: true,
              convertEntities: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          `01.05.0${5 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - convertEntities=false`
        );
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              removeWidowPreventionMeasures: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          `01.05.0${6 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - convertEntities=true`
        );
      });
    });
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - raw non-breaking space already there`,
  (t) => {
    languages.forEach((targetLanguage, i) => {
      const val1 = removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        convertEntities: true,
        targetLanguage,
        minCharCount: 5,
      });
      t.equal(
        val1.res,
        `aaa bbb ccc${encodedNbsps[i]}ddd`,
        `01.06.0${1 + i} - ${targetLanguage}`
      );
      t.strictSame(val1.whatWasDone, {
        removeWidows: true,
        convertEntities: false,
      });

      const val2 = removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        convertEntities: false,
        minCharCount: 5,
      });
      t.equal(
        val2.res,
        `aaa bbb ccc${rawnbsp}ddd`,
        `01.06.0${2 + i} - ${targetLanguage}`
      );
      t.strictSame(val2.whatWasDone, {
        removeWidows: true,
        convertEntities: false,
      });

      const val3 = removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        minCharCount: 5,
      });
      t.equal(
        val3.res,
        `aaa bbb ccc ddd`,
        `01.06.0${3 + i} - ${targetLanguage}`
      );
      t.strictSame(val3.whatWasDone, {
        removeWidows: true,
        convertEntities: false,
      });
    });
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed`,
  (t) => {
    ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              removeWidowPreventionMeasures: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
          `01.07.0${1 + i + idx} - ${targetLanguage} - ${eolTypes[idx]}`
        );
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              removeWidowPreventionMeasures: false,
              convertEntities: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          `01.07.0${2 + i + idx} - ${targetLanguage} - ${eolTypes[idx]}`
        );

        // removeWidowPreventionMeasures: true
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              removeWidowPreventionMeasures: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          `01.07.0${3 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - removeWidowPreventionMeasures`
        );
        t.equal(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            {
              removeWidowPreventionMeasures: true,
              convertEntities: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          `01.07.0${4 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - removeWidowPreventionMeasures`
        );
      });
    });
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed and encoded but in wrong format`,
  (t) => {
    encodedNbsps.forEach((singleEncodedNbsp, z) => {
      ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
        languages.forEach((targetLanguage, i) => {
          t.equal(
            removeWidows(
              `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${singleEncodedNbsp}hhh.`,
              {
                convertEntities: true,
                targetLanguage,
                minCharCount: 5,
              }
            ).res,
            `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
            `01.08.0${
              1 + i + idx + z
            } - requested lang. ${targetLanguage} - existing lang. ${
              languages[z]
            } - ${eolTypes[idx]}`
          );

          t.equal(
            removeWidows(
              `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${singleEncodedNbsp}hhh.`,
              {
                convertEntities: false,
                targetLanguage,
                minCharCount: 5,
              }
            ).res,
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
            `01.08.0${
              2 + i + idx + z
            } - requested lang. ${targetLanguage} - existing lang. ${
              languages[z]
            } - ${eolTypes[idx]}`
          );
        });
      });
    });
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single word`,
  (t) => {
    const str = `fhkdfhgkhdfjkghdkjfgjdfjgkdhfgkjhdkjfgdkfgdfjkh`;
    languages.forEach((targetLanguage, i) => {
      // removeWidowPreventionMeasures false
      t.equal(
        removeWidows(str, {
          convertEntities: true,
          targetLanguage,
        }).res,
        str,
        `01.09.0${1 + i} - ${targetLanguage}`
      );
      t.equal(
        removeWidows(str, {
          convertEntities: false,
          targetLanguage,
        }).res,
        str,
        `01.09.0${2 + i} - ${targetLanguage}`
      );

      // removeWidowPreventionMeasures: true
      t.equal(
        removeWidows(str, {
          removeWidowPreventionMeasures: true,
          targetLanguage,
        }).res,
        str,
        `01.09.0${3 + i} - ${targetLanguage}`
      );
      t.equal(
        removeWidows(str, {
          removeWidowPreventionMeasures: true,
          convertEntities: false,
          targetLanguage,
        }).res,
        str,
        `01.09.0${4 + i} - ${targetLanguage}`
      );

      t.equal(
        removeWidows(str, {
          convertEntities: false,
          targetLanguage,
          minCharCount: 0,
        }).res,
        str,
        `01.09.0${5 + i} - ${targetLanguage}`
      );
    });
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't touch empty strings`,
  (t) => {
    const sources = [
      ``,
      ` `,
      `\t`,
      ` \t`,
      `\t `,
      ` \t `,
      ` \t\t\t\t`,
      `\n`,
      `\r`,
      `\r\n`,
      `\n\n`,
      `\r\r`,
      `\r\n\r\n`,
      `\r\n`,
      `\n \n`,
      `\r \r`,
      `\r\n \r\n`,
      `\n \t \n`,
      `\r \t \r`,
      `\r\n \t \r\n`,
    ];
    sources.forEach((str) => {
      t.equal(
        removeWidows(``, {
          convertEntities: true,
        }).res,
        ``,
        `01.10 - ${JSON.stringify(str, null, 4)}`
      );
    });
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't break within tag`,
  (t) => {
    const source = `aaa<br/>< br/>bbb< br/><br/>ccc< br/>< br/>ddd`;
    t.equal(
      removeWidows(source, {
        convertEntities: true,
        targetLanguage: `html`,
        UKPostcodes: true,
        hyphens: true,
      }).res,
      source,
      `15`
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't add nbsp after line breaks`,
  (t) => {
    const source = `aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc`;
    t.equal(
      removeWidows(source, {
        convertEntities: true,
        targetLanguage: `html`,
        UKPostcodes: true,
        hyphens: true,
      }).res,
      source,
      `16`
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - line breaks and spaces`,
  (t) => {
    const source = `aaa<br/>\n <br/>\n bbb<br/>\n <br/>\n ccc`;
    t.equal(
      removeWidows(source, {
        convertEntities: true,
        targetLanguage: `html`,
        UKPostcodes: true,
        hyphens: true,
      }).res,
      source,
      `17`
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - ad hoc case`,
  (t) => {
    const source = `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`;
    const res = removeWidows(source, {
      ignore: "all",
      convertEntities: true,
      targetLanguage: "html",
      UKPostcodes: true,
      hyphens: true,
    });
    t.strictSame(res.ranges, null, "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - non-widow nbsp is decoded and reported correctly, mixed with widow case`,
  (t) => {
    const source = `abc&nbsp;def ghij knmn`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `abc${rawnbsp}def ghij${rawnbsp}knmn`, "19.01");
    t.strictSame(
      res.whatWasDone,
      {
        removeWidows: true,
        convertEntities: true,
      },
      "19.02"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - non-widow nbsp only`,
  (t) => {
    const source = `x&nbsp;x`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `x${rawnbsp}x`, "20.01");
    t.strictSame(
      res.whatWasDone,
      {
        removeWidows: false,
        convertEntities: true,
      },
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - nbsp only, nothing else`,
  (t) => {
    const source = `&nbsp;`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `${rawnbsp}`, "21.01");
    t.strictSame(
      res.whatWasDone,
      {
        removeWidows: false,
        convertEntities: true,
      },
      "21.02"
    );
    t.end();
  }
);

// 02 - opts.convertEntities
// -----------------------------------------------------------------------------

tap.test(
  `22 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - entities, one line string no full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - entities, one line string with full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.`, {
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.`,
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - no entities, one line string no full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "24"
    );
    t.end();
  }
);

tap.test(
  `25 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - no entities, one line string with full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd.`,
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break - widow fix needed`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd\neee fff ggg hhh.`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd\neee fff ggg${encodedNbspHtml}hhh.`,
      "26"
    );
    t.end();
  }
);

tap.test(
  `27 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break -  - one line break, with full stop - widow fix needed`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.\neee fff ggg hhh.`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.\neee fff ggg${encodedNbspHtml}hhh.`,
      "27"
    );
    t.end();
  }
);

tap.test(
  `28 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - trailing space`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.  \n\neee fff ggg hhh`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.  \n\neee fff ggg${encodedNbspHtml}hhh`,
      "28"
    );
    t.end();
  }
);

tap.test(
  `29 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - trailing tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.\t\t\n\neee fff ggg hhh\t\t`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.\t\t\n\neee fff ggg${encodedNbspHtml}hhh\t\t`,
      "29"
    );
    t.end();
  }
);

tap.test(
  `30 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
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
  `31 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc&#160;ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "31"
    );
    t.end();
  }
);

tap.test(
  `32 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc&#160;ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "32"
    );
    t.end();
  }
);

tap.test(
  `33 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`,
      "33"
    );
    t.end();
  }
);

tap.test(
  `34 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
      "34"
    );
    t.end();
  }
);

tap.test(
  `35 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc  ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "35"
    );
    t.end();
  }
);

tap.test(
  `36 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc  ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "36"
    );
    t.end();
  }
);

tap.test(
  `37 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc\tddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "37"
    );
    t.end();
  }
);

tap.test(
  `38 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc\tddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "38"
    );
    t.end();
  }
);

// existing, neighbour nbsp's get converted
tap.test(
  `39 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`,
      "39"
    );
    t.end();
  }
);

tap.test(
  `40 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`,
      "40"
    );
    t.end();
  }
);

tap.test(
  `41 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        targetLanguage: `css`,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspCss}ccc${encodedNbspCss}ddd`,
      "41"
    );
    t.end();
  }
);

tap.test(
  `42 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        targetLanguage: `js`,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspJs}ccc${encodedNbspJs}ddd`,
      "42"
    );
    t.end();
  }
);

tap.test(
  `43 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc ddd`,
      "43"
    );
    t.end();
  }
);

tap.test(
  `44 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc ddd`,
      "44"
    );
    t.end();
  }
);

tap.test(
  `45 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: true,
        targetLanguage: `css`,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspCss}ccc ddd`,
      "45"
    );
    t.end();
  }
);

// 03 - hyphens
// -----------------------------------------------------------------------------

tap.test(
  `46 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - in front of dashes`,
  (t) => {
    [rawMdash, rawNdash, "-"].forEach((oneOfDashes) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(
            `Here is a very long line of text ${oneOfDashes} not too long though`,
            {
              convertEntities: false,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of text${rawnbsp}${oneOfDashes} not too long${rawnbsp}though`,
          `03.01.01 - ${oneOfDashes} - ${targetLanguage}`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text ${oneOfDashes} not too long though`,
            {
              convertEntities: true,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of text${encodedNbsps[i]}${oneOfDashes} not too long${encodedNbsps[i]}though`,
          `03.01.02 - ${oneOfDashes} - ${targetLanguage}`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text ${oneOfDashes} not too long though`,
            {
              convertEntities: false,
              hyphens: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of text ${oneOfDashes} not too long${rawnbsp}though`,
          `03.01.03 - ${oneOfDashes} - ${targetLanguage}`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text ${oneOfDashes} not too long though`,
            {
              convertEntities: true,
              hyphens: false,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of text ${oneOfDashes} not too long${encodedNbsps[i]}though`,
          `03.01.04 - ${oneOfDashes} - ${targetLanguage}`
        );
      });
    });
    t.end();
  }
);

tap.test(
  `47 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - hyphen is minus where currency follows`,
  (t) => {
    [rawMdash, rawNdash, "-"].forEach((oneOfDashes, y) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(`Discount: ${oneOfDashes}&pound;10.00`, {
            convertEntities: false,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          }).res,
          `Discount: ${oneOfDashes}&pound;10.00`,
          `03.02.0${i + y} - ${oneOfDashes} - ${targetLanguage}`
        );
      });
    });
    t.end();
  }
);

tap.test(
  `48 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - with ${encodedNbspHtml} and double space`,
  (t) => {
    languages.forEach((targetLanguage, i) => {
      t.equal(
        removeWidows(`HOORAY  &mdash;  IT&rsquo;S HERE`, {
          convertEntities: true,
          hyphens: true,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `HOORAY${encodedNbsps[i]}&mdash;  IT&rsquo;S${encodedNbsps[i]}HERE`,
        `03.03.0${i} - ${targetLanguage}`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 04. line endings
// -----------------------------------------------------------------------------

tap.test(
  `49 - \u001b[${34}m${`line endings`}\u001b[${39}m - does not mangle string with consistent line endings`,
  (t) => {
    ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
            {
              convertEntities: false,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text`,
          `04.01.01.0${1 + i + idx} - ${targetLanguage} - raw - two ${
            eolTypes[idx]
          }`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
            {
              convertEntities: true,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text`,
          `04.01.02.0${2 + i + idx} - ${targetLanguage} - encoded - two ${
            eolTypes[idx]
          }`
        );

        // trailing line breaks:
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
            {
              convertEntities: false,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}`,
          `04.01.03.0${3 + i + idx} - ${targetLanguage} - raw - two ${
            eolTypes[idx]
          } - trailing line breaks`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
            {
              convertEntities: true,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}`,
          `04.01.04.0${4 + i + idx} - ${targetLanguage} - encoded - two ${
            eolTypes[idx]
          } - trailing line breaks`
        );
      });
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 05. opts.ignore - Nunjucks
// -----------------------------------------------------------------------------

tap.test(
  `50 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and nothing happens`,
  (t) => {
    //
    // ganged cases where nothing should happen:
    const vals = [
      `{% if something %} some text and more text {% endif %}`,
      `{%- if something -%}\n\nsome text and more text\n\n{%- endif -%}`,
      `{{ something else here with many words }}`,
      `{% if something else and also another thing %}`,
      `Something here and there and then, {% if something else and also another thing %}`,
    ];
    vals.forEach((val, i) => {
      t.equal(
        removeWidows(val, {
          ignore: `jinja`,
        }).res,
        val,
        `05.01.0${1 + i} - templating chunks`
      );
    });
    t.end();
  }
);

tap.test(
  `51 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`,
  (t) => {
    const source = `{% if something else and also another thing %}tralala {% endif %}some text here`;
    const res = `{% if something else and also another thing %}tralala {% endif %}some text${encodedNbspHtml}here`;
    t.equal(
      removeWidows(source, { minCharCount: 5 }).res,
      res,
      `51.01 - words under threshold outside templating chunk which completes the threshold`
    );
    t.equal(
      removeWidows(source, {
        ignore: `jinja`,
        minCharCount: 5,
      }).res,
      res,
      `51.02`
    );
    t.end();
  }
);

tap.test(
  `52 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`,
  (t) => {
    languages.forEach((targetLanguage, i) => {
      t.equal(
        removeWidows(
          `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more text.`,
          {
            convertEntities: false,
            targetLanguage,
            ignore: ["jinja"],
            minCharCount: 5,
          }
        ).res,
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
        `05.03.0${1 + i} - min word count threshold + ignore jinja combo`
      );
      t.equal(
        removeWidows(
          `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
          {
            convertEntities: true,
            targetLanguage,
            ignore: ["jinja"],
            minCharCount: 5,
          }
        ).res,
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${encodedNbsps[i]}text.`,
        `05.03.0${2 + i} - min word count threshold + ignore jinja combo`
      );
      t.equal(
        removeWidows(
          `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more text.`,
          {
            convertEntities: false,
            targetLanguage,
            ignore: `jinja`,
            minCharCount: 5,
          }
        ).res,
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
        `05.03.0${1 + i} - min word count threshold + ignore jinja combo`
      );
      t.equal(
        removeWidows(
          `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
          {
            convertEntities: true,
            targetLanguage,
            ignore: `jinja`,
            minCharCount: 5,
          }
        ).res,
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${encodedNbsps[i]}text.`,
        `05.03.0${2 + i} - min word count threshold + ignore jinja combo`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// opts.UKPostcodes
// -----------------------------------------------------------------------------

tap.test(
  `53 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1AA and some more${encodedNbspHtml}text.`,
      "53"
    );
    t.end();
  }
);

tap.test(
  `54 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        minCharCount: 5,
      }).res,
      `Some text SW1A${encodedNbspHtml}1AA and some more${encodedNbspHtml}text.`,
      "54"
    );
    t.end();
  }
);

tap.test(
  `55 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
      "55"
    );
    t.end();
  }
);

tap.test(
  `56 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        convertEntities: true,
        targetLanguage: `css`,
        minCharCount: 5,
      }).res,
      `Some text SW1A${encodedNbspCss}1AA and some more${encodedNbspCss}text.`,
      "56"
    );
    t.end();
  }
);

tap.test(
  `57 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        { UKPostcodes: false }
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more${encodedNbspHtml}text.`,
      "57"
    );
    t.end();
  }
);

tap.test(
  `58 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        { UKPostcodes: true }
      ).res,
      `Some text SW1A${encodedNbspHtml}1AA and some more text SW1A${encodedNbspHtml}1AA and some more${encodedNbspHtml}text.`,
      "58"
    );
    t.end();
  }
);

tap.test(
  `59 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          UKPostcodes: false,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
      "59"
    );
    t.end();
  }
);

tap.test(
  `60 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(`Postcode SW1A 1AA.`, {
        UKPostcodes: false,
        minCharCount: 5,
      }).res,
      `Postcode SW1A 1AA.`,
      "60"
    );
    t.end();
  }
);

tap.test(
  `61 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          UKPostcodes: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
      "61"
    );
    t.end();
  }
);

tap.test(
  `62 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          targetLanguage: `js`,
          UKPostcodes: false,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`,
      "62"
    );
    t.end();
  }
);

tap.test(
  `63 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop) - default minimum word count (4) kicks in`,
  (t) => {
    t.equal(
      removeWidows(`Postcode SW1A 1AA.`, {
        targetLanguage: `js`,
        UKPostcodes: false,
        minCharCount: 5,
      }).res,
      `Postcode SW1A 1AA.`,
      "63"
    );
    t.end();
  }
);

tap.test(
  `64 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          targetLanguage: `js`,
          UKPostcodes: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`,
      "64"
    );
    t.end();
  }
);

tap.test(
  `65 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          targetLanguage: `js`,
          UKPostcodes: true,
          convertEntities: false,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
      "65"
    );
    t.end();
  }
);

tap.test(
  `66 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          targetLanguage: `js`,
          UKPostcodes: true,
          convertEntities: false,
          removeWidowPreventionMeasures: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      "66"
    );
    t.end();
  }
);

tap.test(
  `67 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          targetLanguage: `js`,
          UKPostcodes: true,
          convertEntities: false,
          removeWidowPreventionMeasures: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      "67"
    );
    t.end();
  }
);

tap.test(
  `68 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          removeWidowPreventionMeasures: true,
          UKPostcodes: false,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      "68"
    );
    t.end();
  }
);

tap.test(
  `69 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
        {
          removeWidowPreventionMeasures: true,
          UKPostcodes: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      "69"
    );
    t.end();
  }
);

tap.test(
  `70 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          removeWidowPreventionMeasures: false,
          UKPostcodes: false,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
      "70"
    );
    t.end();
  }
);

tap.test(
  `71 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
        {
          removeWidowPreventionMeasures: false,
          UKPostcodes: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
      "71"
    );
    t.end();
  }
);

tap.test(
  `72 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
  (t) => {
    t.equal(
      removeWidows(
        `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
        {
          UKPostcodes: true,
          convertEntities: true,
          minCharCount: 5,
        }
      ).res,
      `\uD83E\uDD84 some text text text SW1A${encodedNbspHtml}1AA more text text text \uD83E\uDD84${encodedNbspHtml}aaa`,
      "72"
    );
    t.end();
  }
);

tap.test(
  `73 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
  (t) => {
    t.equal(
      removeWidows(
        `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
        {
          UKPostcodes: true,
          convertEntities: false,
          minCharCount: 5,
        }
      ).res,
      `\uD83E\uDD84 some text text text SW1A${rawnbsp}1AA more text text text \uD83E\uDD84${rawnbsp}aaa`,
      "73"
    );
    t.end();
  }
);

tap.test(
  `74 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
  (t) => {
    t.equal(
      removeWidows(
        `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
        {
          UKPostcodes: false,
          convertEntities: true,
          minCharCount: 5,
        }
      ).res,
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${encodedNbspHtml}aaa`,
      "74"
    );
    t.end();
  }
);

tap.test(
  `75 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
  (t) => {
    t.equal(
      removeWidows(
        `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
        {
          UKPostcodes: false,
          convertEntities: false,
          minCharCount: 5,
        }
      ).res,
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${rawnbsp}aaa`,
      "75"
    );
    t.end();
  }
);

tap.test(
  `76 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1Aa and some more text.`, {
        UKPostcodes: false,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`,
      "76"
    );
    t.end();
  }
);

tap.test(
  `77 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1Aa and some more text.`, {
        UKPostcodes: true,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`,
      "77"
    );
    t.end();
  }
);

tap.test(
  `78 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: false,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1AA and some more${rawnbsp}text.`,
      "78"
    );
    t.end();
  }
);

tap.test(
  `79 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
      "79"
    );
    t.end();
  }
);

tap.test(
  `80 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        {
          UKPostcodes: false,
          convertEntities: false,
        }
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more\u00A0text.`,
      "80"
    );
    t.end();
  }
);

tap.test(
  `81 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        {
          UKPostcodes: true,
          convertEntities: false,
        }
      ).res,
      `Some text SW1A${rawnbsp}1AA and some more text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
      "81"
    );
    t.end();
  }
);

tap.test(
  `82 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`,
  (t) => {
    t.equal(
      removeWidows(
        `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
        {
          UKPostcodes: false,
          convertEntities: false,
          minCharCount: 5,
        }
      ).res,
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84\u00A0aaa`,
      "82"
    );
    t.end();
  }
);

tap.test(
  `83 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`,
  (t) => {
    t.equal(
      removeWidows(
        `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
        {
          UKPostcodes: true,
          convertEntities: false,
          minCharCount: 5,
        }
      ).res,
      `\uD83E\uDD84 some text text text SW1A\u00A01AA more text text text \uD83E\uDD84\u00A0aaa`,
      "83"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// opts.removeWidowPreventionMeasures
// -----------------------------------------------------------------------------

tap.test(
  `84 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - baseline`,
  (t) => {
    t.equal(
      removeWidows(
        `Lorem${encodedNbspHtml}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        {
          convertEntities: true,
        }
      ).res,
      `Lorem${encodedNbspHtml}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbspHtml}laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbspHtml}laborum.`,
      `84`
    );
    t.end();
  }
);

tap.test(
  `85 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - comes in without nbsp's`,
  (t) => {
    t.equal(
      removeWidows(
        `Lorem${encodedNbspHtml}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        {
          removeWidowPreventionMeasures: true,
          convertEntities: true,
        }
      ).res,
      `Lorem${encodedNbspHtml}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      `85`
    );
    t.end();
  }
);

tap.test(
  `86 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - comes in with nbsp's`,
  (t) => {
    ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(
            `Lorem${encodedNbsps[i]}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbsps[i]}laborum.${eolType}${eolType}Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbsps[i]}laborum.`,
            {
              removeWidowPreventionMeasures: true,
              convertEntities: true,
              targetLanguage,
            }
          ).res,
          `Lorem${encodedNbsps[i]}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.${eolType}${eolType}Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
          `07.03.0${1 + i + idx} - ${targetLanguage} - ${
            eolTypes[idx]
          } - convertEntities=true`
        );
      });
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 08. opts.minWordCount
// -----------------------------------------------------------------------------

tap.test(
  `87 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = zero`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minWordCount: 0,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      "87"
    );
    t.end();
  }
);

tap.test(
  `88 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        targetLanguage: `css`,
        minWordCount: null,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspCss}bbb`,
      "88"
    );
    t.end();
  }
);

tap.test(
  `89 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        targetLanguage: `css`,
        minWordCount: false,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspCss}bbb`,
      "89"
    );
    t.end();
  }
);

tap.test(
  `90 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is less than words in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 2,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "90"
    );
    t.end();
  }
);

tap.test(
  `91 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is equal to words count in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 4,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`,
      "91"
    );
    t.end();
  }
);

tap.test(
  `92 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is more than words in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 999,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc ddd`,
      "92"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 09. opts.minCharCount
// -----------------------------------------------------------------------------

tap.test(
  `93 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = zero`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
      }).res,
      `aaa bbb`,
      `93.01 - default word count 4 kicks in and makes program skip this`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `93.02`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 5,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `93.03`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 6,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `93.04`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 7,
        minWordCount: 0,
      }).res,
      `aaa bbb`,
      `93.05`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 99,
        minWordCount: 0,
      }).res,
      `aaa bbb`,
      `93.06`
    );
    t.end();
  }
);

tap.test(
  `94 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
      }).res,
      `aaa bbb`,
      `94.01`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `94.02`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
        minWordCount: false,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `94.03`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: null,
        minWordCount: null,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `94.04`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `94.05`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 10. opts.reportProgressFunc
// -----------------------------------------------------------------------------

tap.test(
  `95 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - calls the progress function`,
  (t) => {
    let counter = 0;
    const countingFunction = () => {
      // const countingFunction = val => {
      // console.log(`val received: ${val}`);
      counter += 1;
    };

    t.strictSame(
      removeWidows(`aaaaaaaaaa`).res,
      `aaaaaaaaaa`,
      `95.01 - default behaviour`
    );
    t.strictSame(
      removeWidows(`aaaaaaaaaa`, { reportProgressFunc: null }).res,
      `aaaaaaaaaa`,
      `95.02`
    );
    t.strictSame(
      removeWidows(`aaaaaaaaaa`, { reportProgressFunc: false }).res,
      `aaaaaaaaaa`,
      `95.03`
    );

    // 1. our function will mutate the counter variable:
    t.pass(
      removeWidows(
        `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        { reportProgressFunc: countingFunction }
      )
    );

    // 2. check the counter variable:
    t.ok(counter > 95, `95.04 - counter called`);
    t.end();
  }
);

tap.test(
  `96 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - adjusted from-to range`,
  (t) => {
    const gather = [];
    const countingFunction = (val) => {
      gather.push(val);
    };

    t.pass(
      removeWidows(
        `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        {
          reportProgressFunc: countingFunction,
          reportProgressFuncFrom: 21,
          reportProgressFuncTo: 86,
        }
      )
    );

    // 2. check the counter variable:
    const compareTo = [];
    for (let i = 21; i < 87; i++) {
      compareTo.push(i);
    }
    // console.log(
    //   `${`\u001b[${33}m${`gather`}\u001b[${39}m`} = ${JSON.stringify(
    //     gather,
    //     null,
    //     4
    //   )}`
    // );
    // since we use Math.floor, some percentages can be skipped, so let's just
    // confirm that no numbers outside of permitted values are reported
    gather.forEach((perc) =>
      t.ok(compareTo.includes(perc), `checking: ${perc}%`)
    );
    t.equal(gather.length, 86 - 21 + 1, "96.01");
    // t.strictSame(gather, compareTo, `10.02`)

    t.end();
  }
);

// 11 - opts.tagRanges
// -----------------------------------------------------------------------------

tap.test(
  `97 - ${`\u001b[${33}m${`opts.tagRanges`}\u001b[${39}m`} - accepts known tag ranges and ignores everything`,
  (t) => {
    const source = `<a href="zzz" target="_blank" style="font-size: 10px; line-height: 14px;">`;
    t.equal(
      removeWidows(source, {
        tagRanges: [[0, 74]],
      }).res,
      source,
      `97 - everything ignored because everything is a tag`
    );
    t.end();
  }
);

tap.test(
  `98 - ${`\u001b[${33}m${`opts.tagRanges`}\u001b[${39}m`} - widow space between tags`,
  (t) => {
    t.equal(
      removeWidows(
        `something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>`
      ).res,
      `something in front here <a style="display: block;">x</a> <b style="display:${encodedNbspHtml}block;">y</b>`,
      `98.01 - default behaviour`
    );
    t.equal(
      removeWidows(
        `something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>`,
        {
          tagRanges: [
            [24, 51],
            [52, 56],
            [57, 84],
            [85, 89],
          ],
        }
      ).res,
      `something in front here <a style="display: block;">x</a>${encodedNbspHtml}<b style="display: block;">y</b>`,
      `98.02 - tags skipped`
    );
    t.end();
  }
);

tap.test(
  `99 - ${`\u001b[${33}m${`opts.tagRanges`}\u001b[${39}m`} - widow space between tags`,
  (t) => {
    t.equal(
      removeWidows(
        `Very long line, long-enough to trigger widow removal.<br/>\n<br/>\n Text.`
      ).res,
      `Very long line, long-enough to trigger widow${encodedNbspHtml}removal.<br/>\n<br/>\n Text.`,
      `99.01`
    );
    t.equal(
      removeWidows(
        `Very long line, long-enough to trigger widow removal.<br/>\n<br/>\n Text.`,
        {
          tagRanges: [
            [53, 58],
            [60, 65],
          ],
        }
      ).res,
      `Very long line, long-enough to trigger widow${encodedNbspHtml}removal.<br/>\n<br/>\n Text.`,
      `99.02`
    );
    t.end();
  }
);
