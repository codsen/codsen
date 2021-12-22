import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// opts.unfancyTheAltContents
// -----------------------------------------------------------------------------

test("01 - cleans alt tag contents - fancy quote", () => {
  equal(
    alts('<img alt    ="   someone’s " >'),
    '<img alt="someone\'s" >',
    "01.01 - default"
  );
  equal(
    alts('<img alt    ="   someone’s " >', { unfancyTheAltContents: true }),
    '<img alt="someone\'s" >',
    "01.02 - hardcoded default, unfancyTheAltContents on"
  );
  equal(
    alts('<img alt    ="   someone’s " >', { unfancyTheAltContents: false }),
    '<img alt="   someone’s " >',
    "01.03 - unfancyTheAltContents off - no character substitution, no trim"
  );
});

test("02 - cleans alt tag contents - m-dash + trim", () => {
  equal(
    alts('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "02.01 - default"
  );
  equal(
    alts('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "02.02 - hardcoded default, unfancyTheAltContents on"
  );
  equal(
    alts('<img alt    =" The new offer \u2014 50% discount " >', {
      unfancyTheAltContents: false,
    }),
    '<img alt=" The new offer \u2014 50% discount " >',
    "02.03 - unfancyTheAltContents off - no character substitution, no trimming done"
  );
});

test("03 - un-fancies multiple alt tags", () => {
  equal(
    alts(
      'abc <img alt    ="   someone’s " > def\n <img alt    =" The new offer \u2014 50% discount " > ghi <img      >\n\n\njkl'
    ),
    'abc <img alt="someone\'s" > def\n <img alt="The new offer - 50% discount" > ghi <img alt="" >\n\n\njkl',
    "03 - default"
  );
});

test("04 - adds an ALT within a nunjucks-sprinkled HTML", () => {
  equal(
    alts(
      '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %}></td>'
    ),
    '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %} alt="" ></td>',
    "04.01 - minime of 18.04.02"
  );
  equal(
    alts(
      '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %}></td>'
    ),
    '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %} alt="" ></td>',
    "04.02"
  );
});

test('05 - Nunjucks code following straight after character g of "img"', () => {
  equal(
    alts(
      '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;">'
    ),
    '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;" alt="" >',
    "05"
  );
});

test("06 - Nunjucks code tight before ALT", () => {
  equal(
    alts('<img {% if variables %}class="variables" {% endif %}alt=>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "06.01 - alt with equal with no quotes"
  );
  equal(
    alts('<img {% if variables %}class="variables" {% endif %}alt=">'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "06.02 - alt with equal and single quote, second is missing"
  );
  equal(
    alts('<img {% if variables %}class="variables" {% endif %}alt>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "06.03 - alt with both equal and quotes missing"
  );
});

test.run();
