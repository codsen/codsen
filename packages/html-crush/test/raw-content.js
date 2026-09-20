// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

test("01 - protects script contents across HTML name casing", () => {
  const inputs = [
    '<script>const x = "a   b";\n  run();</script>',
    '<SCRIPT>const x = "a   b";\n  run();</SCRIPT>',
    '<ScRiPt>const x = "a   b";\n  run();</sCrIpT>',
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: true }).result,
      input,
      `01.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("02 - protects pre, code, and textarea contents across casing", () => {
  const inputs = [
    "<PRE>  a\n   b  </pre>",
    "<CoDe>  a\n   b  </cOdE>",
    "<TEXTAREA>  a\n   b  </textarea>",
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: true }).result,
      input,
      `02.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("03 - does not classify prefix-sharing custom tags as built-ins", () => {
  const inputs = [
    "<script-widget>a   b</script-widget>",
    "<style-widget>a   b</style-widget>",
    "<pre2>a   b</pre2>",
    "<textarea-widget>a   b</textarea-widget>",
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: false }).result,
      input.replace("a   b", "a b"),
      `03.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("04 - protects unclosed raw and preformatted contents", () => {
  const inputs = [
    '<SCRIPT>const x = "a   b";',
    "<PRE>  a\n   b",
    "<CODE>  a\n   b",
    "<TEXTAREA>  a\n   b",
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: true }).result,
      input,
      `04.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("05 - preserves nested preformatted markup", () => {
  const input = "<PRE> a <CODE>  b\n c </CODE> d </PRE>";

  equal(m(equal, input, { removeLineBreaks: true }).result, input, "05.01");
});

test("06 - preserves literal markup and comments in RCDATA and raw text", () => {
  const names = ["title", "textarea", "iframe", "xmp", "noembed", "noframes"];
  const inputs = names.map(
    (name) => `<${name}>a<b >  b<!-- literal --> &amp;</${name}>`,
  );

  equal(
    inputs.map((input) => m(equal, input).result),
    inputs,
    "06.01",
  );
  equal(
    inputs
      .map((input) =>
        m(equal, input, {
          removeHTMLComments: true,
          removeLineBreaks: true,
        }),
      )
      .map(({ result, applicableOpts }) => [
        result,
        applicableOpts.removeHTMLComments,
      ]),
    inputs.map((input) => [input, false]),
    "06.02",
  );
});

test("07 - plaintext protects everything through EOF including apparent closing tags", () => {
  const input = "<PLAINTEXT>  a<!-- literal -->\n</plaintext><b >  b  ";

  equal(
    m(equal, input, { removeHTMLComments: true, removeLineBreaks: true })
      .result,
    input,
    "07.01",
  );
});

test("08 - requires an HTML delimiter after protected element names", () => {
  const inputs = [
    "<title-widget>a  b</title-widget>",
    "<iframe!>a  b</iframe!>",
    "<xmp-widget>a  b</xmp-widget>",
    "<noembed2>a  b</noembed2>",
    "<noframes-widget>a  b</noframes-widget>",
    "<plaintext-widget>a  b</plaintext-widget>",
  ];

  equal(
    inputs.map((input) => m(equal, input).result),
    inputs.map((input) => input.replace("a  b", "a b")),
    "08.01",
  );
});

test("09 - end-tag prefixes and punctuation do not terminate raw content", () => {
  const inputs = [
    "<title>a</titlex><b >  b</title>",
    "<title>a</title!><b >  b</title>",
    "<textarea>a</textarea\u00a0><b >  b</textarea>",
    "<iframe>a</iframe:><b >  b</iframe>",
  ];

  equal(
    inputs.map((input) => m(equal, input, { removeLineBreaks: true }).result),
    inputs,
    "09.01",
  );
});

test("10 - quoted opening attributes cannot close a protected element", () => {
  const inputs = [
    '<title data-x="</title>">a<b >  b</title>',
    "<textarea data-x='</textarea>'>a<b >  b</textarea>",
    '<iframe title="</iframe>">a<b >  b</iframe>',
    '<title data-x="unfinished  value',
  ];

  equal(
    inputs.map((input) => m(equal, input, { removeLineBreaks: true }).result),
    inputs,
    "10.01",
  );
});

test("11 - unclosed RCDATA and raw text remain protected through EOF", () => {
  const inputs = [
    "<TITLE>a<b >  b<!-- literal -->",
    "<IFRAME>a<b >  b<!-- literal -->",
    "<XMP>a<b >  b<!-- literal -->",
    "<NOEMBED>a<b >  b<!-- literal -->",
    "<NOFRAMES>a<b >  b<!-- literal -->",
  ];

  equal(
    inputs.map(
      (input) =>
        m(equal, input, { removeHTMLComments: true, removeLineBreaks: true })
          .result,
    ),
    inputs,
    "11.01",
  );
});

test("12 - script contents start after the complete opening tag", () => {
  const inputs = [
    '<script data-x="</script>">const x="a   b";</script>',
    "<SCRIPT data-x='</script>'>const x='a   b';</SCRIPT>",
    '<script data-x="unfinished </script> a   b',
  ];

  equal(
    inputs.map(
      (input) =>
        m(equal, input, { removeLineBreaks: true, removeHTMLComments: true })
          .result,
    ),
    inputs,
    "12.01",
  );
});

test("13 - script-looking text in an ordinary attribute remains attribute data", () => {
  const input = '<p title="<script>">a   b</p>';

  equal(m(equal, input).result, '<p title="<script>">a b</p>', "13.01");
});

test("14 - style opening attributes cannot become raw style contents", () => {
  const inputs = [
    '<style data-x="</style>">.used{content:"a   b";color:red}</style>',
    "<style data-x='</style>'>.used{content:'a   b';color:red}</style>",
    '<style data-x="/* literal */ </style> a   b">.used{color:red}</style>',
  ];

  equal(
    inputs.map(
      (input) =>
        m(equal, input, {
          removeLineBreaks: true,
          removeHTMLComments: true,
          breakToTheLeftOf: [],
        }).result,
    ),
    inputs,
    "14.01",
  );
});

test.run();
