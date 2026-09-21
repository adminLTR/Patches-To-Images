const TAB_IDS = ["problema", "dataset", "arquitectura", "modelo", "demo", "colab", "metricas"];

function markdownToHtml(src) {
  const escaped = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lines = escaped.split("\n");
  const out = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push(inList === "ol" ? "</ol>" : "</ul>");
      inList = false;
    }
  };

  const inline = (text) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (const line of lines) {
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      if (!inList) {
        out.push(/^\s*\d+\.\s+/.test(line) ? "<ol>" : "<ul>");
        inList = /^\s*\d+\.\s+/.test(line) ? "ol" : "ul";
      }
      out.push(`<li>${inline(line.replace(/^\s*(?:[-*]|\d+\.)\s+/, ""))}</li>`);
      continue;
    }
    flushList();
    if (/^###\s+/.test(line)) out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`);
    else if (/^##\s+/.test(line)) out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`);
    else if (/^#\s+/.test(line)) out.push(`<h1>${inline(line.replace(/^#\s+/, ""))}</h1>`);
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  return out.join("\n");
}

function renderNotebook() {
  const root = document.getElementById("notebook-root");
  if (!root || !window.NOTEBOOK_CELLS) return;

  const frag = document.createDocumentFragment();
  let codeIndex = 0;

  window.NOTEBOOK_CELLS.forEach((cell) => {
    const wrap = document.createElement("article");
    wrap.className = `nb-cell ${cell.type}`;

    const gutter = document.createElement("div");
    gutter.className = "nb-gutter";

    if (cell.type === "markdown") {
      gutter.textContent = " ";
      const md = document.createElement("div");
      md.className = "nb-md";
      md.innerHTML = markdownToHtml(cell.source || "");
      wrap.append(gutter, md);
    } else {
      codeIndex += 1;
      const hasOut = (cell.outputs || []).length > 0;
      gutter.textContent = hasOut ? `In [${codeIndex}]:` : `In [ ]:`;

      const codeBox = document.createElement("div");
      codeBox.className = "nb-code";
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = "language-python";
      code.textContent = cell.source || "";
      pre.appendChild(code);
      codeBox.appendChild(pre);
      wrap.append(gutter, codeBox);

      (cell.outputs || []).forEach((output) => {
        const out = document.createElement("div");
        out.className = "nb-out";
        if (output.text) {
          const stream = document.createElement("pre");
          stream.className = "nb-stream";
          stream.textContent = output.text;
          out.appendChild(stream);
        }
        if (output.image) {
          const img = document.createElement("img");
          img.className = "nb-img";
          img.src = output.image;
          img.alt = "Salida gráfica de la celda del notebook";
          out.appendChild(img);
        }
        wrap.appendChild(out);
      });
    }

    frag.appendChild(wrap);
  });

  root.replaceChildren(frag);
  if (window.hljs) {
    root.querySelectorAll("pre code").forEach((block) => window.hljs.highlightElement(block));
  }
}

function showTab(id, { updateHash = true } = {}) {
  if (!TAB_IDS.includes(id)) id = "problema";

  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.tab === id;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll(".panel").forEach((panel) => {
    const active = panel.id === id;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  if (updateHash) {
    history.replaceState(null, "", `#${id}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "dataset") animateCounters();
  if (id === "demo" && typeof window.prepareDemo === "function") window.prepareDemo();
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (el.dataset.done === "1") return;
    const target = Number(el.dataset.count);
    const format = (value) => Math.round(value).toLocaleString("es-ES");
    const finish = () => {
      el.textContent = format(target);
      el.dataset.done = "1";
    };
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else finish();
    };
    requestAnimationFrame(tick);
    window.setTimeout(finish, duration + 80);
  });
}

function initTabs() {
  document.querySelectorAll("[data-tab]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      showTab(el.dataset.tab);
    });
  });
  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => showTab(el.dataset.goto));
  });

  const fromHash = location.hash.replace("#", "");
  showTab(fromHash || "problema", { updateHash: Boolean(fromHash) });
  window.addEventListener("hashchange", () => {
    showTab(location.hash.replace("#", "") || "problema", { updateHash: false });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNotebook();
  initTabs();
  if (window.hljs) {
    document.querySelectorAll(".snippet code").forEach((block) => window.hljs.highlightElement(block));
  }
});
