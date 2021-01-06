import tap from "tap";
import { alts } from "../dist/html-img-alt.esm";

// missing ALT, other attributes present
// -----------------------------------------------------------------------------

tap.test(
  "01 - alt attribute is missing, there are other attributes too - HTML - #1",
  (t) => {
    // HTML
    t.strictSame(
      alts('zzz<img class="">zzz'),
      'zzz<img class="" alt="" >zzz',
      "01"
    );
    t.end();
  }
);

tap.test(
  "02 - alt attribute is missing, there are other attributes too - HTML - #2",
  (t) => {
    t.strictSame(
      alts('zzz<img    class="">zzz'),
      'zzz<img class="" alt="" >zzz',
      "02"
    );
    t.end();
  }
);

tap.test(
  "03 - alt attribute is missing, there are other attributes too - HTML - #3",
  (t) => {
    t.strictSame(
      alts(
        'zzz<img class=""    >zzz<img class=""    >zzz<img class=""    >zzz'
      ),
      'zzz<img class="" alt="" >zzz<img class="" alt="" >zzz<img class="" alt="" >zzz',
      "03"
    );
    t.end();
  }
);

tap.test(
  "04 - alt attribute is missing, there are other attributes too - XHTML - #1",
  (t) => {
    // XHTML
    t.strictSame(
      alts('zzz<img class=""/>zzz'),
      'zzz<img class="" alt="" />zzz',
      "04"
    );
    t.end();
  }
);

tap.test(
  "05 - alt attribute is missing, there are other attributes too - XHTML - #1",
  (t) => {
    t.strictSame(
      alts('zzz<img    class=""/>zzz'),
      'zzz<img class="" alt="" />zzz',
      "05"
    );
    t.end();
  }
);

tap.test(
  "06 - alt attribute is missing, there are other attributes too - XHTML - #2",
  (t) => {
    t.strictSame(
      alts('zzz<img class=""    />zzz'),
      'zzz<img class="" alt="" />zzz',
      "06"
    );
    t.end();
  }
);

tap.test(
  "07 - alt attribute is missing, there are other attributes too - XHTML - #3",
  (t) => {
    t.strictSame(
      alts('zzz<img    class=""   />zzz'),
      'zzz<img class="" alt="" />zzz',
      "07"
    );
    t.end();
  }
);

tap.test(
  "08 - alt attribute is missing, there are other attributes too - XHTML - #4",
  (t) => {
    t.strictSame(
      alts(
        'zzz<img class=""       />zzz<img class=""       />zzz<img class=""       />zzz'
      ),
      'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
      "08"
    );
    t.end();
  }
);

tap.test(
  "09 - alt attribute is missing, there are other attributes too - XHTML - #5",
  (t) => {
    t.strictSame(
      alts('zzz<img class=""/   >zzz'),
      'zzz<img class="" alt="" />zzz',
      "09"
    );
    t.end();
  }
);

tap.test(
  "10 - alt attribute is missing, there are other attributes too - XHTML - #6",
  (t) => {
    t.strictSame(
      alts('zzz<img    class=""/   >zzz'),
      'zzz<img class="" alt="" />zzz',
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - alt attribute is missing, there are other attributes too - XHTML - #7",
  (t) => {
    t.strictSame(
      alts(
        'zzz<img class=""    /   >zzz<img class=""    /   >zzz<img class=""    /   >zzz'
      ),
      'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
      "11"
    );
    t.end();
  }
);
