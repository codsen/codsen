import { test } from "uvu";

import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

const c = crush;

const whitespace = ["\n", "\r", "\r\n", " ", "\t", "       \n \t     \n\n"];

function pick(...args) {
  return args[Math.floor(Math.random() * args.length)];
}
function addThousandSeparators(numStr) {
  if (typeof numStr !== "string") {
    numStr = String(numStr);
  }
  let newStr = "";
  for (let i = numStr.length; i--; ) {
    newStr = `${numStr[i]}${
      i !== numStr.length - 1 && (numStr.length - i - 1) % 3 === 0 ? "," : ""
    }${newStr}`;
  }
  return newStr;
}

// either return random Bool or, if args are given, random arg.
function chance(a, b) {
  if (a === undefined && b === undefined) {
    return Math.random() > 0.5;
  }
  return Math.random() > 0.5 ? a : b;
}

function removeWhitespace(str) {
  return String(str).replace(/\s*/gi, "");
}

function generate() {
  return `${chance(
    `${`${chance(`${pick(whitespace)}`, "")}${chance(
      `${pick(
        "<",
        ">",
        "a",
        "strong",
        " ",
        "\t",
        "\n",
        "<a>",
        "<table><tr><td>",
        "<![CDATA[",
        "]]>",
        "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
        "zzzz       \t\t    \n aaa    a     \t   ]]>",
        "<script>",
        "</script>",
        "<![CDATA[[]",
        "]]>>>",
        "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
        "zzzz       \t\t    \n aaa    a     \t   ]]>",
        "<script ",
        "</script{{",
        "<div>\n\t\t<<>>",
        "<div>\n\t\t<<article>>",
        "<div>\n\t\t</>>",
        "<div>\n\t\t</div>>",
        "<div>\n\t\t</div>>",
        "<sgfj ldjgkjfgk ghj lf lkgjh lkfjgl gh kgh;l kglhjk ;glhkj >",
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        '<html lang="en" xmlns="http://www.w3.org/1999/xhtml"\nxmlns:v="urn:schemas-microsoft-com:vml"\nxmlns:o="urn:schemas-microsoft-com:office:office">',
        "<head>",
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
        "<!--[if !mso]><!-- -->",
        '<meta http-equiv="X-UA-Compatible" content="IE=edge" />',
        "<!--<![endif]-->",
        '<meta name="format-detection" content="telephone=no" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        "<title>Yo</title>",
        '<style type="text/css">',
      )}`,
      "",
    )}${chance(
      `${pick(
        "<",
        ">",
        "a",
        "strong",
        " ",
        "<![CDATA[",
        "]]>",
        "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
        "zzzz       \t\t    \n aaa    a     \t   ]]>",
        "<script>",
        "</script>",
        "<![CDATA[[]",
        "]]>>>",
        "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
        "zzzz       \t\t    \n aaa    a     \t   ]]>",
        "<script ",
        "</script{{",
        "\t",
        "\n",
      )}`,
      "",
    )}${chance(`${pick(whitespace)}`, "")}${chance(
      `${pick("<", ">", "a", "strong", " ", "\t", "\n")}`,
      "",
    )}${chance(
      `${pick(
        "<",
        ">",
        "a",
        "strong",
        "<![CDATA[",
        "]]>",
        "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
        "zzzz       \t\t    \n aaa    a     \t   ]]>",
        "<script>",
        "</script>",
        "<![CDATA[[]",
        "]]>>>",
        "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
        "zzzz       \t\t    \n aaa    a     \t   ]]>",
        "<script ",
        "</script{{",
        " ",
        "\t",
        "\n",
      )}`,
      "",
    )}`}`,
    pick("a", "1", "\n", "\t").repeat(pick(0, 1, 2, 3, 50)),
  )}${chance(
    `${pick(
      "<",
      ">",
      "a",
      "strong",
      " ",
      "\t",
      "\n",
      "<a>",
      '<td align="center" style="padding: 0 30px 0 30px;">',
      "<table><tr><td>",
      "<div>\n\t\t<<>>",
      "<div>\n\t\t<<article>>",
      "<div>\n\t\t</>>",
      "<div>\n\t\t</div>>",
      "<![CDATA[",
      "]]>",
      "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script>",
      "</script>",
      "<![CDATA[[]",
      "]]>>>",
      "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script ",
      "</script{{",
      "<div>\n\t\t</div>>",
      "<sgfj ldjgkjfgk ghj lf lkgjh lkfjgl gh kgh;l kglhjk ;glhkj >",
    )}`,
    "",
  )}${chance(
    `${pick(
      "<",
      ">",
      "a",
      "strong",
      " ",
      "\t",
      "\n",
      "<a>",
      "<table><tr><td>",
      "<div>\n\t\t<<>>",
      "<div>\n\t\t<<article>>",
      "<div>\n\t\t</>>",
      "<![CDATA[",
      "]]>",
      "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script>",
      "</script>",
      "<![CDATA[[]",
      "]]>>>",
      "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script ",
      "</script{{",
      "<div>\n\t\t</div>>",
      "<div>\n\t\t</div>>",
      "<sgfj ldjgkjfgk ghj lf lkgjh lkfjgl gh kgh;l kglhjk ;glhkj >",
      '<!--[if (gte mso 9)|(IE)]>\n<table width="50" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td><![endif]-->',
    )}`,
    "",
  )}${chance(
    `${pick(
      "<",
      ">",
      "a",
      "strong",
      " ",
      "\t",
      "\n",
      "<a>",
      "<table><tr><td>",
      "<div>\n\t\t<<>>",
      "<div>\n\t\t<<article>>",
      "<div>\n\t\t</>>",
      "<div>\n\t\t</div>>",
      "<div>\n\t\t</div>>",
      "<![CDATA[",
      "]]>",
      "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script>",
      "</script>",
      "<![CDATA[[]",
      "]]>>>",
      "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script ",
      "</script{{",
      "<sgfj ldjgkjfgk ghj lf lkgjh lkfjgl gh kgh;l kglhjk ;glhkj >",
      "\n<strong> </strong>",
      "\n<strong> z  </strong>",
      "\n<strong> z  <",
      ".\n<strong> z  <",
      "> \n<strong> z  <",
      "> \t<strong> z  <",
      "><strong> z  <",
      "> <strong> z  <",
      ">\t<strong> z  <",
      ">\t</strong> z  <",
      ">\t<</strong> z  <",
      ">\t<></strong> z  <",
      ">\t>></strong> z  <",
      ">\t>> </strong> z  <",
      ">\t>>  </strong> z  <",
    )}`,
    "",
  )}${chance(
    `${pick(
      "<",
      ">",
      "a",
      "strong",
      " ",
      "\t",
      "\n",
      "<a>",
      "<table><tr><td>",
      "<div>\n\t\t<<>>",
      "<div>\n\t\t<<article>>",
      "<div>\n\t\t</>>",
      "<div>\n\t\t</div>>",
      "<div>\n\t\t</div>>",
      "<![CDATA[",
      "]]>",
      "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script>",
      "</script>",
      "<![CDATA[[]",
      "]]>>>",
      "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script ",
      "</script{{",
      "<sgfj ldjgkjfgk ghj lf lkgjh lkfjgl gh kgh;l kglhjk ;glhkj >",
    )}`,
    "",
  )}${chance(
    `${pick(
      "<",
      ">",
      "a",
      "strong",
      " ",
      "\t",
      "\n",
      "<a>",
      "<table><tr><td>",
      "<div>\n\t\t<<>>",
      "<div>\n\t\t<<article>>",
      "<div>\n\t\t</>>",
      "<div>\n\t\t</div>>",
      "<div>\n\t\t</div>>",
      "<![CDATA[",
      "]]>",
      "<![CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script>",
      "</script>",
      "<![CDATA[[]",
      "]]>>>",
      "<[CDATA[\n\n\n\t    aaa    zzz   \t   \n",
      "zzzz       \t\t    \n aaa    a     \t   ]]>",
      "<script ",
      "</script{{",
      "<sgfj ldjgkjfgk ghj lf lkgjh lkfjgl gh kgh;l kglhjk ;glhkj >",
    )}`,
    "",
  )}`;
}

test("*** non-deterministic tests", () => {
  let run = true;
  let counter = 0;
  let startTime = Date.now();

  let argWeSeek;
  process.argv.forEach((arg, i) => {
    if (arg.includes("time")) {
      argWeSeek = /\d+[sm]*/.exec(process.argv[i]);
      if (Array.isArray(argWeSeek) && argWeSeek.length) {
        argWeSeek = argWeSeek[0];
        if (argWeSeek.includes("s")) {
          argWeSeek = Number.parseInt(argWeSeek.replace(/s+/g, ""), 10) * 1000;
        } else if (argWeSeek.includes("m")) {
          argWeSeek = Number.parseInt(argWeSeek.replace(/m+/g, ""), 10) * 60000;
        }
      }
    }
  });

  if (argWeSeek) {
    while (run) {
      if (Date.now() - startTime < argWeSeek) {
        // generate random strong:
        let generated = generate();
        // console.log(`\n${generated}`);
        // ensure that both original without whitespace and minified result without
        // whitespace are the same. In other words, no non-whitespace characters
        // were changed. Only whitespace.
        equal(
          removeWhitespace(generated),
          removeWhitespace(
            c(generated, {
              lineLengthLimit: pick(
                500,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                30,
                40,
                50,
                60,
                70,
                80,
                90,
                100,
                200,
                300,
                600,
                700,
                1000,
                1500,
                2000,
                3000,
              ),
              removeIndentations: chance(),
              removeLineBreaks: chance(),
            }).result,
          ),
          `source was:\n-----------\n${JSON.stringify(
            generated,
            null,
            0,
          )}\n-----------`,
        );
        counter += 1;
      } else {
        run = false;
        console.log(`\n\nTOTAL: ${addThousandSeparators(counter)} ops\n\n`);
      }
    }
  }
});
