import { test } from "uvu";
import { equal } from "uvu/assert";

import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

test("01 - standalone closing markers are not opening evidence", () => {
  equal(isJinjaNunjucksRegex().test("%}"), false, "01.01");
  equal(isJinjaNunjucksRegex().test("}}"), false, "01.02");
  equal(isJinjaNunjucksRegex().test("%} }} text }} %}"), false, "01.03");
});

test("02 - nested JSON and CSS braces do not identify a template", () => {
  equal(isJinjaNunjucksRegex().test('{"outer":{"inner":1}}'), false, "02.01");
  equal(
    isJinjaNunjucksRegex().test("@media screen{.x{color:red}}"),
    false,
    "02.02",
  );
});

test("03 - JSP with JavaScript closing braces is not family evidence", () => {
  equal(
    isJinjaNunjucksRegex().test(
      '<%@ page contentType="text/html" %><script>function report(){if(true){return 1;}}</script>',
    ),
    false,
    "03.01",
  );
});

test("04 - opening markers accept unfinished editor fragments", () => {
  equal(isJinjaNunjucksRegex().test("{%"), true, "04.01");
  equal(isJinjaNunjucksRegex().test("{{"), true, "04.02");
});

test("05 - template openings remain visible in HTML script and style", () => {
  equal(
    isJinjaNunjucksRegex().test(
      '<script>const name = "{{ user.name }}";</script>',
    ),
    true,
    "05.01",
  );
  equal(
    isJinjaNunjucksRegex().test("<style>.x{color:{{ color }};}</style>"),
    true,
    "05.02",
  );
});

test("06 - global matching returns only opening markers", () => {
  equal(
    "{% if ready %}{{ name }}{%- endif -%} }} %}".match(isJinjaNunjucksRegex()),
    ["{%", "{{", "{%"],
    "06.01",
  );
});

test("07 - factory calls keep independent match positions", () => {
  const first = isJinjaNunjucksRegex();
  equal(first.test("{{ name }}"), true, "07.01");
  const second = isJinjaNunjucksRegex();
  equal(first === second, false, "07.02");
  equal(second.lastIndex, 0, "07.03");
  equal(second.test("{{ name }}"), true, "07.04");
});

test.run();
