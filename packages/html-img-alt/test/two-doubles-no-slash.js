import tap from "tap";
import { alts } from "../dist/html-img-alt.esm";

// alt with two double quotes, no space after slash, one XHTML tag
// -----------------------------------------------------------------------------

tap.test(
  "01 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt=""    />zzz'),
      'zzz<img alt="" />zzz',
      "01 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "02 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =""    />zzz'),
      'zzz<img alt="" />zzz',
      "02 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "03 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    ""    />zzz'),
      'zzz<img alt="" />zzz',
      "03 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "04 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    ""/>zzz'),
      'zzz<img alt="" />zzz',
      "04 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "05 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt="   "    />zzz'),
      'zzz<img alt="" />zzz',
      "05 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "06 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    ="   "    />zzz'),
      'zzz<img alt="" />zzz',
      "06 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "07 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    "   "    />zzz'),
      'zzz<img alt="" />zzz',
      "07 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "08 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    "   "/>zzz'),
      'zzz<img alt="" />zzz',
      "08 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "09 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    "   "/>zzz'),
      'zzz<img alt="" />zzz',
      "09 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "10 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt=""    / >zzz'),
      'zzz<img alt="" />zzz',
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =""    / >zzz'),
      'zzz<img alt="" />zzz',
      "11"
    );
    t.end();
  }
);

tap.test(
  "12 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    ""    / >zzz'),
      'zzz<img alt="" />zzz',
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    ""/ >zzz'),
      'zzz<img alt="" />zzz',
      "13"
    );
    t.end();
  }
);

tap.test(
  "14 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt="   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "14"
    );
    t.end();
  }
);

tap.test(
  "15 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    ="   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "15"
    );
    t.end();
  }
);

tap.test(
  "16 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    "   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "16"
    );
    t.end();
  }
);

tap.test(
  "17 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    "   "/ >zzz'),
      'zzz<img alt="" />zzz',
      "17"
    );
    t.end();
  }
);

tap.test(
  "18 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.strictSame(
      alts('zzz<img     alt    =    "   "/ >zzz'),
      'zzz<img alt="" />zzz',
      "18"
    );
    t.end();
  }
);
