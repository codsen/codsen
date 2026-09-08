/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: fixtures contain literal template syntax under test */
import { test } from "uvu";
import { equal } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test("01 - arbitrary prefixes can bind an opening element to the JSP namespace", () => {
  equal(
    [
      '<page:root xmlns:page="http://java.sun.com/JSP/Page"/>',
      '<view:expression xmlns:view="http://java.sun.com/JSP/Page">name</view:expression>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP"],
    "01.01",
  );
});

test("02 - a default namespace applies to its declaring element", () => {
  equal(
    detectLang('<root xmlns="http://java.sun.com/JSP/Page"/>'),
    { name: "JSP" },
    "02.01",
  );
});

test("03 - ordinary roots can contain bound JSP descendants", () => {
  equal(
    detectLang(
      '<root xmlns:page="http://java.sun.com/JSP/Page"><section><page:expression>name</page:expression></section></root>',
    ),
    { name: "JSP" },
    "03.01",
  );
});

test("04 - namespace declarations accept both quote styles and spacing", () => {
  equal(
    [
      "<root><p:expression xmlns:p='http://java.sun.com/JSP/Page'/></root>",
      '<root><p:expression xmlns:p \t=\n "http://java.sun.com/JSP/Page" /></root>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP"],
    "04.01",
  );
});

test("05 - an unused prefixed namespace declaration is not JSP evidence", () => {
  equal(
    [
      '<root xmlns:p="http://java.sun.com/JSP/Page"/>',
      '<root xmlns:p="http://java.sun.com/JSP/Page"><child/></root>',
    ].map((input) => detectLang(input).name),
    [null, null],
    "05.01",
  );
});

test("06 - namespace URI spelling and case must match exactly", () => {
  equal(
    [
      '<p:root xmlns:p="http://java.sun.com/jsp/Page"/>',
      '<p:root xmlns:p="https://java.sun.com/JSP/Page"/>',
      '<p:root xmlns:p="http://java.sun.com/JSP/Page/"/>',
      '<p:root xmlns:p="http://java.sun.com/JSP/Page-extra"/>',
      '<p:root xmlns:p="urn:example:http://java.sun.com/JSP/Page"/>',
    ].map((input) => detectLang(input).name),
    [null, null, null, null, null],
    "06.01",
  );
});

test("07 - namespace prefixes remain case sensitive", () => {
  equal(
    [
      '<root xmlns:p="http://java.sun.com/JSP/Page"><P:expression/></root>',
      '<root xmlns:P="http://java.sun.com/JSP/Page"><P:expression/></root>',
    ].map((input) => detectLang(input).name),
    [null, "JSP"],
    "07.01",
  );
});

test("08 - explicit unrelated bindings suppress legacy prefix hints", () => {
  equal(
    [
      '<jsp:include xmlns:jsp="urn:other"/>',
      '<root xmlns:c="urn:other"><c:if/></root>',
      '<root xmlns:cms="urn:other"><cms:include/></root>',
      '<root xmlns:JSP="urn:other"><JSP:include/></root>',
      '<root xmlns:jsp=""><jsp:include/></root>',
    ].map((input) => detectLang(input).name),
    [null, null, null, null, null],
    "08.01",
  );
});

test("09 - a shadowed prefix does not inherit the outer JSP binding", () => {
  equal(
    [
      '<root xmlns:p="http://java.sun.com/JSP/Page"><section xmlns:p="urn:other"><p:expression/></section></root>',
      '<root xmlns:p="http://java.sun.com/JSP/Page"><section xmlns:p=""><p:expression/></section></root>',
    ].map((input) => detectLang(input).name),
    [null, null],
    "09.01",
  );
});

test("10 - closing a shadowing element restores the outer binding", () => {
  equal(
    detectLang(
      '<root xmlns:p="http://java.sun.com/JSP/Page"><section xmlns:p="urn:other"><p:item/></section><p:expression/></root>',
    ),
    { name: "JSP" },
    "10.01",
  );
});

test("11 - self-closing declarations do not leak to siblings", () => {
  equal(
    [
      '<root><section xmlns:p="http://java.sun.com/JSP/Page"/><p:expression/></root>',
      '<root xmlns:p="http://java.sun.com/JSP/Page"><section xmlns:p="urn:other"/><p:expression/></root>',
      '<root><section xmlns:jsp="urn:other"/><jsp:include/></root>',
    ].map((input) => detectLang(input).name),
    [null, "JSP", "JSP"],
    "11.01",
  );
});

test("12 - closing a local declaration removes it before later siblings", () => {
  equal(
    [
      '<root><section xmlns:p="http://java.sun.com/JSP/Page"><child/></section><p:expression/></root>',
      '<root><section xmlns:jsp="urn:other"><child/></section><jsp:include/></root>',
    ].map((input) => detectLang(input).name),
    [null, "JSP"],
    "12.01",
  );
});

test("13 - multiple aliases remain independent", () => {
  equal(
    [
      '<root xmlns:a="urn:other" xmlns:b="http://java.sun.com/JSP/Page"><a:item/><b:expression/></root>',
      '<root xmlns:a="http://java.sun.com/JSP/Page" xmlns:b="http://java.sun.com/JSP/Page"><section xmlns:a="urn:other"><b:expression/></section></root>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP"],
    "13.01",
  );
});

test("14 - closing tags alone do not supply opening element evidence", () => {
  equal(
    [
      "</jsp:include>",
      "</p:expression>",
      '<root xmlns:p="http://java.sun.com/JSP/Page"></p:expression></root>',
    ].map((input) => detectLang(input).name),
    [null, null, null],
    "14.01",
  );
});

test("15 - unbound legacy prefixes retain their opening marker heuristics", () => {
  equal(
    [
      "<jsp:include/>",
      "<c:if/>",
      "<cms:include/>",
      "<JSP:include/>",
      "< \tCMS:include/>",
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP", "JSP", "JSP", "JSP"],
    "15.01",
  );
});

test("16 - classic JSP and existing JSP expression markers remain independent", () => {
  equal(
    [
      "<% int value = 1; %>",
      '<root xmlns:jsp="urn:other"><%= value %></root>',
      "${jspProp.cardTypeName}",
      '<root xmlns:jsp="urn:other">${jspProp.cardTypeName}</root>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP", "JSP", "JSP"],
    "16.01",
  );
});

test("17 - comments hide fake bound elements and legacy prefixes", () => {
  equal(
    [
      '<root xmlns:p="http://java.sun.com/JSP/Page"><!-- <p:expression/> --></root>',
      '<!-- <jsp:root xmlns:jsp="http://java.sun.com/JSP/Page"/> --><root/>',
    ].map((input) => detectLang(input).name),
    [null, null],
    "17.01",
  );
});

test("18 - CDATA hides fake bound elements and legacy prefixes", () => {
  equal(
    [
      '<root xmlns:p="http://java.sun.com/JSP/Page"><![CDATA[<p:expression/>]]></root>',
      "<root><![CDATA[<jsp:include/>]]></root>",
    ].map((input) => detectLang(input).name),
    [null, null],
    "18.01",
  );
});

test("19 - quoted attributes hide apparent markup", () => {
  equal(
    [
      '<root xmlns:p="http://java.sun.com/JSP/Page" example="<p:expression/>"/>',
      "<root example='<jsp:include/>'/>",
    ].map((input) => detectLang(input).name),
    [null, null],
    "19.01",
  );
});

test("20 - processing instructions hide apparent bound elements", () => {
  equal(
    [
      '<?example <p:expression xmlns:p="http://java.sun.com/JSP/Page"/> ?><root/>',
      "<?example <jsp:include/> ?><root/>",
    ].map((input) => detectLang(input).name),
    [null, null],
    "20.01",
  );
});

test("21 - DOCTYPE quoted declarations do not provide element evidence", () => {
  equal(
    detectLang(
      "<!DOCTYPE root [<!ENTITY example '<p:expression xmlns:p=\"http://java.sun.com/JSP/Page\"/>'>]><root/>",
    ),
    { name: null },
    "21.01",
  );
});

test("22 - a comment containing a subset closer does not end the DOCTYPE", () => {
  equal(
    detectLang(
      '<!DOCTYPE root [<!-- ]> <p:expression xmlns:p="http://java.sun.com/JSP/Page"/> -->]><root/>',
    ),
    { name: null },
    "22.01",
  );
});

test("23 - real bound elements remain visible after opaque declarations", () => {
  equal(
    [
      '<?example <p:fake/> ?><root xmlns:p="http://java.sun.com/JSP/Page"><p:expression/></root>',
      '<!DOCTYPE root [<!-- ]> <p:fake/> -->]><root xmlns:p="http://java.sun.com/JSP/Page"><p:expression/></root>',
      '<root xmlns:p="http://java.sun.com/JSP/Page"><!-- <p:fake/> --><![CDATA[<p:fake/>]]><p:expression/></root>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP", "JSP"],
    "23.01",
  );
});

test("24 - unrelated JSTL namespace URIs do not expand supported evidence", () => {
  equal(
    [
      '<t:if xmlns:t="http://java.sun.com/jsp/jstl/core"/>',
      '<c:if xmlns:c="http://java.sun.com/jsp/jstl/core"/>',
      '<root xmlns="http://java.sun.com/jsp/jstl/core"/>',
    ].map((input) => detectLang(input).name),
    [null, null, null],
    "24.01",
  );
});

test("25 - legal Unicode prefixes can bind JSP elements", () => {
  equal(
    [
      '<π:root xmlns:π="http://java.sun.com/JSP/Page"/>',
      '<root xmlns:模板="http://java.sun.com/JSP/Page"><模板:expression/></root>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP"],
    "25.01",
  );
});

test("26 - numeric XML references are decoded once in namespace values", () => {
  equal(
    [
      '<p:root xmlns:p="http:&#47;&#47;java.sun.com&#47;JSP&#47;Page"/>',
      '<p:root xmlns:p="http:&#x2f;&#x2F;java.sun.com&#x2f;JSP&#x2f;Page"/>',
      '<p:root xmlns:p="http:&amp;#47;&amp;#47;java.sun.com/JSP/Page"/>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP", null],
    "26.01",
  );
});

test("27 - invalid references and XML controls do not produce a JSP binding", () => {
  equal(
    [
      '<p:root xmlns:p="http://java.sun.com/JSP/Page&#0;"/>',
      '<p:root xmlns:p="http://java.sun.com/JSP/Page&#x1F;"/>',
      '<p:root xmlns:p="http://java.sun.com/JSP/Page&#x110000;"/>',
      '<p:root xmlns:p="http://java.sun.com/JSP&sol;Page"/>',
    ].map((input) => detectLang(input).name),
    [null, null, null, null],
    "27.01",
  );
});

test("28 - general entities are not resolved from DOCTYPE declarations", () => {
  equal(
    detectLang(
      '<!DOCTYPE p:root [<!ENTITY jsp "http://java.sun.com/JSP/Page">]><p:root xmlns:p="&jsp;"/>',
    ),
    { name: null },
    "28.01",
  );
});

test("29 - a namespace attribute without equals does not create a binding", () => {
  equal(
    [
      '<p:root xmlns:p "http://java.sun.com/JSP/Page"/>',
      '<jsp:root xmlns:jsp "urn:other"/>',
      '<p:root xmlns:p "http://java.sun.com/JSP/Page"<q:root xmlns:q="http://java.sun.com/JSP/Page"/>',
    ].map((input) => detectLang(input).name),
    [null, "JSP", "JSP"],
    "29.01",
  );
});

test("30 - legacy leading whitespace preserves hints and namespace scoping", () => {
  equal(
    [
      "<\fjsp:include/>",
      "<\u00a0JSP:include/>",
      '<root xmlns:jsp="urn:other"><\fjsp:include/></root>',
      '<root xmlns:JSP="urn:other"><\u00a0JSP:include/></root>',
    ].map((input) => detectLang(input).name),
    ["JSP", "JSP", null, null],
    "30.01",
  );
});

test("31 - an incomplete closing tag cannot end a namespace scope", () => {
  equal(
    detectLang('<node xmlns:c="urn:other"></node <c:chart/>'),
    { name: null },
    "31.01",
  );
  equal(
    detectLang('<node xmlns:c="urn:other"></node><c:chart/>'),
    { name: "JSP" },
    "31.02",
  );
});

test("32 - empty namespace prefixes cannot alias the default namespace", () => {
  equal(
    [
      '<text xmlns:="http://java.sun.com/JSP/Page"/>',
      '<:text xmlns="http://java.sun.com/JSP/Page"/>',
      '<text xmlns="http://java.sun.com/JSP/Page"/>',
    ].map((input) => detectLang(input).name),
    [null, null, "JSP"],
    "32.01",
  );
});

test("33 - reserved XML namespace prefixes cannot be rebound to JSP", () => {
  equal(
    [
      '<xml:text xmlns:xml="http://java.sun.com/JSP/Page"/>',
      '<xmlns:text xmlns:xmlns="http://java.sun.com/JSP/Page"/>',
      '<XML:text xmlns:XML="http://java.sun.com/JSP/Page"/>',
    ].map((input) => detectLang(input).name),
    [null, null, "JSP"],
    "33.01",
  );
});

test.run();
