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

const languages = ["html`, `css`, `js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
const eolTypes = ["LF`, `CR`, `CRLF"];

tap.test(`01 - the most basic`, (t) => {
  const resObj = removeWidows(`aaa bbb ccc ddd`, {
    convertEntities: true,
    minCharCount: 5,
  });
  t.equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`, "01.01");
  t.strictSame(
    resObj.whatWasDone,
    {
      removeWidows: true,
      convertEntities: false,
    },
    "01.02"
  );
  t.strictSame(resObj.ranges, [[11, 12, encodedNbspHtml]], "01.03");
  t.end();
});

tap.test(`02`, (t) => {
  const resObj = removeWidows(`aaa bbb ccc  ddd`, {
    convertEntities: true,
    minCharCount: 5,
  });
  t.equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`, "02.01");
  t.strictSame(
    resObj.whatWasDone,
    {
      removeWidows: true,
      convertEntities: false,
    },
    "02.02"
  );
  t.strictSame(resObj.ranges, [[11, 13, encodedNbspHtml]], "02.03");
  t.end();
});

tap.test(`03 - single sentence, no full stop`, (t) => {
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
});

tap.test(`04 - single sentence, full stop`, (t) => {
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
});

tap.test(`05 - paragraphs, full stops`, (t) => {
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
});

tap.test(`06 - raw non-breaking space already there`, (t) => {
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
    t.equal(val3.res, `aaa bbb ccc ddd`, `01.06.0${3 + i} - ${targetLanguage}`);
    t.strictSame(val3.whatWasDone, {
      removeWidows: true,
      convertEntities: false,
    });
  });
  t.end();
});

tap.test(`07 - paragraphs, coming already fixed`, (t) => {
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
});

tap.test(
  `08 - paragraphs, coming already fixed and encoded but in wrong format`,
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

tap.test(`09 - single word`, (t) => {
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
});

tap.test(`10 - doesn't touch empty strings`, (t) => {
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
});

tap.test(`11 - doesn't break within tag`, (t) => {
  const source = `aaa<br/>< br/>bbb< br/><br/>ccc< br/>< br/>ddd`;
  t.equal(
    removeWidows(source, {
      convertEntities: true,
      targetLanguage: `html`,
      UKPostcodes: true,
      hyphens: true,
    }).res,
    source,
    `11`
  );
  t.end();
});

tap.test(`12 - doesn't add nbsp after line breaks`, (t) => {
  const source = `aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc`;
  t.equal(
    removeWidows(source, {
      convertEntities: true,
      targetLanguage: `html`,
      UKPostcodes: true,
      hyphens: true,
    }).res,
    source,
    `12`
  );
  t.end();
});

tap.test(`13 - line breaks and spaces`, (t) => {
  const source = `aaa<br/>\n <br/>\n bbb<br/>\n <br/>\n ccc`;
  t.equal(
    removeWidows(source, {
      convertEntities: true,
      targetLanguage: `html`,
      UKPostcodes: true,
      hyphens: true,
    }).res,
    source,
    `13`
  );
  t.end();
});

tap.test(`14 - ad hoc case`, (t) => {
  const source = `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`;
  const res = removeWidows(source, {
    ignore: "all",
    convertEntities: true,
    targetLanguage: "html",
    UKPostcodes: true,
    hyphens: true,
  });
  t.strictSame(res.ranges, null, "14");
  t.end();
});

tap.test(
  `15 - non-widow nbsp is decoded and reported correctly, mixed with widow case`,
  (t) => {
    const source = `abc&nbsp;def ghij knmn`;
    const res = removeWidows(source, {
      convertEntities: false,
    });
    t.equal(res.res, `abc${rawnbsp}def ghij${rawnbsp}knmn`, "15.01");
    t.strictSame(
      res.whatWasDone,
      {
        removeWidows: true,
        convertEntities: true,
      },
      "15.02"
    );
    t.end();
  }
);

tap.test(`16 - non-widow nbsp only`, (t) => {
  const source = `x&nbsp;x`;
  const res = removeWidows(source, {
    convertEntities: false,
  });
  t.equal(res.res, `x${rawnbsp}x`, "16.01");
  t.strictSame(
    res.whatWasDone,
    {
      removeWidows: false,
      convertEntities: true,
    },
    "16.02"
  );
  t.end();
});

tap.test(`17 - nbsp only, nothing else`, (t) => {
  const source = `&nbsp;`;
  const res = removeWidows(source, {
    convertEntities: false,
  });
  t.equal(res.res, `${rawnbsp}`, "17.01");
  t.strictSame(
    res.whatWasDone,
    {
      removeWidows: false,
      convertEntities: true,
    },
    "17.02"
  );
  t.end();
});
