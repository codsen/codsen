function isStr(something) {
  return typeof something === "string";
}

function isOpening(str, idx = 0) {
  console.log(
    `1520 ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`1522 idx = ${idx}`);

  // r1. tag without attributes
  // for example <br>, <br/>
  const r1 = /^<\s*\w+\s*\/?\s*>/g;

  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;

  // r3. closing/self-closing tags
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;

  // r4. opening tag with attributes,
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;

  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(`1541 ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(`1546 ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(`1551 ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(`1556 ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`);
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(`1562 return ${`\u001b[${36}m${res}\u001b[${39}m`}`);
  return res;
}

export default isOpening;
