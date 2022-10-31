import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test(`01 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - healthy tag pair`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `text <a>text</a> text`, opt).res,
      "text text text",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `text <a>text</a> text`, opt).res,
      "text <a>text</a> text",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - closing tag without a slash`, () => {
  let input = `text <a>text<a> text`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, input, opt).res,
      "text text text",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, JSON.stringify(opt, null, 4));
  });
});

test(`03 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - unrecognised tag`, () => {
  let input = `text <error>text<error> text`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, input, opt).res,
      "text text text",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, JSON.stringify(opt, null, 4));
  });
});

test(`04 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips nonsense tags`, () => {
  let input =
    'text <sldkfj asdasd="lekjrtt" lgkdjfld="lndllkjfg">text<hgjkd> text';
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, input, opt).res,
      "text text text",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, JSON.stringify(opt, null, 4));
  });
});

test(`05 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips legit HTML`, () => {
  let input = 'text <a href="#" style="display: block;">text</a> text';
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, input, opt).res,
      "text text text",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, JSON.stringify(opt, null, 4));
  });
});

test(`06 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips non-ignored singleton tags`, () => {
  let input = "<hr>";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "", JSON.stringify(opt, null, 4));
  });
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, JSON.stringify(opt, null, 4));
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, input, opt).res,
      "<hr/>",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`07 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - custom ignored singleton tag`, () => {
  mixer({
    stripHtml: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, i) => {
    equal(
      det(ok, not, 0, `<hr>`, opt).res,
      "<hr>",
      `opt #${i}:\n${JSON.stringify(opt, null, 4)}`
    );
  });
});

test(`08 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - removes slash`, () => {
  mixer({
    stripHtml: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, i) => {
    equal(
      det(ok, not, 0, `<hr/>`, opt).res,
      "<hr>",
      `opt #${i}:\n${JSON.stringify(opt, null, 4)}`
    );
  });
});

test(`09 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - adds slash`, () => {
  mixer({
    useXHTML: true,
    stripHtml: true,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `<hr>`, opt).res,
      "<hr/>",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`10 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - keeps slash`, () => {
  mixer({
    useXHTML: true,
    stripHtml: true,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `<hr>`, opt).res,
      "<hr/>",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`11 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<div>b</div>c`, opt).res,
      "a b c",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`12 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<div>b</div>c`, opt).res,
      "a<div>b</div>c",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`13 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\u0000a\u0001<div>\u0002b\u0002</div>\u0004c\u0005`, opt)
        .res,
      "a<div>b</div>c",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`14 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `\u00A3a\u00A3<div>\u00A3b\u00A3</div>\u00A3c\u00A3`, opt)
        .res,
      "&pound;a&pound;<div>&pound;b&pound;</div>&pound;c&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`15 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, `<div>`, {
      stripHtml: false,
    }).res,
    "<div>",
    "15.01"
  );
});

test(`16 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, `<a>`, {
      stripHtml: false,
    }).res,
    "<a>",
    "16.01"
  );
});

test(`17 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, '<a style="font-size: red;">', {
      stripHtml: false,
    }).res,
    '<a style="font-size: red;">',
    "17.01"
  );
});

test(`18 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, `<div>`, {
      stripHtml: true,
    }).res,
    "",
    "18.01"
  );
});

test(`19 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag, lowercase`, () => {
  equal(
    det(ok, not, 0, `<a>`, {
      stripHtml: true,
    }).res,
    "",
    "19.01"
  );
});

test(`20 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag, uppercase`, () => {
  let input = `<A>`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "", JSON.stringify(opt, null, 4));
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, JSON.stringify(opt, null, 4));
  });
});

test(`21 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, '<a style="font-size: red;">', {
      stripHtml: true,
    }).res,
    "",
    "21.01"
  );
});

test(`22 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<script>var i = 0;</script>b`, opt).res,
      "a b",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`23 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `<script>var i = 0;</script>b`, opt).res,
      "b",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`24 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<script>var i = 0;</script>`, opt).res,
      "a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`25 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `<script>var i = 0;</script>`, opt).res,
      "",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`26 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> tags with whitespace within closing tags`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<script>var i = 0;</script        >b`, opt).res,
      "a b",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`27 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<script>var i = 0;</script        `, opt).res,
      "a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`28 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a<script>var i = 0;</script`, opt).res,
      "a",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`29 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <b class="test" id="br">set in bold</b> here',
        opt
      ).res,
      'test text is being <b class="test" id="br">set in bold</b> here',
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`30 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being < b class="test" >set in bold< /  b > here',
        opt
      ).res,
      'test text is being <b class="test">set in bold</b> here',
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`31 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a <sup>c<sup/> d`, opt).res,
      "a <sup>c</sup> d",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`32 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `test text is being < b >set in bold< b /> here`, opt)
        .res,
      "test text is being <b>set in bold</b> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`33 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `test text is being <B>set in bold<B/> here`, opt).res,
      "test text is being <B>set in bold</B> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`34 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `test text is being <b class="h">set in bold<b/> here`,
        opt
      ).res,
      `test text is being <b class="h">set in bold</b> here`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`35 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `test text is being <i>set in italic</i> here`, opt).res,
      "test text is being <i>set in italic</i> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`36 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `test text is being < i >set in italic< /  i > here`, opt)
        .res,
      "test text is being <i>set in italic</i> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`37 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `test text is being < I >set in italic<   I /> here`, opt)
        .res,
      "test text is being <I>set in italic</I> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`38 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `test text is being <strong id="main">set in bold</ strong> here`,
        opt
      ).res,
      `test text is being <strong id="main">set in bold</strong> here`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`39 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `test text is being <strong id="main">set in bold<strong/> here`,
        opt
      ).res,
      `test text is being <strong id="main">set in bold</strong> here`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`40 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being < StRoNg >set in bold<StRoNg class="z1" / > here',
        opt
      ).res,
      `test text is being <StRoNg>set in bold</StRoNg class="z1"> here`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`41 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `test text is being <em>set in emphasis</em> here`, opt)
        .res,
      "test text is being <em>set in emphasis</em> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`42 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <em id="main">set in emphasis<em/> here',
        opt
      ).res,
      `test text is being <em id="main">set in emphasis</em> here`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`43 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `test text is being < em >set in emphasis<  em  / > here`,
        opt
      ).res,
      "test text is being <em>set in emphasis</em> here",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`44 - widow removal is aware of surrounding html`, () => {
  let input = `<a b c d>`;
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "46.01");
  });
});

test(`45 - widow removal is aware of surrounding html`, () => {
  let input = `<a w="1" x="y" z="x">\n<!--[if (gte mso 9)|(IE)]>\n<td a="b:c;" d="e" f="g">`;
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "47.01");
  });
});

test(`46 - a JSX pattern`, () => {
  let input = `<A b>c</A>
</>< /></ >< / >`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "c", "48.01");
  });
  mixer({
    stripHtml: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, input, opt).res,
      `<A b>c</A>
</></></></>`,
      "48.02"
    );
  });
});

test.run();
