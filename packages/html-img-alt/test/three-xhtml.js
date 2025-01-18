import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// GROUP NINE.
// -----------------------------------------------------------------------------
// alt with only one double quote, three XHTML tags

test("01 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts('zzz<img alt="/>zzz<img alt="   />zzz<img alt="/    >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "01.01",
  );
});

test("02 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts('zzz<img alt ="/>zzz<img alt ="   />zzz<img alt ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "02.01",
  );
});

test("03 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts('zzz<img alt= "/>zzz<img alt= "   />zzz<img alt= "/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "03.01",
  );
});

test("04 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts('zzz<img alt=" />zzz<img alt="    />zzz<img alt=" /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "04.01",
  );
});

test("05 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts('zzz<img alt   ="/>zzz<img alt   ="    />zzz<img alt   ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "05.01",
  );
});

test("06 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts('zzz<img alt="   />zzz<img alt="     />zzz<img alt="   /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "06.01",
  );
});

test("07 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts(
      'zzz<img alt   ="   />zzz<img alt   ="     />zzz<img alt   ="   /    >zzz',
    ),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "07.01",
  );
});

test("08 - alt with only one double quote, three XHTML tags", () => {
  equal(alts('<img alt="z"/   >'), '<img alt="z" />', "08.01");
});

test("09 - alt with only one double quote, three XHTML tags", () => {
  equal(
    alts(
      '<img alt="legit quote: \'"/><img alt="legit quote: \'"   /><img alt="legit quote: \'"/   >',
    ),
    '<img alt="legit quote: \'" /><img alt="legit quote: \'" /><img alt="legit quote: \'" />',
    "09.01",
  );
});

test.run();
