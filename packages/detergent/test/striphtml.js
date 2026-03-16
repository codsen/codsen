// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

test("001 - strip HTML - healthy tag pair", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "text <a>text</a> text", opt).res,
      "text text text",
      "001.01",
    );
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "text <a>text</a> text", opt).res,
      "text <a>text</a> text",
      "001.02",
    );
  });
});

test("002 - strip HTML - closing tag without a slash", () => {
  let input = "text <a>text<a> text";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "002.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "002.02");
  });
});

test("003 - strip HTML - unrecognised tag", () => {
  let input = "text <error>text<error> text";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "003.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "003.02");
  });
});

test("004 - strip HTML - strips nonsense tags", () => {
  let input =
    'text <sldkfj asdasd="lekjrtt" lgkdjfld="lndllkjfg">text<hgjkd> text';
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "004.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "004.02");
  });
});

test("005 - strip HTML - strips legit HTML", () => {
  let input = 'text <a href="#" style="display: block;">text</a> text';
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "text text text", "005.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "005.02");
  });
});

test("006 - strip HTML - strips non-ignored singleton tags", () => {
  let input = "<hr>";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "", "006.01");
  });
  mixer({
    stripHtml: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "006.02");
  });
  mixer({
    stripHtml: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "<hr/>", "006.03");
  });
});

test("007 - strip HTML - custom ignored singleton tag", () => {
  mixer({
    stripHtml: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, i) => {
    equal(
      det(ok, not, 0, "<hr>", opt).res,
      "<hr>",
      `007.01 - ${`opt #${i}:\n${"04.01"}`}`,
    );
  });
});

test("008 - strip HTML - opts.useXHTML - removes slash", () => {
  mixer({
    stripHtml: true,
    useXHTML: false,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, i) => {
    equal(
      det(ok, not, 0, "<hr/>", opt).res,
      "<hr>",
      `008.01 - ${`opt #${i}:\n${"04.01"}`}`,
    );
  });
});

test("009 - strip HTML - opts.useXHTML - adds slash", () => {
  mixer({
    useXHTML: true,
    stripHtml: true,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "<hr>", opt).res, "<hr/>", "009.01");
  });
});

test("010 - strip HTML - opts.useXHTML - keeps slash", () => {
  mixer({
    useXHTML: true,
    stripHtml: true,
    stripHtmlButIgnoreTags: ["hr"],
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "<hr>", opt).res, "<hr/>", "010.01");
  });
});

test("011 - strip HTML - opts.useXHTML - minimal case", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "a<div>b</div>c", opt).res, "a b c", "011.01");
  });
});

test("012 - strip HTML - opts.useXHTML - minimal case", () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<div>b</div>c", opt).res,
      "a<div>b</div>c",
      "012.01",
    );
  });
});

test("013 - strip HTML - opts.useXHTML - minimal case", () => {
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\u0000a\u0001<div>\u0002b\u0002</div>\u0004c\u0005", opt)
        .res,
      "a<div>b</div>c",
      "013.01",
    );
  });
});

test("014 - strip HTML - opts.useXHTML - minimal case", () => {
  mixer({
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\u00A3a\u00A3<div>\u00A3b\u00A3</div>\u00A3c\u00A3", opt)
        .res,
      "&pound;a&pound;<div>&pound;b&pound;</div>&pound;c&pound;",
      "014.01",
    );
  });
});

test("015 - strip HTML - single tag", () => {
  equal(
    det(ok, not, 0, "<div>", {
      stripHtml: false,
    }).res,
    "<div>",
    "015.01",
  );
});

test("016 - strip HTML - single tag", () => {
  equal(
    det(ok, not, 0, "<a>", {
      stripHtml: false,
    }).res,
    "<a>",
    "016.01",
  );
});

test("017 - strip HTML - single tag", () => {
  equal(
    det(ok, not, 0, '<a style="font-size: red;">', {
      stripHtml: false,
    }).res,
    '<a style="font-size: red;">',
    "017.01",
  );
});

test("018 - strip HTML - single tag", () => {
  equal(
    det(ok, not, 0, "<div>", {
      stripHtml: true,
    }).res,
    "",
    "018.01",
  );
});

test("019 - strip HTML - single tag, lowercase", () => {
  equal(
    det(ok, not, 0, "<a>", {
      stripHtml: true,
    }).res,
    "",
    "019.01",
  );
});

test("020 - strip HTML - single tag, uppercase", () => {
  let input = "<A>";
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "", "020.01");
  });
  mixer({
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "020.02");
  });
});

test("021 - strip HTML - single tag", () => {
  equal(
    det(ok, not, 0, '<a style="font-size: red;">', {
      stripHtml: true,
    }).res,
    "",
    "021.01",
  );
});

test("022 - strip HTML - strips <script> tags incl. contents", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script>b", opt).res,
      "a b",
      "022.01",
    );
  });
});

test("023 - strip HTML - strips <script> tags incl. contents", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "<script>var i = 0;</script>b", opt).res,
      "b",
      "023.01",
    );
  });
});

test("024 - strip HTML - strips <script> tags incl. contents", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script>", opt).res,
      "a",
      "024.01",
    );
  });
});

test("025 - strip HTML - strips <script> tags incl. contents", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "<script>var i = 0;</script>", opt).res,
      "",
      "025.01",
    );
  });
});

test("026 - strip HTML - <script> tags with whitespace within closing tags", () => {
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script        >b", opt).res,
      "a b",
      "026.01",
    );
  });
});

test("027 - strip HTML - <script> sneaky case", () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script        ", opt).res,
      "a",
      "027.01",
    );
  });
});

test("028 - strip HTML - <script> sneaky case", () => {
  mixer({
    removeLineBreaks: false,
    removeWidows: true,
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a<script>var i = 0;</script", opt).res,
      "a",
      "028.01",
    );
  });
});

test("029 - strip HTML - retaining b tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <b class="test" id="br">set in bold</b> here',
        opt,
      ).res,
      'test text is being <b class="test" id="br">set in bold</b> here',
      "029.01",
    );
  });
});

test("030 - strip HTML - retaining b tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being < b class="test" >set in bold< /  b > here',
        opt,
      ).res,
      'test text is being <b class="test">set in bold</b> here',
      "030.01",
    );
  });
});

test("031 - strip HTML - tag pair's closing tag's slash is put on a wrong side", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "a <sup>c<sup/> d", opt).res,
      "a <sup>c</sup> d",
      "031.01",
    );
  });
});

test("032 - strip HTML - tag pair's closing tag's slash is put on a wrong side", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being < b >set in bold< b /> here", opt)
        .res,
      "test text is being <b>set in bold</b> here",
      "032.01",
    );
  });
});

test("033 - strip HTML - tag pair's closing tag's slash is put on a wrong side", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being <B>set in bold<B/> here", opt).res,
      "test text is being <B>set in bold</B> here",
      "033.01",
    );
  });
});

test("034 - strip HTML - tag pair's closing tag's slash is put on a wrong side", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <b class="h">set in bold<b/> here',
        opt,
      ).res,
      'test text is being <b class="h">set in bold</b> here',
      "034.01",
    );
  });
});

test("035 - strip HTML - retaining i tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being <i>set in italic</i> here", opt).res,
      "test text is being <i>set in italic</i> here",
      "035.01",
    );
  });
});

test("036 - strip HTML - retaining i tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being < i >set in italic< /  i > here", opt)
        .res,
      "test text is being <i>set in italic</i> here",
      "036.01",
    );
  });
});

test("037 - strip HTML - retaining i tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being < I >set in italic<   I /> here", opt)
        .res,
      "test text is being <I>set in italic</I> here",
      "037.01",
    );
  });
});

test("038 - strip HTML - retaining strong tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <strong id="main">set in bold</ strong> here',
        opt,
      ).res,
      'test text is being <strong id="main">set in bold</strong> here',
      "038.01",
    );
  });
});

test("039 - strip HTML - retaining strong tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <strong id="main">set in bold<strong/> here',
        opt,
      ).res,
      'test text is being <strong id="main">set in bold</strong> here',
      "039.01",
    );
  });
});

test("040 - strip HTML - retaining strong tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being < StRoNg >set in bold<StRoNg class="z1" / > here',
        opt,
      ).res,
      'test text is being <StRoNg>set in bold</StRoNg class="z1"> here',
      "040.01",
    );
  });
});

test("041 - strip HTML - retaining strong tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test text is being <em>set in emphasis</em> here", opt)
        .res,
      "test text is being <em>set in emphasis</em> here",
      "041.01",
    );
  });
});

test("042 - strip HTML - retaining strong tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'test text is being <em id="main">set in emphasis<em/> here',
        opt,
      ).res,
      'test text is being <em id="main">set in emphasis</em> here',
      "042.01",
    );
  });
});

test("043 - strip HTML - retaining strong tags by default", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "test text is being < em >set in emphasis<  em  / > here",
        opt,
      ).res,
      "test text is being <em>set in emphasis</em> here",
      "043.01",
    );
  });
});

test("044 - widow removal is aware of surrounding html", () => {
  let input = "<a b c d>";
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "044.01");
  });
});

test("045 - widow removal is aware of surrounding html", () => {
  let input =
    '<a w="1" x="y" z="x">\n<!--[if (gte mso 9)|(IE)]>\n<td a="b:c;" d="e" f="g">';
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, input, "045.01");
  });
});

test("046 - a JSX pattern", () => {
  let input = `<A b>c</A>
</>< /></ >< / >`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, input, opt).res, "c", "046.01");
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
      "046.02",
    );
  });
});

test.run();
