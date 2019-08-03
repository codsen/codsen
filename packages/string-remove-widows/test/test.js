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

test(`00.01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported removeWidows() is a function`, t => {
  t.is(typeof removeWidows, "function", "01");
});

test(`00.02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`, t => {
  t.is(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02");
});

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

// test(`01.00 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - two spaces`, t => {
//   t.is(
//     removeWidows(`aaa bbb ccc${encodedNbspCss}ddd`, {
//       convertEntities: true
//     }).res,
//     "aaa bbb ccc&nbsp;ddd",
//     "01.00.01"
//   );
// });

test(`01.00 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - most basic`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "01.00.01"
  );
  t.is(
    removeWidows("aaa bbb ccc  ddd", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "01.00.02 - two spaces"
  );
});

test(`01.01 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - single sentence, no full stop`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows("aaa bbb ccc ddd", {
        convertEntities: true,
        language
      }).res,
      `aaa bbb ccc${encodedNbsps[i]}ddd`,
      `01.01.0${1 + i} - ${language}`
    );
    t.is(
      removeWidows("aaa bbb ccc ddd", {
        convertEntities: false,
        language
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      `01.01.0${2 + i} - ${language}`
    );
  });
});

test(`01.02 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - single sentence, full stop`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows("Aaa bbb ccc ddd.", {
        convertEntities: true,
        language
      }).res,
      `Aaa bbb ccc${encodedNbsps[i]}ddd.`,
      `01.02.0${1 + i} - ${language}`
    );
    t.is(
      removeWidows("Aaa bbb ccc ddd.", {
        convertEntities: false,
        language
      }).res,
      `Aaa bbb ccc${rawnbsp}ddd.`,
      `01.02.0${2 + i} - ${language}`
    );
  });
});

test(`01.03 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - paragraphs, full stops`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          {
            convertEntities: true,
            language
          }
        ).res,
        `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
        `01.03.0${1 + i} - ${language} - ${eolTypes[idx]}`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc ddd.${eolType}${eolType}Ddd eee fff ggg hhh.`,
          {
            convertEntities: false,
            language
          }
        ).res,
        `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
        `01.03.0${2 + i} - ${language} - ${eolTypes[idx]}`
      );
    });
  });
});

test(`01.04 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - raw non-breaking space already there`, t => {
  languages.forEach((language, i) => {
    t.is(
      removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        convertEntities: true,
        language
      }).res,
      `aaa bbb ccc${encodedNbsps[i]}ddd`,
      "01.04.01"
    );
    t.is(
      removeWidows(`aaa bbb ccc${rawnbsp}ddd`, {
        convertEntities: false
      }).res,
      `aaa bbb ccc${rawnbsp}ddd`,
      "01.04.02"
    );
  });
});

test(`01.05 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            convertEntities: true
          }
        ).res,
        `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
        `01.05.0${1 + i} - ${language} - ${eolTypes[idx]}`
      );
      t.is(
        removeWidows(
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          {
            convertEntities: false
          }
        ).res,
        `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
        `01.05.0${2 + i} - ${language} - ${eolTypes[idx]}`
      );
    });
  });
});

test(`01.06 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - paragraphs, coming already fixed and encoded but in wrong format`, t => {
  encodedNbsps.forEach((singleEncodedNbsp, z) => {
    ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
      languages.forEach((language, i) => {
        t.is(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${singleEncodedNbsp}hhh.`,
            {
              convertEntities: true,
              language
            }
          ).res,
          `Aaa bbb ccc${encodedNbsps[i]}ddd.${eolType}${eolType}Ddd eee fff ggg${encodedNbsps[i]}hhh.`,
          `01.06.0${1 + i} - requested lang. ${language} - existing lang. ${
            languages[z]
          } - ${eolTypes[idx]}`
        );

        t.is(
          removeWidows(
            `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${singleEncodedNbsp}hhh.`,
            {
              convertEntities: false,
              language
            }
          ).res,
          `Aaa bbb ccc${rawnbsp}ddd.${eolType}${eolType}Ddd eee fff ggg${rawnbsp}hhh.`,
          `01.06.0${2 + i} - requested lang. ${language} - existing lang. ${
            languages[z]
          } - ${eolTypes[idx]}`
        );
      });
    });
  });
});

test(`01.07 - ${`\u001b[${33}m${`basic tests`}\u001b[${39}m`} - single word`, t => {
  const str = "fhkdfhgkhdfjkghdkjfgjdfjgkdhfgkjhdkjfgdkfgdfjkh";
  languages.forEach((language, i) => {
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
  });
});

// 02 - opts.convertEntities
// -----------------------------------------------------------------------------

test(`02.01 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - four chunks of text`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd").res,
    "aaa bbb ccc&nbsp;ddd",
    "02.01.01 - entities, one line string no full stop"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd.").res,
    "aaa bbb ccc&nbsp;ddd.",
    "02.01.02 - entities, one line string with full stop"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd", { convertEntities: false }).res,
    "aaa bbb ccc\u00A0ddd",
    "02.01.03 - no entities, one line string no full stop"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd.", { convertEntities: false }).res,
    "aaa bbb ccc\u00A0ddd.",
    "02.01.04 - no entities, one line string with full stop"
  );
});

test(`02.02 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - with line breaks`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd\n\neee fff ggg hhh", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd<br/>\n<br/>\neee fff ggg&nbsp;hhh",
    "02.02.01 - two line breaks with encoding BR in XHTML"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd\n\neee fff ggg hhh", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd<br>\n<br>\neee fff ggg&nbsp;hhh",
    "02.02.02 - two BR's, widows with NBSP and HTML BR"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd\n\neee fff ggg hhh", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd\n\neee fff ggg&nbsp;hhh",
    "02.02.03 - two BR's, widows replaced with &nbsp"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd\n\neee fff ggg hhh", {
      convertEntities: false
    }).res,
    "aaa bbb ccc\u00A0ddd\n\neee fff ggg\u00A0hhh",
    "02.02.04 - two BR's, widows replaced with non-encoded NBSP"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd\neee fff ggg hhh.", {
      convertEntities: true
    }).res,
    "aaa bbb ccc ddd\neee fff ggg&nbsp;hhh.",
    "02.02.05 - one line break, no full stop - no widow fix needed"
  );
  t.is(
    removeWidows("aaa bbb ccc ddd.\neee fff ggg hhh.", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd.\neee fff ggg&nbsp;hhh.",
    "02.02.06 - one line break, with full stop - widow fix needed"
  );
});

test(`02.03 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - with trailing whitespace`, t => {
  t.is(
    removeWidows("aaa bbb ccc ddd. \n\neee fff ggg hhh", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd.<br>\n<br>\neee fff ggg&nbsp;hhh",
    "02.03 - remove widows - trailing space"
  );
});

test(`02.04 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - glues UK postcodes`, t => {
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      convertEntities: true
    }).res,
    "Some text SW1A&nbsp;1AA and some more&nbsp;text.",
    "02.04.01 - properly formatted UK postcode, in caps"
  );
  t.is(
    removeWidows(
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      { convertEntities: true }
    ).res,
    "Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.",
    "02.04.02 - multiple properly formatted postcodes"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      convertEntities: true
    }).res,
    "This very long line of text ends with a postcode SW1A&nbsp;1AA.",
    "02.04.03 - line ends with a postcode (full stop)"
  );
  t.is(
    removeWidows("this very long line of text ends with a postcode SW1A 1AA", {
      convertEntities: true
    }).res,
    "this very long line of text ends with a postcode SW1A&nbsp;1AA",
    "02.04.04 - line ends with a postcode (no full stop)"
  );
  t.is(
    removeWidows("🦄 some text text text SW1A 1AA more text text text 🦄 aaa", {
      convertEntities: true
    }).res,
    "&#x1F984; some text text text SW1A&nbsp;1AA more text text text &#x1F984;&nbsp;aaa",
    "02.04.05 - properly formatted UK postcode, some emoji"
  );
  t.is(
    removeWidows("Some text SW1A 1Aa and some more text.", {
      convertEntities: true
    }).res,
    "Some text SW1A 1Aa and some more&nbsp;text.",
    "02.04.06 - improperly formatted UK postcode"
  );
  t.is(
    removeWidows("Some text SW1A 1AA and some more text.", {
      convertEntities: false
    }).res,
    "Some text SW1A\u00A01AA and some more\u00A0text.",
    "02.04.07 - properly formatted UK postcode, in caps"
  );
  t.is(
    removeWidows(
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      { convertEntities: false }
    ).res,
    "Some text SW1A\u00A01AA and some more text SW1A\u00A01AA and some more\u00A0text.",
    "02.04.08 - multiple properly formatted postcodes"
  );
  t.is(
    removeWidows("This very long line of text ends with a postcode SW1A 1AA.", {
      convertEntities: false
    }).res,
    "This very long line of text ends with a postcode SW1A\u00A01AA.",
    "02.04.09 - line ends with a postcode (full stop)"
  );
  t.is(
    removeWidows("this very long line of text ends with a postcode SW1A 1AA", {
      convertEntities: false
    }).res,
    "this very long line of text ends with a postcode SW1A\u00A01AA",
    "02.04.10 - line ends with a postcode (no full stop)"
  );
  t.is(
    removeWidows("🦄 some text text text SW1A 1AA more text text text 🦄 aaa", {
      convertEntities: false
    }).res,
    "🦄 some text text text SW1A\u00A01AA more text text text 🦄\u00A0aaa",
    "02.04.11 - properly formatted UK postcode, some emoji"
  );
  t.is(
    removeWidows("Some text SW1A 1Aa and some more text.", {
      convertEntities: false
    }).res,
    "Some text SW1A 1Aa and some more\u00A0text.",
    "02.04.12 - improperly formatted UK postcode"
  );
});

test(`02.05 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  t.is(
    removeWidows(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ).res,
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "02.05.01 - there's right slash following them"
  );
  t.is(
    removeWidows(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ).res,
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "02.05.02 - there's a known tag before them"
  );
  t.is(
    removeWidows(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ).res,
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aa  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "02.05.03 - hr tag, xhtml style"
  );
  t.is(
    removeWidows(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ).res,
    "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "02.05.04 - hr tag, html style"
  );
});

test(`02.06 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - widow removal detects template code (Jinja/Nunjucks)`, t => {
  t.is(
    removeWidows("{% if something %}").res,
    "{% if something %}",
    "02.06.01 - four chunks"
  );
  t.is(
    removeWidows("{%- if something -%}").res,
    "{%- if something -%}",
    "02.06.02 - dashes"
  );
  t.is(
    removeWidows("{{ something }}").res,
    "{{ something }}",
    "02.06.03 - three chunks"
  );
  t.is(
    removeWidows("{% if something else and also another thing %}").res,
    "{% if something else and also another thing %}",
    "02.06.04 - nine chunks"
  );

  languages.forEach((language, i) => {
    t.is(
      removeWidows(
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more text.`,
        {
          convertEntities: false,
          language
        }
      ).res,
      `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
      "02.06.05 - combo"
    );
    t.is(
      removeWidows(
        `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${rawnbsp}text.`,
        {
          convertEntities: true,
          language
        }
      ).res,
      `Some text {% if something %}fancy{% else %}something else{% endif %}\n\nmore text and more${encodedNbsps[i]}text.`,
      "02.06.05 - combo"
    );
  });
});

test(`02.07 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - numeric HTML entity #160`, t => {
  t.is(
    removeWidows("aaa bbb ccc&#160;ddd", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "02.07.01"
  );
  t.is(
    removeWidows("aaa bbb ccc&#160;ddd", {
      convertEntities: false
    }).res,
    `aaa bbb ccc${rawnbsp}ddd`,
    "02.07.02"
  );
});

test(`02.08 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - doesn't touch other nbsp's`, t => {
  t.is(
    removeWidows("aaa bbb&nbsp;ccc&#160;ddd", {
      convertEntities: true
    }).res,
    "aaa bbb&nbsp;ccc&nbsp;ddd",
    "02.08.01"
  );
  t.is(
    removeWidows("aaa bbb&nbsp;ccc&#160;ddd", {
      convertEntities: false
    }).res,
    `aaa bbb&nbsp;ccc${rawnbsp}ddd`,
    "02.08.02"
  );
});

test(`02.09 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - two spaces`, t => {
  t.is(
    removeWidows("aaa bbb ccc  ddd", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "02.09.01"
  );
  t.is(
    removeWidows("aaa bbb ccc  ddd", {
      convertEntities: false
    }).res,
    `aaa bbb&nbsp;ccc${rawnbsp}ddd`,
    "02.09.02"
  );
});

test(`02.10 - \u001b[${35}m${`opts.convertEntities`}\u001b[${39}m - two spaces`, t => {
  t.is(
    removeWidows("aaa bbb ccc\tddd", {
      convertEntities: true
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "02.10.01"
  );
  t.is(
    removeWidows("aaa bbb ccc\tddd", {
      convertEntities: false
    }).res,
    `aaa bbb&nbsp;ccc${rawnbsp}ddd`,
    "02.10.02"
  );
});

// 03 - dashes
// -----------------------------------------------------------------------------

test(`03.01 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - in front of raw m-dash`, t => {
  [rawMdash, rawNdash, "-"].forEach(oneOfDashes => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: false,
            hyphens: true,
            language
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
            language
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
            language
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
            language
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

test(`04.01 - \u001b[${35}m${`line endings`}\u001b[${39}m - does not mangle string with consistent line endings`, t => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((language, i) => {
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}Here is a another long line of text${eolType}Here is a another long line of text`,
          {
            convertEntities: false,
            hyphens: true,
            language
          }
        ).res,
        `Here is a very long line of${rawnbsp}text${eolType}Here is a another long line of${rawnbsp}text${eolType}Here is a another long line of${rawnbsp}text`,
        `03.02.01.0${i} - ${language} - raw - two ${eolTypes[idx]}`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}Here is a another long line of text${eolType}Here is a another long line of text`,
          {
            convertEntities: true,
            hyphens: true,
            language
          }
        ).res,
        `Here is a very long line of${encodedNbsps[i]}text${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}Here is a another long line of${encodedNbsps[i]}text`,
        `03.02.02.0${i} - ${language} - encoded - two ${eolTypes[idx]}`
      );

      // trailing line breaks:
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}Here is a another long line of text${eolType}Here is a another long line of text${eolType}${eolType}`,
          {
            convertEntities: false,
            hyphens: true,
            language
          }
        ).res,
        `Here is a very long line of${rawnbsp}text${eolType}Here is a another long line of${rawnbsp}text${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}`,
        `03.02.03.0${i} - ${language} - raw - two ${eolTypes[idx]} - trailing line breaks`
      );
      t.is(
        removeWidows(
          `Here is a very long line of text${eolType}Here is a another long line of text${eolType}Here is a another long line of text${eolType}${eolType}`,
          {
            convertEntities: true,
            hyphens: true,
            language
          }
        ).res,
        `Here is a very long line of${encodedNbsps[i]}text${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}`,
        `03.02.04.0${i} - ${language} - encoded - two ${eolTypes[idx]} - trailing line breaks`
      );
    });
  });
});

// -----------------------------------------------------------------------------
// opts.removeWidowPreventionMeasures
// -----------------------------------------------------------------------------

// TODO

// -----------------------------------------------------------------------------
// opts.killSwitch
// -----------------------------------------------------------------------------

// TODO

// -----------------------------------------------------------------------------
// opts.minWordCount
// -----------------------------------------------------------------------------

// TODO

// -----------------------------------------------------------------------------
// opts.minCharLen
// -----------------------------------------------------------------------------

// TODO

// -----------------------------------------------------------------------------
// opts.reportProgressFunc
// -----------------------------------------------------------------------------

// TODO
