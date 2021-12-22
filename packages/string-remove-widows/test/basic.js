import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  removeWidows,
  // version
} from "../dist/string-remove-widows.esm.js";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

const languages = ["html`, `css`, `js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
const eolTypes = ["LF`, `CR`, `CRLF"];

test(`01 - the most basic`, () => {
  let resObj = removeWidows(`aaa bbb ccc ddd`, {
    convertEntities: true,
    minCharCount: 5,
  });
  equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`, "01.01");
  equal(
    resObj.whatWasDone,
    {
      removeWidows: true,
      convertEntities: false,
    },
    "01.02"
  );
  equal(resObj.ranges, [[11, 12, encodedNbspHtml]], "01.03");
});

test(`02`, () => {
  let resObj = removeWidows(`aaa bbb ccc  ddd`, {
    convertEntities: true,
    minCharCount: 5,
  });
  equal(resObj.res, `aaa bbb ccc${encodedNbspHtml}ddd`, "02.01");
  equal(
    resObj.whatWasDone,
    {
      removeWidows: true,
      convertEntities: false,
    },
    "02.02"
  );
  equal(resObj.ranges, [[11, 13, encodedNbspHtml]], "02.03");
});

test(`03 - single sentence, no full stop`, () => {
  languages.forEach((targetLanguage, i) => {
    equal(
      removeWidows(`aaa bbb ccc ddd`, {
        convertEntities: true,
        targetLanguage,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${encodedNbsps[i]}ddd`,
      `01.03.0${1 + i} - ${targetLanguage}`
    );
    equal(
      removeWidows(`aaa bbb ccc ddd`, {
        convertEntities: false,
        targetLanguage,
        minCharCount: 5,
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      `01.03.0${2 + i} - ${targetLanguage}`
    );
    equal(
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
});

test(`04 - single sentence, full stop`, () => {
  languages.forEach((targetLanguage, i) => {
    equal(
      removeWidows(`Aaa bbb ccc ddd.`, {
        convertEntities: true,
        targetLanguage,
        minCharCount: 5,
      }).res,
      `Aaa bbb ccc${encodedNbsps[i]}ddd.`,
      `01.04.0${1 + i} - ${targetLanguage}`
    );
    equal(
      removeWidows(`Aaa bbb ccc ddd.`, {
        convertEntities: false,
        targetLanguage,
        minCharCount: 5,
      }).res,
      `Aaa bbb ccc${rawnbsp}ddd.`,
      `01.04.0${2 + i} - ${targetLanguage}`
    );
    equal(
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
});

test(`05 - paragraphs, full stops`, () => {
  ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
    languages.forEach((targetLanguage, i) => {
      equal(
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
      equal(
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
      equal(
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
      equal(
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
      equal(
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
      equal(
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
});

test(`06 - raw non-breaking space already there`, () => {
  languages.forEach((targetLanguage, i) => {
    let val1 = removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
      convertEntities: true,
      targetLanguage,
      minCharCount: 5,
    });
    equal(
      val1.res,
      `aaa bbb ccc${encodedNbsps[i]}ddd`,
      `01.06.0${1 + i} - ${targetLanguage}`
    );
    equal(val1.whatWasDone, {
      removeWidows: true,
      convertEntities: false,
    });

    let val2 = removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
      convertEntities: false,
      minCharCount: 5,
    });
    equal(
      val2.res,
      `aaa bbb ccc${rawnbsp}ddd`,
      `01.06.0${2 + i} - ${targetLanguage}`
    );
    equal(val2.whatWasDone, {
      removeWidows: true,
      convertEntities: false,
    });

    let val3 = removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
      removeWidowPreventionMeasures: true,
      convertEntities: false,
      minCharCount: 5,
    });
    equal(val3.res, `aaa bbb ccc ddd`, `01.06.0${3 + i} - ${targetLanguage}`);
    equal(val3.whatWasDone, {
      removeWidows: true,
      convertEntities: false,
    });
  });
});

test(`07 - paragraphs, coming already fixed`, () => {
  ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
    languages.forEach((targetLanguage, i) => {
      equal(
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
      equal(
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
      equal(
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
      equal(
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
});

test(`08 - paragraphs, coming already fixed and encoded but in wrong format`, () => {
  encodedNbsps.forEach((singleEncodedNbsp, z) => {
    ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
      languages.forEach((targetLanguage, i) => {
        equal(
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

        equal(
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
});

test(`09 - single word`, () => {
  let str = `fhkdfhgkhdfjkghdkjfgjdfjgkdhfgkjhdkjfgdkfgdfjkh`;
  languages.forEach((targetLanguage, i) => {
    // removeWidowPreventionMeasures false
    equal(
      removeWidows(str, {
        convertEntities: true,
        targetLanguage,
      }).res,
      str,
      `01.09.0${1 + i} - ${targetLanguage}`
    );
    equal(
      removeWidows(str, {
        convertEntities: false,
        targetLanguage,
      }).res,
      str,
      `01.09.0${2 + i} - ${targetLanguage}`
    );

    // removeWidowPreventionMeasures: true
    equal(
      removeWidows(str, {
        removeWidowPreventionMeasures: true,
        targetLanguage,
      }).res,
      str,
      `01.09.0${3 + i} - ${targetLanguage}`
    );
    equal(
      removeWidows(str, {
        removeWidowPreventionMeasures: true,
        convertEntities: false,
        targetLanguage,
      }).res,
      str,
      `01.09.0${4 + i} - ${targetLanguage}`
    );

    equal(
      removeWidows(str, {
        convertEntities: false,
        targetLanguage,
        minCharCount: 0,
      }).res,
      str,
      `01.09.0${5 + i} - ${targetLanguage}`
    );
  });
});

test(`10 - doesn't touch empty strings`, () => {
  let sources = [
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
    equal(
      removeWidows(``, {
        convertEntities: true,
      }).res,
      ``,
      `01.10 - ${JSON.stringify(str, null, 4)}`
    );
  });
});

test(`11 - doesn't break within tag`, () => {
  let source = `aaa<br/>< br/>bbb< br/><br/>ccc< br/>< br/>ddd`;
  equal(
    removeWidows(source, {
      convertEntities: true,
      targetLanguage: `html`,
      UKPostcodes: true,
      hyphens: true,
    }).res,
    source,
    `11`
  );
});

test(`12 - doesn't add nbsp after line breaks`, () => {
  let source = `aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc`;
  equal(
    removeWidows(source, {
      convertEntities: true,
      targetLanguage: `html`,
      UKPostcodes: true,
      hyphens: true,
    }).res,
    source,
    `12`
  );
});

test(`13 - line breaks and spaces`, () => {
  let source = `aaa<br/>\n <br/>\n bbb<br/>\n <br/>\n ccc`;
  equal(
    removeWidows(source, {
      convertEntities: true,
      targetLanguage: `html`,
      UKPostcodes: true,
      hyphens: true,
    }).res,
    source,
    `13`
  );
});

test(`14 - ad hoc case`, () => {
  let source = `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`;
  let res = removeWidows(source, {
    ignore: "all",
    convertEntities: true,
    targetLanguage: "html",
    UKPostcodes: true,
    hyphens: true,
  });
  equal(res.ranges, null, "14");
});

test(`15 - non-widow nbsp is decoded and reported correctly, mixed with widow case`, () => {
  let source = `abc&nbsp;def ghij knmn`;
  let res = removeWidows(source, {
    convertEntities: false,
  });
  equal(res.res, `abc${rawnbsp}def ghij${rawnbsp}knmn`, "15.01");
  equal(
    res.whatWasDone,
    {
      removeWidows: true,
      convertEntities: true,
    },
    "15.02"
  );
});

test(`16 - non-widow nbsp only`, () => {
  let source = `x&nbsp;x`;
  let res = removeWidows(source, {
    convertEntities: false,
  });
  equal(res.res, `x${rawnbsp}x`, "16.01");
  equal(
    res.whatWasDone,
    {
      removeWidows: false,
      convertEntities: true,
    },
    "16.02"
  );
});

test(`17 - nbsp only, nothing else`, () => {
  let source = `&nbsp;`;
  let res = removeWidows(source, {
    convertEntities: false,
  });
  equal(res.res, `${rawnbsp}`, "17.01");
  equal(
    res.whatWasDone,
    {
      removeWidows: false,
      convertEntities: true,
    },
    "17.02"
  );
});

test.run();
