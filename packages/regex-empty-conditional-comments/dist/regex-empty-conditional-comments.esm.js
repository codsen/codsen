var main = (function () {
  return (/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi
  );
});

export default main;
