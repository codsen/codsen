import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - encoded double quotes cannot expose attribute contents", () => {
  equal(extract('<p title="&quot;&gt;secret">visible</p>'), "visible", "01.01");
  equal(extract('<p title="&#34;&#62;secret">visible</p>'), "visible", "01.02");
  equal(
    extract('<p title="&#x22;&#x3E;secret">visible</p>'),
    "visible",
    "01.03",
  );
});

test("02 - encoded single quotes cannot expose attribute contents", () => {
  equal(extract("<p title='&apos;&gt;secret'>visible</p>"), "visible", "02.01");
  equal(extract("<p title='&#39;&#62;secret'>visible</p>"), "visible", "02.02");
});

test("03 - typography normalization cannot create attribute delimiters", () => {
  equal(extract('<p title="“&gt;secret">visible</p>'), "visible", "03.01");
  equal(extract("<p title='‘&gt;secret'>visible</p>"), "visible", "03.02");
  equal(extract('<p title="…“>secret">visible</p>'), "visible", "03.03");
});

test("04 - unquoted values are parsed before encoded whitespace", () => {
  equal(
    extract("<p title=private&#32;data&#62;secret>visible</p>"),
    "visible",
    "04.01",
  );
});

test("05 - recursively encoded attribute contents remain hidden", () => {
  equal(
    extract('<p title="&amp;amp;quot;&amp;gt;secret">visible</p>'),
    "visible",
    "05.01",
  );
});

test("06 - real excluded elements discard their complete contents", () => {
  equal(
    extract(
      "before<script>secret</script><style>hidden</style><xml>private</xml><code>codeword</code><pre>preword</pre>after",
    ),
    "before after",
    "06.01",
  );
});

test("07 - escaped excluded elements retain the markup policy", () => {
  equal(
    extract(
      "before &lt;script&gt;secret&lt;/script&gt; &lt;style&gt;hidden&lt;/style&gt; &lt;xml&gt;private&lt;/xml&gt; &lt;code&gt;codeword&lt;/code&gt; &lt;pre&gt;preword&lt;/pre&gt; after",
    ),
    "before after",
    "07.01",
  );
});

test("08 - recursively escaped markup is interpreted at each decoded layer", () => {
  equal(
    extract("before &amp;lt;code&amp;gt;secret&amp;lt;/code&amp;gt; after"),
    "before after",
    "08.01",
  );
  equal(
    extract(
      "before &amp;amp;lt;style&amp;amp;gt;hidden&amp;amp;lt;/style&amp;amp;gt; after",
    ),
    "before after",
    "08.02",
  );
});

test("09 - attributes in newly decoded markup are parsed before further decoding", () => {
  equal(
    extract(
      "&lt;p title=&quot;&amp;quot;&amp;gt;secret&quot;&gt;visible&lt;/p&gt;",
    ),
    "visible",
    "09.01",
  );
  equal(
    extract(
      "&amp;lt;p title=&amp;quot;&amp;amp;quot;&amp;amp;gt;secret&amp;quot;&amp;gt;visible&amp;lt;/p&amp;gt;",
    ),
    "visible",
    "09.02",
  );
});

test("10 - inline tags retain the existing adjoining-text behavior", () => {
  equal(
    extract("before&lt;b&gt;visible&lt;/b&gt;after"),
    "beforevisibleafter",
    "10.01",
  );
  equal(extract("before<b>visible</b>after"), "beforevisibleafter", "10.02");
});

test("11 - retained text still decodes nested references and typography", () => {
  equal(
    extract("Before&nbsp;“quoted” &amp;amp;ndash; after"),
    "before quoted after",
    "11.01",
  );
  equal(extract("Fish &amp;amp; chips"), "fish chips", "11.02");
});

test("12 - unknown references terminate without changing their current tokens", () => {
  equal(extract("before &unknown; after"), "before &unknown after", "12.01");
  equal(extract("before & after"), "before after", "12.02");
});

test("13 - source surrogate cleanup occurs after original tag boundaries", () => {
  equal(
    extract('<p title="private\uD800>secret">before😀after</p>'),
    "before after",
    "13.01",
  );
});

test("14 - comments cannot introduce attributes or index excluded text", () => {
  equal(
    extract('before<!-- <p title="&quot;&gt;secret">private -->after'),
    "before after",
    "14.01",
  );
  equal(
    extract("before &lt;!-- &lt;code&gt;secret&lt;/code&gt; --&gt; after"),
    "before after",
    "14.02",
  );
});

test.run();
