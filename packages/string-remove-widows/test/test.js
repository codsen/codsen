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
  `00.01 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported removeWidows() is a function`,
  (t) => {
    t.equal(typeof removeWidows, `function`, `00.01`);
    t.end();
  }
);

tap.test(
  `00.02 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`,
  (t) => {
    t.equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, `00.02`);
    t.end();
  }
);

tap.test(
  `00.03 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - sanity check`,
  (t) => {
    t.equal(rawnbsp, `\u00A0`, `00.03.01`);
    t.equal(encodedNbspHtml, `${encodedNbspHtml}`, `00.03.02`);
    t.end();
  }
);

tap.test(
  `00.04 - ${`\u001b[${36}m${`api bits`}\u001b[${39}m`} - empty opts obj`,
  (t) => {
    t.equal(removeWidows(`aaa bbb ccc`, {}).res, `aaa bbb ccc`);
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - most basic`,
  (t) => {
    const resObj = removeWidows(`aaa bbb ccc ddd`, {
      convertEntities: true,
      minCharCount: 5,
    });
    t.equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`);
    t.same(resObj.whatWasDone, {
      removeWidows: true,
      convertEntities: false,
    });
    t.same(resObj.ranges, [[11, 12, encodedNbspHtml]]);
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - most basic`,
  (t) => {
    const resObj = removeWidows(`aaa bbb ccc  ddd`, {
      convertEntities: true,
      minCharCount: 5,
    });
    t.equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`);
    t.same(resObj.whatWasDone, {
      removeWidows: true,
      convertEntities: false,
    });
    t.same(resObj.ranges, [[11, 13, encodedNbspHtml]]);
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single sentence, no full stop`,
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
  `01.04 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single sentence, full stop`,
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
  `01.05 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, full stops`,
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
  `01.06 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - raw non-breaking space already there`,
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
      t.same(val1.whatWasDone, {
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
      t.same(val2.whatWasDone, {
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
      t.same(val3.whatWasDone, {
        removeWidows: true,
        convertEntities: false,
      });
    });
    t.end();
  }
);

tap.test(
  `01.07 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed`,
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
  `01.08 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed and encoded but in wrong format`,
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
  `01.09 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - single word`,
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
  `01.10 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't touch empty strings`,
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
  `01.11 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't break within tag`,
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
      `01.11`
    );
    t.end();
  }
);

tap.test(
  `01.12 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - doesn't add nbsp after line breaks`,
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
      `01.12`
    );
    t.end();
  }
);

tap.test(
  `01.13 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - line breaks and spaces`,
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
      `01.13`
    );
    t.end();
  }
);

tap.test(
  `01.14 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - ad hoc case`,
  (t) => {
    const source = `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`;
    const res = removeWidows(source, {
      ignore: "all",
      convertEntities: true,
      targetLanguage: "html",
      UKPostcodes: true,
      hyphens: true,
    });
    t.same(res.ranges, null);
    t.end();
  }
);

tap.test(
  `01.15 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - non-widow nbsp is decoded and reported correctly, mixed with widow case`,
  (t) => {
    const source = `abc&nbsp;def ghij knmn`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `abc${rawnbsp}def ghij${rawnbsp}knmn`);
    t.same(res.whatWasDone, {
      removeWidows: true,
      convertEntities: true,
    });
    t.end();
  }
);

tap.test(
  `01.16 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - non-widow nbsp only`,
  (t) => {
    const source = `x&nbsp;x`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `x${rawnbsp}x`);
    t.same(res.whatWasDone, {
      removeWidows: false,
      convertEntities: true,
    });
    t.end();
  }
);

tap.test(
  `01.17 - ${`\u001b[${32}m${`basic tests`}\u001b[${39}m`} - nbsp only, nothing else`,
  (t) => {
    const source = `&nbsp;`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `${rawnbsp}`);
    t.same(res.whatWasDone, {
      removeWidows: false,
      convertEntities: true,
    });
    t.end();
  }
);

// 02 - opts.convertEntities
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - entities, one line string no full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.02 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - entities, one line string with full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.`, {
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.`
    );
    t.end();
  }
);

tap.test(
  `02.03 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - no entities, one line string no full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.04 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text - no entities, one line string with full stop`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd.`
    );
    t.end();
  }
);

tap.test(
  `02.05 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break - widow fix needed`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd\neee fff ggg hhh.`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd\neee fff ggg${encodedNbspHtml}hhh.`
    );
    t.end();
  }
);

tap.test(
  `02.06 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - single line break -  - one line break, with full stop - widow fix needed`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.\neee fff ggg hhh.`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.\neee fff ggg${encodedNbspHtml}hhh.`
    );
    t.end();
  }
);

tap.test(
  `02.07 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - trailing space`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.  \n\neee fff ggg hhh`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.  \n\neee fff ggg${encodedNbspHtml}hhh`
    );
    t.end();
  }
);

tap.test(
  `02.08 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - trailing tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd.\t\t\n\neee fff ggg hhh\t\t`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd.\t\t\n\neee fff ggg${encodedNbspHtml}hhh\t\t`
    );
    t.end();
  }
);

tap.test(
  `02.09 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
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
  `02.10 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc&#160;ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.11 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc&#160;ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.12 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.13 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc&#160;ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.14 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc  ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.15 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - two spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc  ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.16 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc\tddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.17 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - tabs`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc\tddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`
    );
    t.end();
  }
);

// existing, neighbour nbsp's get converted
tap.test(
  `02.18 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.19 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc${rawnbsp}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.20 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        targetLanguage: `css`,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspCss}ccc${encodedNbspCss}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.21 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        targetLanguage: `js`,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspJs}ccc${encodedNbspJs}ddd`
    );
    t.end();
  }
);

tap.test(
  `02.22 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `aaa bbb${rawnbsp}ccc ddd`
    );
    t.end();
  }
);

tap.test(
  `02.23 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspHtml}ccc ddd`
    );
    t.end();
  }
);

tap.test(
  `02.24 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb${encodedNbspHtml}ccc ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities: true,
        targetLanguage: `css`,
        minCharCount: 5,
      }).res,
      `aaa bbb${encodedNbspCss}ccc ddd`
    );
    t.end();
  }
);

// 03 - hyphens
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - in front of dashes`,
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
  `03.02 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - hyphen is minus where currency follows`,
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
  `03.03 - \u001b[${31}m${`opts.hyphens`}\u001b[${39}m - with ${encodedNbspHtml} and double space`,
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
  `04.01 - \u001b[${34}m${`line endings`}\u001b[${39}m - does not mangle string with consistent line endings`,
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
  `05.01 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and nothing happens`,
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
  `05.02 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`,
  (t) => {
    const source = `{% if something else and also another thing %}tralala {% endif %}some text here`;
    const res = `{% if something else and also another thing %}tralala {% endif %}some text${encodedNbspHtml}here`;
    t.equal(
      removeWidows(source, { minCharCount: 5 }).res,
      res,
      `05.02.01 - words under threshold outside templating chunk which completes the threshold`
    );
    t.equal(
      removeWidows(source, {
        ignore: `jinja`,
        minCharCount: 5,
      }).res,
      res,
      `05.02.02`
    );
    t.end();
  }
);

tap.test(
  `05.03 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`,
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
  `06.01 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1AA and some more${encodedNbspHtml}text.`
    );
    t.end();
  }
);

tap.test(
  `06.02 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        minCharCount: 5,
      }).res,
      `Some text SW1A${encodedNbspHtml}1AA and some more${encodedNbspHtml}text.`
    );
    t.end();
  }
);

tap.test(
  `06.03 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`
    );
    t.end();
  }
);

tap.test(
  `06.04 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        convertEntities: true,
        targetLanguage: `css`,
        minCharCount: 5,
      }).res,
      `Some text SW1A${encodedNbspCss}1AA and some more${encodedNbspCss}text.`
    );
    t.end();
  }
);

tap.test(
  `06.05 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        { UKPostcodes: false }
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more${encodedNbspHtml}text.`
    );
    t.end();
  }
);

tap.test(
  `06.06 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        { UKPostcodes: true }
      ).res,
      `Some text SW1A${encodedNbspHtml}1AA and some more text SW1A${encodedNbspHtml}1AA and some more${encodedNbspHtml}text.`
    );
    t.end();
  }
);

tap.test(
  `06.07 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          UKPostcodes: false,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.08 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(`Postcode SW1A 1AA.`, {
        UKPostcodes: false,
        minCharCount: 5,
      }).res,
      `Postcode SW1A 1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.09 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`,
  (t) => {
    t.equal(
      removeWidows(
        `This very long line of text ends with a postcode SW1A 1AA.`,
        {
          UKPostcodes: true,
          minCharCount: 5,
        }
      ).res,
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.10 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
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
      `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.11 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop) - default minimum word count (4) kicks in`,
  (t) => {
    t.equal(
      removeWidows(`Postcode SW1A 1AA.`, {
        targetLanguage: `js`,
        UKPostcodes: false,
        minCharCount: 5,
      }).res,
      `Postcode SW1A 1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.12 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
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
      `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.13 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
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
      `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.14 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
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
      `This very long line of text ends with a postcode SW1A 1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.15 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`,
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
      `This very long line of text ends with a postcode SW1A 1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.16 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
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
      `This very long line of text ends with a postcode SW1A 1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.17 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
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
      `This very long line of text ends with a postcode SW1A 1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.18 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
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
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.19 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`,
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
      `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`
    );
    t.end();
  }
);

tap.test(
  `06.20 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
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
      `\uD83E\uDD84 some text text text SW1A${encodedNbspHtml}1AA more text text text \uD83E\uDD84${encodedNbspHtml}aaa`
    );
    t.end();
  }
);

tap.test(
  `06.21 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
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
      `\uD83E\uDD84 some text text text SW1A${rawnbsp}1AA more text text text \uD83E\uDD84${rawnbsp}aaa`
    );
    t.end();
  }
);

tap.test(
  `06.22 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
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
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${encodedNbspHtml}aaa`
    );
    t.end();
  }
);

tap.test(
  `06.23 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`,
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
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${rawnbsp}aaa`
    );
    t.end();
  }
);

tap.test(
  `06.24 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1Aa and some more text.`, {
        UKPostcodes: false,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`
    );
    t.end();
  }
);

tap.test(
  `06.25 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1Aa and some more text.`, {
        UKPostcodes: true,
        convertEntities: true,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`
    );
    t.end();
  }
);

tap.test(
  `06.26 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: false,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A 1AA and some more${rawnbsp}text.`
    );
    t.end();
  }
);

tap.test(
  `06.27 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`,
  (t) => {
    t.equal(
      removeWidows(`Some text SW1A 1AA and some more text.`, {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5,
      }).res,
      `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`
    );
    t.end();
  }
);

tap.test(
  `06.28 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        {
          UKPostcodes: false,
          convertEntities: false,
        }
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more\u00A0text.`
    );
    t.end();
  }
);

tap.test(
  `06.29 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`,
  (t) => {
    t.equal(
      removeWidows(
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        {
          UKPostcodes: true,
          convertEntities: false,
        }
      ).res,
      `Some text SW1A${rawnbsp}1AA and some more text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`
    );
    t.end();
  }
);

tap.test(
  `06.30 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`,
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
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84\u00A0aaa`
    );
    t.end();
  }
);

tap.test(
  `06.31 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`,
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
      `\uD83E\uDD84 some text text text SW1A\u00A01AA more text text text \uD83E\uDD84\u00A0aaa`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// opts.removeWidowPreventionMeasures
// -----------------------------------------------------------------------------

tap.test(
  `07.01 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - baseline`,
  (t) => {
    t.equal(
      removeWidows(
        `Lorem${encodedNbspHtml}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        {
          convertEntities: true,
        }
      ).res,
      `Lorem${encodedNbspHtml}ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbspHtml}laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est${encodedNbspHtml}laborum.`,
      `07.01`
    );
    t.end();
  }
);

tap.test(
  `07.02 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - comes in without nbsp's`,
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
      `07.02`
    );
    t.end();
  }
);

tap.test(
  `07.03 - ${`\u001b[${31}m${`opts.removeWidowPreventionMeasures`}\u001b[${39}m`} - comes in with nbsp's`,
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
  `08.01 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = zero`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minWordCount: 0,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspHtml}bbb`
    );
    t.end();
  }
);

tap.test(
  `08.02 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        targetLanguage: `css`,
        minWordCount: null,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspCss}bbb`
    );
    t.end();
  }
);

tap.test(
  `08.03 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - opts.minWordCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        targetLanguage: `css`,
        minWordCount: false,
        minCharCount: 5,
      }).res,
      `aaa${encodedNbspCss}bbb`
    );
    t.end();
  }
);

tap.test(
  `08.04 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is less than words in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 2,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `08.05 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is equal to words count in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 4,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbspHtml}ddd`
    );
    t.end();
  }
);

tap.test(
  `08.06 - ${`\u001b[${32}m${`opts.minWordCount`}\u001b[${39}m`} - setting is more than words in the input`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb ccc ddd`, {
        minWordCount: 999,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc ddd`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 09. opts.minCharCount
// -----------------------------------------------------------------------------

tap.test(
  `09.01 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = zero`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
      }).res,
      `aaa bbb`,
      `09.01.01 - default word count 4 kicks in and makes program skip this`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.01.02`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 5,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.01.03`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 6,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.01.04`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 7,
        minWordCount: 0,
      }).res,
      `aaa bbb`,
      `09.01.05`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 99,
        minWordCount: 0,
      }).res,
      `aaa bbb`,
      `09.01.06`
    );
    t.end();
  }
);

tap.test(
  `09.02 - ${`\u001b[${33}m${`opts.minCharCount`}\u001b[${39}m`} - opts.minCharCount = falsey`,
  (t) => {
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
      }).res,
      `aaa bbb`,
      `09.02.01`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.02.02`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: false,
        minWordCount: false,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.02.03`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: null,
        minWordCount: null,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.02.04`
    );
    t.equal(
      removeWidows(`aaa bbb`, {
        minCharCount: 0,
        minWordCount: 0,
      }).res,
      `aaa${encodedNbspHtml}bbb`,
      `09.02.05`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 10. opts.reportProgressFunc
// -----------------------------------------------------------------------------

tap.test(
  `10.01 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - calls the progress function`,
  (t) => {
    let counter = 0;
    const countingFunction = () => {
      // const countingFunction = val => {
      // console.log(`val received: ${val}`);
      counter += 1;
    };

    t.same(
      removeWidows(`aaaaaaaaaa`).res,
      `aaaaaaaaaa`,
      `10.01.01 - default behaviour`
    );
    t.same(
      removeWidows(`aaaaaaaaaa`, { reportProgressFunc: null }).res,
      `aaaaaaaaaa`,
      `10.01.02`
    );
    t.same(
      removeWidows(`aaaaaaaaaa`, { reportProgressFunc: false }).res,
      `aaaaaaaaaa`,
      `10.01.03`
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
    t.ok(counter > 95, `10.01.04 - counter called`);
    t.end();
  }
);

tap.test(
  `10.02 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - adjusted from-to range`,
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
    t.equal(gather.length, 86 - 21 + 1);
    // t.same(gather, compareTo, `10.02`)

    t.end();
  }
);

// 11 - opts.tagRanges
// -----------------------------------------------------------------------------

tap.test(
  `11.01 - ${`\u001b[${33}m${`opts.tagRanges`}\u001b[${39}m`} - accepts known tag ranges and ignores everything`,
  (t) => {
    const source = `<a href="zzz" target="_blank" style="font-size: 10px; line-height: 14px;">`;
    t.equal(
      removeWidows(source, {
        tagRanges: [[0, 74]],
      }).res,
      source,
      `11.01 - everything ignored because everything is a tag`
    );
    t.end();
  }
);

tap.test(
  `11.02 - ${`\u001b[${33}m${`opts.tagRanges`}\u001b[${39}m`} - widow space between tags`,
  (t) => {
    t.equal(
      removeWidows(
        `something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>`
      ).res,
      `something in front here <a style="display: block;">x</a> <b style="display:${encodedNbspHtml}block;">y</b>`,
      `11.02.01 - default behaviour`
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
      `11.02 - tags skipped`
    );
    t.end();
  }
);

tap.test(
  `11.03 - ${`\u001b[${33}m${`opts.tagRanges`}\u001b[${39}m`} - widow space between tags`,
  (t) => {
    t.equal(
      removeWidows(
        `Very long line, long-enough to trigger widow removal.<br/>\n<br/>\n Text.`
      ).res,
      `Very long line, long-enough to trigger widow${encodedNbspHtml}removal.<br/>\n<br/>\n Text.`,
      `11.03.01`
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
      `11.03.02`
    );
    t.end();
  }
);
