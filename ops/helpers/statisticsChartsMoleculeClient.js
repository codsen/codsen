// These functions are also embedded verbatim in the standalone HTML artifact.
function projectMolecule(nodes, yaw = 0, pitch = 0, zoom = 1) {
  return nodes.map((node) => {
    const x = node.x * Math.cos(yaw) + node.z * Math.sin(yaw);
    const z = -node.x * Math.sin(yaw) + node.z * Math.cos(yaw);
    const y = node.y * Math.cos(pitch) - z * Math.sin(pitch);
    const depth = node.y * Math.sin(pitch) + z * Math.cos(pitch);
    const scale = (700 / (700 + depth)) * zoom;
    return { x: 640 + x * scale, y: 360 + y * scale, depth, scale };
  });
}

function placeMoleculeLabels(nodes, points) {
  const occupied = [];
  return nodes.map((node, i) => {
    const point = points[i];
    const width = Math.max(node.name.length * 7.4, node.version.length * 6) + 8;
    const side = point.x > 650 ? -1 : 1;
    let best;
    for (const direction of [side, -side]) {
      for (const offset of [-8, -46, 30, -84, 68, -122, 106, -160, 144]) {
        const x = point.x + direction * 17;
        const y = point.y + offset;
        const box = {
          left: direction > 0 ? x : x - width,
          right: direction > 0 ? x + width : x,
          top: y - 15,
          bottom: y + 19,
        };
        let cost = Math.abs(offset + 8) + (direction === side ? 0 : 15);
        if (
          box.left < 16 ||
          box.right > 1264 ||
          box.top < 16 ||
          box.bottom > 704
        )
          cost += 100000;
        for (const other of occupied) {
          if (
            box.left < other.right + 5 &&
            box.right + 5 > other.left &&
            box.top < other.bottom + 4 &&
            box.bottom + 4 > other.top
          )
            cost += 10000;
        }
        for (let j = 0; j < points.length; j += 1) {
          if (
            j !== i &&
            points[j].x > box.left - 12 &&
            points[j].x < box.right + 12 &&
            points[j].y > box.top - 12 &&
            points[j].y < box.bottom + 12
          )
            cost += 1000;
        }
        if (!best || cost < best.cost)
          best = { x, y, anchor: direction > 0 ? "start" : "end", box, cost };
      }
    }
    occupied.push(best.box);
    return best;
  });
}

function startMoleculeExplorer(data, project, placeLabels) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("scene");
  const select = document.getElementById("package");
  const count = document.getElementById("count");
  const list = document.getElementById("package-list");
  const rootLink = document.getElementById("root-link");
  const status = document.getElementById("missing");
  const showAllLabels = document.getElementById("show-all-labels");
  let graph;
  let yaw = 0;
  let pitch = 0;
  let zoom = 1;
  let drag = null;
  let moved = false;
  let edges;
  let nodes;
  let leaders;

  function element(tag, attributes, parent, value) {
    const el = document.createElementNS(ns, tag);
    for (const [key, attribute] of Object.entries(attributes)) {
      el.setAttribute(key, attribute);
    }
    if (value !== undefined) el.textContent = value;
    parent.append(el);
    return el;
  }

  function render() {
    const points = project(graph.nodes, yaw, pitch, zoom);
    const visibleIndices = graph.nodes
      .map((node, i) => ({ node, i }))
      .filter(({ node }) => showAllLabels.checked || node.depth <= 1)
      .map(({ i }) => i);
    const placed = placeLabels(
      visibleIndices.map((i) => graph.nodes[i]),
      visibleIndices.map((i) => points[i]),
    );
    const labels = new Map(visibleIndices.map((i, j) => [i, placed[j]]));
    graph.edges.forEach((edge, i) => {
      const a = points[edge.from];
      const b = points[edge.to];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.hypot(dx, dy) || 1;
      const inset = (edge.to === 0 ? 13 : 8) * b.scale;
      const attrs = {
        x1: a.x,
        y1: a.y,
        x2: b.x - (dx / length) * inset,
        y2: b.y - (dy / length) * inset,
      };
      for (const [key, value] of Object.entries(attrs)) {
        edges[i].setAttribute(key, value);
      }
    });
    points
      .map((point, i) => ({ ...point, i }))
      .sort((a, b) => b.depth - a.depth)
      .forEach((point) => {
        const node = nodes[point.i];
        node.setAttribute("transform", `translate(${point.x} ${point.y})`);
        node
          .querySelector("circle")
          .setAttribute("r", (point.i === 0 ? 12 : 7) * point.scale);
        node.setAttribute("opacity", Math.max(0.5, Math.min(1, point.scale)));
        const label = labels.get(point.i);
        const link = node.querySelector(".label-link");
        link.style.display = label ? "" : "none";
        leaders[point.i].style.display = label ? "" : "none";
        if (label) {
          link.setAttribute(
            "transform",
            `translate(${label.x - point.x} ${label.y - point.y})`,
          );
          link.setAttribute("text-anchor", label.anchor);
          leaders[point.i].setAttribute("x1", point.x);
          leaders[point.i].setAttribute("y1", point.y);
          leaders[point.i].setAttribute("x2", label.x);
          leaders[point.i].setAttribute("y2", label.y + 3);
        }
        node.parentNode.append(node);
      });
  }

  function load(name) {
    graph = data.graphs[name] || data.graphs[data.defaultRoot];
    showAllLabels.checked = graph.nodes.length <= 30;
    select.value = graph.nodes[0].name;
    yaw = 0;
    pitch = 0;
    zoom = 1;
    document.getElementById("links").replaceChildren();
    document.getElementById("leaders").replaceChildren();
    document.getElementById("nodes").replaceChildren();
    edges = graph.edges.map((edge) =>
      element(
        "line",
        {
          stroke: edge.optional ? "#a47839" : "#8eb6b0",
          "stroke-width": 1.4,
          "stroke-dasharray": edge.optional ? "4 4" : "none",
          "marker-end": "url(#arrow)",
        },
        document.getElementById("links"),
      ),
    );
    leaders = graph.nodes.map(() =>
      element(
        "line",
        { stroke: "#c4d5d1", "stroke-width": 0.8 },
        document.getElementById("leaders"),
      ),
    );
    nodes = graph.nodes.map((node, i) => {
      const group = element("g", {}, document.getElementById("nodes"));
      const circleLink = element(
        "a",
        {
          href: node.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": `${node.name}@${node.version}`,
        },
        group,
      );
      element(
        "circle",
        {
          fill: i === 0 ? "#153c38" : node.internal ? "#208b7b" : "#dd9a45",
          stroke: "#fff",
          "stroke-width": 2,
        },
        circleLink,
      );
      const link = element(
        "a",
        {
          href: node.url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "label-link",
        },
        group,
      );
      element(
        "text",
        { x: 0, y: 0, class: i === 0 ? "node-label root" : "node-label" },
        link,
        node.name,
      );
      element(
        "text",
        { x: 0, y: 16, class: "version" },
        link,
        `${node.version}${node.internal ? " · workspace" : ""}`,
      );
      element("title", {}, group, `${node.name}@${node.version}\n${node.id}`);
      return group;
    });
    const external = graph.nodes.filter((node) => !node.internal).length;
    count.textContent = `${graph.nodes.length} packages · ${graph.edges.length} dependency links · ${external} external`;
    rootLink.textContent = `${graph.nodes[0].name} ↗`;
    rootLink.href = graph.nodes[0].url;
    status.textContent = graph.unresolved.length
      ? `${graph.unresolved.length} unresolved dependencies: ${graph.unresolved.map((item) => `${item.from} → ${item.name}@${item.range}${item.optional ? " (optional)" : ""}`).join("; ")}`
      : "All declared production and optional dependencies resolved.";
    list.replaceChildren();
    for (const node of graph.nodes) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = node.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = `${node.name}@${node.version}`;
      li.append(a);
      const dependencies = graph.edges.filter(
        (edge) => graph.nodes[edge.from] === node,
      );
      const description = document.createElement("span");
      description.textContent = dependencies.length
        ? ` → ${dependencies.map((edge) => `${graph.nodes[edge.to].name}@${graph.nodes[edge.to].version}${edge.optional ? " (optional)" : ""}`).join(", ")}`
        : " — no resolved production dependencies";
      li.append(description);
      list.append(li);
    }
    render();
  }

  for (const name of Object.keys(data.graphs)) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.append(option);
  }
  select.addEventListener("change", () => {
    window.location.hash = encodeURIComponent(select.value);
    load(select.value);
  });
  showAllLabels.addEventListener("change", render);
  window.addEventListener("hashchange", () => {
    try {
      load(decodeURIComponent(window.location.hash.slice(1)));
    } catch {
      load(data.defaultRoot);
    }
  });
  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY };
    moved = false;
  });
  window.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    yaw += dx * 0.009;
    pitch = Math.max(-1.5, Math.min(1.5, pitch + dy * 0.009));
    drag = { x: event.clientX, y: event.clientY };
    render();
  });
  window.addEventListener("pointerup", () => {
    drag = null;
  });
  window.addEventListener("pointercancel", () => {
    drag = null;
  });
  svg.addEventListener("click", (event) => {
    if (moved) event.preventDefault();
  });
  function changeZoom(factor) {
    zoom = Math.max(0.4, Math.min(3, zoom * factor));
    render();
  }
  document
    .getElementById("zoom-in")
    .addEventListener("click", () => changeZoom(1.15));
  document
    .getElementById("zoom-out")
    .addEventListener("click", () => changeZoom(1 / 1.15));
  document
    .getElementById("reset")
    .addEventListener("click", () => load(select.value));
  svg.addEventListener("keydown", (event) => {
    const keys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "+",
      "=",
      "-",
      "0",
    ];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") yaw -= 0.15;
    if (event.key === "ArrowRight") yaw += 0.15;
    if (event.key === "ArrowUp") pitch -= 0.15;
    if (event.key === "ArrowDown") pitch += 0.15;
    if (event.key === "+" || event.key === "=") changeZoom(1.15);
    if (event.key === "-") changeZoom(1 / 1.15);
    if (event.key === "0") load(select.value);
    render();
  });
  let selected = data.defaultRoot;
  try {
    selected = decodeURIComponent(window.location.hash.slice(1)) || selected;
  } catch {
    /* A malformed hash leaves the default selection intact. */
  }
  load(selected);
}

export { placeMoleculeLabels, projectMolecule, startMoleculeExplorer };
