function escapeXml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
}

function number(value) {
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function packageUrl(name) {
  return `https://codsen.com/os/${encodeURIComponent(name)}`;
}

function svgDocument({ id, title, description, width, height, body }) {
  if (!/^[a-z][a-z0-9-]*$/.test(id) || !(width > 0) || !(height > 0)) {
    throw new Error("statistics charts: invalid SVG document metadata");
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="#203a43" role="img" aria-labelledby="${id}-title ${id}-desc" style="max-width:100%;height:auto">
<title id="${id}-title">${escapeXml(title)}</title>
<desc id="${id}-desc">${escapeXml(description)}</desc>
<style>
text{font-family:Arial,Helvetica,sans-serif}
.title{font-size:28px;font-weight:700;letter-spacing:-.5px}
.subtitle,.muted{fill:#526a73;font-size:13px}
.label{font-size:13px}.small{font-size:12px}.metric{font-size:30px;font-weight:700}
.grid{stroke:#dce5e6;stroke-width:1}.axis{stroke:#91a5aa;stroke-width:1}
a:hover text,a:focus text{fill:#007c78;text-decoration:underline}
a:focus{outline:2px solid #007c78}
</style>
<rect width="${width}" height="${height}" fill="#fbfcfa"/>
${body}
</svg>
`;
}

export { escapeXml, number, packageUrl, svgDocument };
