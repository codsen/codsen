import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test(`01 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - healthy tag pair`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "text <a>text</a> text", opt).res,
      "text text text",
      "01.01"
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "text <a>text</a> text", opt).res,
      "text <a>text</a> text",
      "01.02"
    );
  });
});

test(`02 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - closing tag without a slash`, () => {
  let input = "text <a>text<a> text";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "02.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "02.02");
  });
});

test(`03 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - unrecognised tag`, () => {
  let input = "text <error>text<error> text";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "03.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "03.02");
  });
});

test(`04 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips nonsense tags`, () => {
  let input =
    'text <sldkfj asdasd="lekjrtt" lgkdjfld="lndllkjfg">text<hgjkd> text';
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "04.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "04.02");
  });
});

test(`05 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips legit HTML`, () => {
  let input = 'text <a href="#" style="display: block;">text</a> text';
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "05.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "05.02");
  });
});

test(`06 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips non-ignored singleton tags`, () => {
  let input = "<hr>";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "", "06.01");
  });
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "06.02");
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "<hr/>", "06.03");
  });
});

test(`07 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - custom ignored singleton tag`, () => {
  mixer({
    stripHtml: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, i) => {
    equal(det(ok, not, 0, "<hr>", opt).res, "<hr>", `opt #${i}:\n${"04.01"}`);
  });
});

test(`08 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - removes slash`, () => {
  mixer({
    stripHtml: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, i) => {
    equal(det(ok, not, 0, "<hr/>", opt).res, "<hr>", `opt #${i}:\n${"04.01"}`);
  });
});

test(`09 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - adds slash`, () => {
  mixer({
    useXHTML: true,
    stripHtml: true,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "<hr>", opt).res, "<hr/>", "09.01");
  });
});

test(`10 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - keeps slash`, () => {
  mixer({
    useXHTML: true,
    stripHtml: true,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "<hr>", opt).res, "<hr/>", "10.01");
  });
});

test(`11 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a<div>b</div>c", opt).res, "a b c", "11.01");
  });
});

test(`12 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<div>b</div>c", opt).res,
      "a<div>b</div>c",
      "12.01"
    );
  });
});

test(`13 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\u0000a\u0001<div>\u0002b\u0002</div>\u0004c\u0005", opt)
        .res,
      "a<div>b</div>c",
      "13.01"
    );
  });
});

test(`14 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - opts.useXHTML - minimal case`, () => {
  mixer({
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\u00A3a\u00A3<div>\u00A3b\u00A3</div>\u00A3c\u00A3", opt)
        .res,
      "&pound;a&pound;<div>&pound;b&pound;</div>&pound;c&pound;",
      "14.01"
    );
  });
});

test(`15 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, "<div>", {
      stripHtml: false,
    }).res,
    "<div>",
    "15.01"
  );
});

test(`16 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, "<a>", {
      stripHtml: false,
    }).res,
    "<a>",
    "16.01"
  );
});

test(`17 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, '<a style="font-size: red;">', {
      stripHtml: false,
    }).res,
    '<a style="font-size: red;">',
    "17.01"
  );
});

test(`18 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, "<div>", {
      stripHtml: true,
    }).res,
    "",
    "18.01"
  );
});

test(`19 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag, lowercase`, () => {
  equal(
    det(ok, not, 0, "<a>", {
      stripHtml: true,
    }).res,
    "",
    "19.01"
  );
});

test(`20 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag, uppercase`, () => {
  let input = "<A>";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "", "20.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "20.02");
  });
});

test(`21 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - single tag`, () => {
  equal(
    det(ok, not, 0, '<a style="font-size: red;">', {
      stripHtml: true,
    }).res,
    "",
    "21.01"
  );
});

test(`22 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script>b", opt).res,
      "a b",
      "22.01"
    );
  });
});

test(`23 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "<script>var i = 0;</script>b", opt).res,
      "b",
      "23.01"
    );
  });
});

test(`24 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script>", opt).res,
      "a",
      "24.01"
    );
  });
});

test(`25 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - strips <script> tags incl. contents`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "<script>var i = 0;</script>", opt).res, "", "25.01");
  });
});

test(`26 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - <script> tags with whitespace within closing tags`, () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script        >b", opt).res,
      "a b",
      "26.01"
    );
  });
});

test(`27 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - <script> sneaky case`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script        ", opt).res,
      "a",
      "27.01"
    );
  });
});

test(`28 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - <script> sneaky case`, () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script", opt).res,
      "a",
      "28.01"
    );
  });
});

test(`29 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining b tags by default`, () => {
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
      "29.01"
    );
  });
});

test(`30 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining b tags by default`, () => {
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
      "30.01"
    );
  });
});

test(`31 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a <sup>c<sup/> d", opt).res,
      "a <sup>c</sup> d",
      "31.01"
    );
  });
});

test(`32 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being < b >set in bold< b /> here", opt)
        .res,
      "test text is being <b>set in bold</b> here",
      "32.01"
    );
  });
});

test(`33 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being <B>set in bold<B/> here", opt).res,
      "test text is being <B>set in bold</B> here",
      "33.01"
    );
  });
});

test(`34 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <b class="h">set in bold<b/> here',
        opt
      ).res,
      'test text is being <b class="h">set in bold</b> here',
      "34.01"
    );
  });
});

test(`35 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining i tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being <i>set in italic</i> here", opt).res,
      "test text is being <i>set in italic</i> here",
      "35.01"
    );
  });
});

test(`36 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining i tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being < i >set in italic< /  i > here", opt)
        .res,
      "test text is being <i>set in italic</i> here",
      "36.01"
    );
  });
});

test(`37 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining i tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being < I >set in italic<   I /> here", opt)
        .res,
      "test text is being <I>set in italic</I> here",
      "37.01"
    );
  });
});

test(`38 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <strong id="main">set in bold</ strong> here',
        opt
      ).res,
      'test text is being <strong id="main">set in bold</strong> here',
      "38.01"
    );
  });
});

test(`39 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <strong id="main">set in bold<strong/> here',
        opt
      ).res,
      'test text is being <strong id="main">set in bold</strong> here',
      "39.01"
    );
  });
});

test(`40 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining strong tags by default`, () => {
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
      'test text is being <StRoNg>set in bold</StRoNg class="z1"> here',
      "40.01"
    );
  });
});

test(`41 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being <em>set in emphasis</em> here", opt)
        .res,
      "test text is being <em>set in emphasis</em> here",
      "41.01"
    );
  });
});

test(`42 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining strong tags by default`, () => {
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
      'test text is being <em id="main">set in emphasis</em> here',
      "42.01"
    );
  });
});

test(`43 - ${`\u001b[${32}m${"strip HTML"}\u001b[${39}m`} - retaining strong tags by default`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "test text is being < em >set in emphasis<  em  / > here",
        opt
      ).res,
      "test text is being <em>set in emphasis</em> here",
      "43.01"
    );
  });
});

test("44 - widow removal is aware of surrounding html", () => {
  let input = "<a b c d>";
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "44.01");
  });
});

test("45 - widow removal is aware of surrounding html", () => {
  let input =
    '<a w="1" x="y" z="x">\n<!--[if (gte mso 9)|(IE)]>\n<td a="b:c;" d="e" f="g">';
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "45.01");
  });
});

test("46 - a JSX pattern", () => {
  let input = `<A b>c</A>
</>< /></ >< / >`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "c", "46.01");
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
      "46.02"
    );
  });
});

test.run();
