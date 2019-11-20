// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";
import deepContains from "ast-deep-contains";

test(`01.01 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - null`, t => {
  const gathered = [];
  ct(
    "abc",
    token => {
      gathered.push(token);
    },
    null,
    { reportProgressFunc: null }
  );
  deepContains(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.02 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - false`, t => {
  const gathered = [];
  ct(
    "abc",
    token => {
      gathered.push(token);
    },
    null,
    { reportProgressFunc: false }
  );
  deepContains(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - short length reports only at 50%`, t => {
  const gathered = [];
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  // short input string should report only when passing at 50%:
  const error1 = t.throws(() => {
    ct(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(30),
      token => {
        gathered.push(token);
      },
      null,
      { reportProgressFunc: shouldveBeenCalled }
    );
  });
  t.regex(error1.message, /50/);
});

test(`01.04 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - longer length reports at 0-100%`, t => {
  let counter = 0;
  const countingFunction = () => {
    // const countingFunction = val => {
    //   console.log(`val received: ${val}`);
    counter++;
  };
  // long input (>1000 chars long) should report at each natural number percentage passed:

  // 1. our function will mutate the counter variable:
  t.pass(
    ct(
      `aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa\n`.repeat(50),
      () => {},
      null,
      { reportProgressFunc: countingFunction }
    )
  );

  // 2. check the counter variable:
  t.truthy(counter);
});

test(`01.05 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - custom reporting range, short input`, t => {
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  // short input string should report only when passing at 50%:
  const error1 = t.throws(() => {
    ct(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(20),
      () => {},
      null,
      {
        reportProgressFunc: shouldveBeenCalled,
        reportProgressFuncFrom: 21,
        reportProgressFuncTo: 86
      }
    );
  });
  t.regex(error1.message, /32/);
});

test(`01.06 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - custom reporting range, longer input`, t => {
  const gather = [];
  const countingFunction = val => {
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
      () => {},
      null,
      {
        reportProgressFunc: countingFunction,
        reportProgressFuncFrom: 21,
        reportProgressFuncTo: 86
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
  gather.forEach(perc => {
    t.true(compareTo.includes(perc), String(perc));
  });
  t.is(gather.length, 86 - 21);

  t.deepEqual(gather, compareTo);
});
