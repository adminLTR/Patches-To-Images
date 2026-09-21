const DEMO = {
  size: 96,
  patch: 32,
  crop: 28,
  modelUrl: "model/model.json",
  tfScript: "assets/vendor/tf.min.js",
};

const demoState = {
  image: null,
  original: null,
  patches: null,
  model: null,
  modelReady: false,
  modelError: "",
  tfReady: false,
  isRunning: false,
  statusState: "",
  statusKey: "",
  statusVars: null,
  lastMae: null,
};

function demoT(key, vars) {
  return typeof window.ptiT === "function" ? window.ptiT(key, vars) : key;
}

function refreshDemoUi() {
  const sample = document.getElementById("demo-sample");
  const shuffle = document.getElementById("demo-shuffle");
  const run = document.getElementById("demo-run");
  if (sample) sample.textContent = demoT("demo.sample");
  if (shuffle) shuffle.textContent = demoT("demo.shuffle");
  if (run && !demoState.isRunning) run.textContent = demoT("demo.run");
  const maeBox = document.getElementById("demo-mae");
  if (maeBox && !maeBox.hidden && demoState.lastMae != null) {
    maeBox.textContent = demoT("demo.mae", { mae: demoState.lastMae });
  }
  if (demoState.statusKey) {
    setDemoStatus(demoState.statusState, demoT(demoState.statusKey, demoState.statusVars));
  }
}

document.addEventListener("pti:language", refreshDemoUi);

function setDemoStatus(state, html) {
  const box = document.getElementById("demo-status");
  const text = document.getElementById("demo-status-text");
  if (!box || !text) return;
  box.dataset.state = state;
  text.innerHTML = html;
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-demo-src="${src}"]`);
    if (existing) {
      if (window.tf) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.demoSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(demoT("demo.err.tf")));
    document.head.appendChild(script);
  });
}

function shuffleOrder() {
  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function imageDataToRgb(imageData) {
  const { data, width, height } = imageData;
  const out = new Float32Array(width * height * 3);
  for (let i = 0, p = 0; i < data.length; i += 4, p += 3) {
    out[p] = data[i] / 255;
    out[p + 1] = data[i + 1] / 255;
    out[p + 2] = data[i + 2] / 255;
  }
  return out;
}

function drawRgb(canvas, rgb, width, height) {
  const ctx = canvas.getContext("2d");
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, p = 0; i < rgb.length; i += 3, p += 4) {
    pixels[p] = Math.max(0, Math.min(255, Math.round(rgb[i] * 255)));
    pixels[p + 1] = Math.max(0, Math.min(255, Math.round(rgb[i + 1] * 255)));
    pixels[p + 2] = Math.max(0, Math.min(255, Math.round(rgb[i + 2] * 255)));
    pixels[p + 3] = 255;
  }
  ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
}

function cropToSquare96(image) {
  const canvas = document.createElement("canvas");
  canvas.width = DEMO.size;
  canvas.height = DEMO.size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - side) / 2;
  const sy = (image.naturalHeight - side) / 2;
  ctx.drawImage(image, sx, sy, side, side, 0, 0, DEMO.size, DEMO.size);
  return imageDataToRgb(ctx.getImageData(0, 0, DEMO.size, DEMO.size));
}

function extractPatches(fullRgb) {
  const patches = [];
  const margin = (DEMO.patch - DEMO.crop) / 2;
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const patch = new Float32Array(DEMO.crop * DEMO.crop * 3);
      let i = 0;
      for (let y = 0; y < DEMO.crop; y += 1) {
        for (let x = 0; x < DEMO.crop; x += 1) {
          const srcX = col * DEMO.patch + margin + x;
          const srcY = row * DEMO.patch + margin + y;
          const src = (srcY * DEMO.size + srcX) * 3;
          patch[i] = fullRgb[src];
          patch[i + 1] = fullRgb[src + 1];
          patch[i + 2] = fullRgb[src + 2];
          i += 3;
        }
      }
      patches.push(patch);
    }
  }
  return patches;
}

function scramblePatches(patches, order) {
  return order.map((originalPos) => patches[originalPos]);
}

function drawPuzzle(canvas, patches) {
  const white = new Float32Array(DEMO.size * DEMO.size * 3).fill(1);
  const margin = (DEMO.patch - DEMO.crop) / 2;
  patches.forEach((patch, slot) => {
    const row = Math.floor(slot / 3);
    const col = slot % 3;
    let i = 0;
    for (let y = 0; y < DEMO.crop; y += 1) {
      for (let x = 0; x < DEMO.crop; x += 1) {
        const destX = col * DEMO.patch + margin + x;
        const destY = row * DEMO.patch + margin + y;
        const dest = (destY * DEMO.size + destX) * 3;
        white[dest] = patch[i];
        white[dest + 1] = patch[i + 1];
        white[dest + 2] = patch[i + 2];
        i += 3;
      }
    }
  });
  drawRgb(canvas, white, DEMO.size, DEMO.size);
}

function meanAbsoluteError(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setButtons({ shuffle, run }) {
  const shuffleBtn = document.getElementById("demo-shuffle");
  const runBtn = document.getElementById("demo-run");
  if (shuffleBtn) shuffleBtn.disabled = !shuffle;
  if (runBtn) runBtn.disabled = !run;
}

function renderCurrentPatches() {
  const originalCanvas = document.getElementById("demo-original");
  const patchCanvas = document.getElementById("demo-patches");
  const outputCanvas = document.getElementById("demo-output");
  if (!demoState.original || !demoState.patches) return;
  drawRgb(originalCanvas, demoState.original, DEMO.size, DEMO.size);
  drawPuzzle(patchCanvas, demoState.patches);
  clearCanvas(outputCanvas);
  document.getElementById("demo-mae").hidden = true;
}

function applyImage(image) {
  demoState.image = image;
  demoState.original = cropToSquare96(image);
  const ordered = extractPatches(demoState.original);
  demoState.patches = scramblePatches(ordered, shuffleOrder());
  renderCurrentPatches();
  setButtons({ shuffle: true, run: demoState.modelReady });
}

function loadImageSrc(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(demoT("demo.err.image")));
    image.src = src;
  });
}

function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    loadImageSrc(url)
      .then((image) => {
        URL.revokeObjectURL(url);
        resolve(image);
      })
      .catch((error) => {
        URL.revokeObjectURL(url);
        reject(error);
      });
  });
}

async function probeModel() {
  try {
    const response = await fetch(DEMO.modelUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("missing");
    const json = await response.json();
    if (!json.modelTopology && !json.format && !json.weightsManifest) throw new Error("invalid");
    demoState.modelReady = true;
    demoState.statusState = "ready";
    demoState.statusKey = "demo.status.ready";
    demoState.statusVars = null;
    setDemoStatus("ready", demoT("demo.status.ready"));
  } catch (error) {
    demoState.modelReady = false;
    demoState.modelError = error.message;
    demoState.statusState = "missing";
    demoState.statusKey = "demo.status.missing";
    demoState.statusVars = null;
    setDemoStatus("missing", demoT("demo.status.missing"));
  }
  setButtons({ shuffle: Boolean(demoState.original), run: demoState.modelReady && Boolean(demoState.original) });
}

function pickOutputTensor(result) {
  const tf = window.tf;
  if (result instanceof tf.Tensor) return result;
  if (Array.isArray(result)) {
    const tensor = result.find((item) => item instanceof tf.Tensor);
    if (tensor) return tensor;
  }
  if (result && typeof result === "object") {
    const tensor = Object.values(result).find((item) => item instanceof tf.Tensor);
    if (tensor) return tensor;
  }
  throw new Error(demoT("demo.err.tensor"));
}

function disposeExecutionResult(result, keep) {
  const tf = window.tf;
  const dispose = (tensor) => {
    if (tensor && tensor !== keep && tensor instanceof tf.Tensor) tensor.dispose();
  };
  if (result instanceof tf.Tensor) {
    dispose(result);
    return;
  }
  if (Array.isArray(result)) {
    result.forEach(dispose);
    return;
  }
  if (result && typeof result === "object") {
    Object.values(result).forEach(dispose);
  }
}

async function ensureTf() {
  if (!window.tf) await loadScriptOnce(DEMO.tfScript);
  if (!window.tf) throw new Error(demoT("demo.err.tf"));
  if (!demoState.tfReady) {
    await window.tf.setBackend("cpu");
    await window.tf.ready();
    demoState.tfReady = true;
  }
}

async function ensureModel() {
  await ensureTf();
  if (demoState.model) return demoState.model;
  demoState.model = await window.tf.loadGraphModel(DEMO.modelUrl);
  return demoState.model;
}

function tensorFromPatches(patches) {
  const data = new Float32Array(9 * DEMO.crop * DEMO.crop * 3);
  patches.forEach((patch, index) => {
    data.set(patch, index * DEMO.crop * DEMO.crop * 3);
  });
  return window.tf.tensor(data, [1, 9, DEMO.crop, DEMO.crop, 3]);
}

async function runModelOnce(model, input) {
  const tf = window.tf;
  let result = model.execute(input);
  if (result && typeof result.then === "function") result = await result;

  const output = pickOutputTensor(result);
  const batch = output.shape[0] === 1;
  const image = batch ? output.squeeze([0]) : output;
  const clipped = tf.clipByValue(image, 0, 1);
  const rgb = await clipped.data();

  if (image !== output) image.dispose();
  clipped.dispose();
  disposeExecutionResult(result, null);
  if (result !== output) output.dispose();

  return Float32Array.from(rgb);
}

async function runModel() {
  if (!demoState.patches || !demoState.modelReady) return;
  const runBtn = document.getElementById("demo-run");
  const maeBox = document.getElementById("demo-mae");
  runBtn.disabled = true;
  demoState.isRunning = true;
  runBtn.textContent = demoT("demo.rebuilding");
  try {
    const model = await ensureModel();
    const input = tensorFromPatches(demoState.patches);
    let rgb = await runModelOnce(model, input);
    input.dispose();

    let max = 0;
    for (let i = 0; i < rgb.length; i += 1) max = Math.max(max, rgb[i]);

    if (max < 1e-4) {
      throw new Error(demoT("demo.err.zero"));
    }

    drawRgb(document.getElementById("demo-output"), rgb, DEMO.size, DEMO.size);
    const mae = meanAbsoluteError(demoState.original, rgb);
    demoState.lastMae = mae.toFixed(5);
    maeBox.hidden = false;
    maeBox.textContent = demoT("demo.mae", { mae: demoState.lastMae });
  } catch (error) {
    demoState.statusState = "error";
    demoState.statusKey = "demo.status.inference";
    demoState.statusVars = { msg: error.message };
    setDemoStatus("error", demoT("demo.status.inference", { msg: error.message }));
  } finally {
    demoState.isRunning = false;
    runBtn.textContent = demoT("demo.run");
    setButtons({ shuffle: true, run: demoState.modelReady });
  }
}

function initDemoUi() {
  const dropzone = document.getElementById("demo-dropzone");
  const fileInput = document.getElementById("demo-file");
  const sampleBtn = document.getElementById("demo-sample");
  const shuffleBtn = document.getElementById("demo-shuffle");
  const runBtn = document.getElementById("demo-run");
  if (!dropzone || dropzone.dataset.bound === "1") return;
  dropzone.dataset.bound = "1";

  const onFiles = async (files) => {
    const file = files && files[0];
    if (!file) return;
    try {
      applyImage(await readFileAsImage(file));
    } catch (error) {
      setDemoStatus("error", error.message);
    }
  };

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("is-hot");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-hot"));
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-hot");
    onFiles(event.dataTransfer.files);
  });
  fileInput.addEventListener("change", (event) => onFiles(event.target.files));
  sampleBtn.addEventListener("click", async () => {
    try {
      applyImage(await loadImageSrc("notebook-assets/cell_13_out_1.png"));
    } catch (error) {
      setDemoStatus("error", error.message);
    }
  });

  shuffleBtn.addEventListener("click", () => {
    if (!demoState.original) return;
    demoState.patches = scramblePatches(extractPatches(demoState.original), shuffleOrder());
    renderCurrentPatches();
  });
  runBtn.addEventListener("click", () => {
    runModel();
  });
}

window.prepareDemo = async function prepareDemo() {
  initDemoUi();
  if (!demoState.probed) {
    demoState.probed = true;
    await probeModel();
    if (new URLSearchParams(location.search).has("sample")) {
      try {
        applyImage(await loadImageSrc("notebook-assets/cell_13_out_1.png"));
      } catch (error) {
        setDemoStatus("error", error.message);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initDemoUi();
  refreshDemoUi();
});
