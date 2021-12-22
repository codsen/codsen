import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";
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
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// opts.ignore - Nunjucks
// -----------------------------------------------------------------------------

test(`01 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and nothing happens`, () => {
  //
  // ganged cases where nothing should happen:
  let vals = [
    `{% if something %} some text and more text {% endif %}`,
    `{%- if something -%}\n\nsome text and more text\n\n{%- endif -%}`,
    `{{ something else here with many words }}`,
    `{% if something else and also another thing %}`,
    `Something here and there and then, {% if something else and also another thing %}`,
  ];
  vals.forEach((val, i) => {
    equal(
      removeWidows(val, {
        ignore: `jinja`,
      }).res,
      val,
      `05.01.0${1 + i} - templating chunks`
    );
  });
});

test(`02 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`, () => {
  let source = `{% if something else and also another thing %}tralala {% endif %}some text here`;
  let res = `{% if something else and also another thing %}tralala {% endif %}some text${encodedNbspHtml}here`;
  equal(
    removeWidows(source, { minCharCount: 5 }).res,
    res,
    `02.01 - words under threshold outside templating chunk which completes the threshold`
  );
  equal(
    removeWidows(source, {
      ignore: `jinja`,
      minCharCount: 5,
    }).res,
    res,
    `02.02`
  );
});

test(`03 - \u001b[${35}m${`opts.ignore, nunjucks`}\u001b[${39}m - widow removal detects template code and widows are prevented`, () => {
  languages.forEach((targetLanguage, i) => {
    equal(
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
    equal(
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
    equal(
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
    equal(
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
});

test.run();
