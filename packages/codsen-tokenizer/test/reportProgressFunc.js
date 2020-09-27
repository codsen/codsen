import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

tap.test((t) => {
  const gathered = [];
  ct("abc", {
    reportProgressFunc: null,
    tagCb: (token) => {
      gathered.push(token);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3,
      },
    ],
    `01.01 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - null`
  );
  t.end();
});

tap.test((t) => {
  const gathered = [];
  ct("abc", {
    reportProgressFunc: false,
    tagCb: (token) => {
      gathered.push(token);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3,
      },
    ],
    `01.02 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - false`
  );
  t.end();
});

tap.test((t) => {
  const gathered = [];
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  // short input string should report only when passing at 50%:
  t.throws(
    () => {
      ct(`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(30), {
        reportProgressFunc: shouldveBeenCalled,
        tagCb: (token) => {
          gathered.push(token);
        },
      });
    },
    /50/,
    `01.03 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - short length reports only at 50%`
  );
  t.end();
});

tap.test((t) => {
  let counter = 0;
  const countingFunction = () => {
    // const countingFunction = val => {
    //   console.log(`val received: ${val}`);
    counter += 1;
  };
  // long input (>1000 chars long) should report at each natural number percentage passed:

  // 1. our function will mutate the counter variable:
  t.pass(
    ct(`aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa\n`.repeat(50), {
      reportProgressFunc: countingFunction,
    })
  );

  // 2. check the counter variable:
  t.ok(
    counter,
    `01.04 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - longer length reports at 0-100%`
  );
  t.end();
});

tap.test((t) => {
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  // short input string should report only when passing at 50%:
  t.throws(
    () => {
      ct(`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(20), {
        reportProgressFunc: shouldveBeenCalled,
        reportProgressFuncFrom: 21,
        reportProgressFuncTo: 86,
      });
    },
    /32/g,
    `01.05 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - custom reporting range, short input`
  );
  t.end();
});

tap.test((t) => {
  const gather = [];
  const countingFunction = (val) => {
    // const countingFunction = val => {
    // console.log(`val received: ${val}`);
    gather.push(val);
  };

  // long input (>1000 chars long) should report at each natural number percentage passed:
  // our function will mutate the counter variable:
  t.pass(
    ct(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(
        50
      ),
      {
        reportProgressFunc: countingFunction,
        reportProgressFuncFrom: 21,
        reportProgressFuncTo: 86,
      }
    )
  );

  // 2. check the counter variable:
  const compareTo = [];
  for (let i = 21; i < 86; i++) {
    compareTo.push(i);
  }
  // since we use Math.floor, some percentages can be skipped, so let's just
  // confirm that no numbers outside of permitted values are reported
  gather.forEach((perc) => {
    t.ok(compareTo.includes(perc), String(perc));
  });
  t.equal(gather.length, 86 - 21);

  t.strictSame(
    gather,
    compareTo,
    `01.06 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - custom reporting range, longer input`
  );
  t.end();
});
