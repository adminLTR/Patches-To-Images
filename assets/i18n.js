(function () {
  const STORAGE_KEY = "pti-lang";
  const LOCALES = ["es", "en", "pt", "it"];

  const M = {
    es: {
      "meta.title": "Patches to Images — Reconstrucción de rompecabezas visual",
      "meta.description":
        "Proyecto de reconstrucción de imágenes 96×96 a partir de 9 parches desordenados de 28×28 sobre STL-10, con red neuronal en Keras.",
      "nav.aria": "Secciones del proyecto",
      "lang.aria": "Idioma de la página",
      "lang.label": "Idioma",
      "brand.sub": "Reconstrucción neuronal tipo jigsaw",
      "tab.problema": "Problema",
      "tab.dataset": "Dataset",
      "tab.arquitectura": "Arquitectura",
      "tab.modelo": "Modelo",
      "tab.demo": "Demo",
      "tab.colab": "Colab",
      "tab.metricas": "Métricas",
      "hero.eyebrow": "Proyecto de visión por computador",
      "hero.title": "Reconstruir una imagen completa a partir de nueve piezas desordenadas.",
      "hero.lead":
        "El modelo recibe 9 parches RGB de <strong>28×28</strong>, descolocados y con los bordes erosionados, y debe devolver la imagen original de <strong>96×96</strong> sin atajos geométricos ni algoritmos clásicos.",
      "hero.btnDemo": "Probar la demo",
      "hero.btnColab": "Ver el Colab ejecutado",
      "hero.statInput": "Entrada",
      "hero.statOutput": "Salida",
      "hero.statMetric": "Métrica",
      "hero.stageScrambled": "Piezas desordenadas",
      "hero.stageArrow": "red neuronal",
      "hero.stageReconstructed": "Imagen reconstruida",
      "hero.altReconstructed": "Imagen objetivo de un perro reconstruida a 96×96",
      "problema.contextTitle": "Contextualización del problema",
      "problema.contextIntro":
        "No basta con pegar las piezas. El rompecabezas es ambiguo: falta información de borde y el orden espacial es desconocido. La red tiene que inferir la disposición correcta y rellenar el contenido visual que se eliminó al recortar cada parche.",
      "problema.c1.title": "Orden desconocido",
      "problema.c1.text":
        "Las 9 piezas vienen de una grilla 3×3, pero llegan permutadas. El modelo debe descubrir qué pieza corresponde a cada posición.",
      "problema.c2.title": "Bordes erosionados",
      "problema.c2.text":
        "Cada celda original es 32×32, pero se recorta al centro 28×28. Se pierde el marco que permitiría encajar piezas por continuidad de borde.",
      "problema.c3.title": "Reconstrucción coherente",
      "problema.c3.text":
        "Además de ordenar, hay que inpainting: completar huecos y producir una imagen 96×96 continua, sin artefactos de ensamblaje.",
      "problema.constraintsTitle": "Restricciones del enunciado",
      "problema.r1": "Solo redes neuronales. No se permiten componentes algorítmicos no neuronales.",
      "problema.r2": "Prohibido usar modelos preentrenados.",
      "problema.r3": "Menos de 6 millones de parámetros entrenables.",
      "problema.r4": "Implementación en Keras, ejecutable en Google Colab.",
      "problema.r5":
        "La calidad se mide con <strong>Mean Absolute Error (MAE)</strong> sobre el conjunto de test, reportando también la desviación estándar.",
      "dataset.eyebrow": "Datos",
      "dataset.title": "Sobre el dataset STL-10",
      "dataset.intro":
        "Se usa el conjunto no etiquetado de <strong>Stanford STL-10</strong>: 100.000 imágenes a color de resolución nativa 96×96, con 10 clases visuales. Es un recorte natural para este problema porque la salida del modelo coincide exactamente con el tamaño de cada imagen.",
      "dataset.statImages": "imágenes sin etiqueta",
      "dataset.statRes": "resolución RGB",
      "dataset.statClasses": "clases visuales",
      "dataset.statSplit": "train / val / test",
      "dataset.splitTitle": "Partición usada",
      "dataset.split1": "<strong>80.000</strong> imágenes de entrenamiento",
      "dataset.split2": "<strong>10.000</strong> de validación",
      "dataset.split3": "<strong>10.000</strong> de test",
      "dataset.splitNote":
        "El generador recorta 9 parches 32×32, recorta el centro a 28×28 y aplica una permutación aleatoria. La etiqueta es la imagen completa normalizada en [0, 1].",
      "dataset.classesTitle": "Clases de STL-10",
      "dataset.fig1.alt": "Ejemplo del conjunto de test: vaca en escala de grises",
      "dataset.fig1.cap": "Muestra del set de test (imagen completa 96×96).",
      "dataset.fig2.alt": "Nueve parches desordenados de un perro",
      "dataset.fig2.cap": "El mismo tipo de muestra convertida en rompecabezas: 9 parches 28×28 con huecos.",
      "dataset.fig3.alt": "Imagen objetivo del perro",
      "dataset.fig3.cap": "Objetivo: reconstruir la escena original a partir de esas piezas.",
      "arch.eyebrow": "Diseño",
      "arch.title": "Arquitectura de la solución",
      "arch.intro":
        "El modelo <em>Jigsaw_Model</em> es un pipeline 100% neuronal: entiende cada parche, infiere una permutación válida, arma un lienzo 96×96 y completa los huecos con una U-Net residual.",
      "arch.s1.title": "Entrada de parches",
      "arch.s1.text": "Tensor <code>(B, 9, 28, 28, 3)</code>. Nueve piezas RGB desordenadas por batch.",
      "arch.s2.title": "Encoder robusto",
      "arch.s2.text":
        "CNN <code>TimeDistributed</code> con convoluciones 64→128→256. Extrae un vector de 256 dimensiones por parche, sin mirar aún el contexto global.",
      "arch.s3.title": "Transformer",
      "arch.s3.text":
        "Embeddings posicionales + 2 bloques de atención multi-cabeza (8 cabezas). Modela relaciones entre piezas para decidir el orden relativo.",
      "arch.s4.title": "Router Sinkhorn",
      "arch.s4.text":
        "Capa personalizada que convierte logits 9×9 en una matriz doblemente estocástica. Fuerza una asignación 1 a 1, no un simple softmax independiente.",
      "arch.s5.title": "Reordenamiento físico",
      "arch.s5.text":
        "La matriz de permutación reordena los parches originales, no solo sus embeddings. Se conserva la textura real de cada pieza.",
      "arch.s6.title": "Ensamblaje del lienzo",
      "arch.s6.text":
        "Cada pieza se rellena a 32×32 y se coloca en una grilla 3×3. El canvas 96×96 queda con grietas: el material que se erosionó al generar el dataset.",
      "arch.s7.title": "U-Net de inpainting",
      "arch.s7.text":
        "Una U-Net profunda predice un residual sobre el canvas. La suma pasa por sigmoid para devolver píxeles en [0, 1] y una imagen continua.",
      "arch.trainTitle": "Entrenamiento",
      "arch.train1": "Optimizador <strong>AdamW</strong> (lr 3e-4, weight decay 1e-4)",
      "arch.train2": "Pérdida y métrica: <strong>MAE</strong>",
      "arch.train3": "Hasta 200 épocas, batch size 8",
      "arch.train4": "Callbacks: backup en Drive, checkpoint del mejor val_loss y ReduceLROnPlateau",
      "arch.whyTitle": "Por qué Sinkhorn + U-Net",
      "arch.whyText":
        "El Transformer propone un orden; Sinkhorn lo vuelve una permutación válida. La U-Net no tiene que “inventar” el layout: solo rellena juntas y refina la textura. Esa separación mantiene el modelo por debajo de 6M de parámetros.",
      "model.eyebrow": "Pesos entrenados",
      "model.title": "Enlace al modelo",
      "model.intro":
        "Los pesos se publican como un archivo <code>.keras</code> descargable con <code>gdown</code>, tal como exige el enunciado. En el Colab se cargan con <code>load_model(..., safe_mode=False)</code> para registrar la capa personalizada <code>SinkhornRouting</code>.",
      "model.bannerTitle": "Modelo entrenado listo para cargar",
      "model.bannerText": "Archivo de 60.2 MB. En el notebook se descargó correctamente y se cargó sin errores.",
      "model.btnDrive": "Abrir en Google Drive",
      "model.btnGdown": "Descarga directa (gdown)",
      "model.btnDemo": "Usar en la demo",
      "model.statTotal": "Parámetros totales",
      "model.statTrain": "Entrenables",
      "model.statLimit": "Límite",
      "demo.eyebrow": "Prueba interactiva",
      "demo.title": "Demo",
      "demo.intro":
        "Sube una foto. La página la recorta a <strong>96×96</strong>, genera 9 parches <strong>28×28</strong> desordenados y reconstruye la imagen.",
      "demo.dropzone": "Suelta una imagen o haz clic para elegirla",
      "demo.sample": "Cargar ejemplo",
      "demo.shuffle": "Nueva mezcla",
      "demo.run": "Reconstruir",
      "demo.rebuilding": "Reconstruyendo…",
      "demo.fig1": "1. Imagen 96×96",
      "demo.fig2": "2. Parches aleatorios",
      "demo.fig3": "3. Reconstrucción",
      "demo.mae": "MAE frente a la imagen recortada: {{mae}}",
      "demo.status.ready":
        "Modelo TF.js encontrado. Sube una imagen y pulsa <strong>Reconstruir</strong>.",
      "demo.status.missing":
        "Falta el modelo web. Coloca el <code>.keras</code> en <code>site/model/</code> y ejecuta <code>python scripts/convert_model.py site/model/best_jigsaw_model.keras</code>. Mientras tanto ya puedes ver los parches aleatorios.",
      "demo.status.inference":
        "El modelo está presente, pero la inferencia falló: <code>{{msg}}</code>. Vuelve a convertir el <code>.keras</code> con el script.",
      "demo.err.tf": "No se pudo cargar TensorFlow.js. Recarga la página.",
      "demo.err.image": "No se pudo leer la imagen",
      "demo.err.zero": "La salida del modelo es toda cero. Prueba recargar o reconvertir el .keras.",
      "demo.err.tensor": "El modelo no devolvió un tensor válido",
      "colab.eyebrow": "Solución completa",
      "colab.title": "Colab de la solución",
      "colab.intro":
        "Abajo ves las salidas reales del notebook del repositorio. Descárgalo para abrirlo en Google Colab o ejecutarlo en local con el mismo entorno que en el proyecto.",
      "colab.download": "Descargar notebook (.ipynb)",
      "colab.meta": "Python 3 · GPU A100 · 31 celdas",
      "metrics.eyebrow": "Resultados",
      "metrics.title": "Métricas obtenidas",
      "metrics.intro":
        "La métrica oficial es MAE sobre el test set, con su desviación estándar. El baseline ingenuo —repetir el parche medio y reescalar— sirve de referencia.",
      "metrics.baseline": "Baseline · parche medio",
      "metrics.delta": "menor error",
      "metrics.model": "Jigsaw_Model · test",
      "metrics.v1.title": "Validación",
      "metrics.v1.text":
        "El mejor <code>val_loss</code> guardado por checkpoint fue <strong>0.04751</strong>. En las últimas épocas el MAE de entrenamiento se estabilizó cerca de 0.0438.",
      "metrics.v2.title": "Capacidad",
      "metrics.v2.text":
        "<strong>4.97M</strong> parámetros totales, <strong>4.97M</strong> entrenables. Queda ~1M por debajo del tope de 6 millones.",
      "metrics.v3.title": "Calidad visual",
      "metrics.v3.text":
        "En las muestras de test, el modelo recoloca las piezas y rellena juntas. El error residual se concentra en texturas finas, no en el layout.",
      "metrics.fig.alt": "Comparación de parches, predicción y objetivo para tres muestras de test",
      "metrics.fig.cap":
        "Ejecución real del notebook: parches de entrada, predicción del modelo y objetivo, para tres muestras del test set.",
      "footer.text": "Patches to Images · reconstrucción neuronal de rompecabezas sobre STL-10 · Keras / TensorFlow",
    },
    en: {
      "meta.title": "Patches to Images — Visual jigsaw reconstruction",
      "meta.description":
        "Project to reconstruct 96×96 images from nine shuffled 28×28 patches on STL-10, using a Keras neural network.",
      "nav.aria": "Project sections",
      "lang.aria": "Page language",
      "lang.label": "Language",
      "brand.sub": "Neural jigsaw reconstruction",
      "tab.problema": "Problem",
      "tab.dataset": "Dataset",
      "tab.arquitectura": "Architecture",
      "tab.modelo": "Model",
      "tab.demo": "Demo",
      "tab.colab": "Colab",
      "tab.metricas": "Metrics",
      "hero.eyebrow": "Computer vision project",
      "hero.title": "Reconstruct a full image from nine shuffled pieces.",
      "hero.lead":
        "The model receives 9 RGB patches of <strong>28×28</strong>, misaligned with eroded borders, and must return the original <strong>96×96</strong> image without geometric shortcuts or classical algorithms.",
      "hero.btnDemo": "Try the demo",
      "hero.btnColab": "View executed Colab",
      "hero.statInput": "Input",
      "hero.statOutput": "Output",
      "hero.statMetric": "Metric",
      "hero.stageScrambled": "Shuffled pieces",
      "hero.stageArrow": "neural network",
      "hero.stageReconstructed": "Reconstructed image",
      "hero.altReconstructed": "Target dog image reconstructed at 96×96",
      "problema.contextTitle": "Problem context",
      "problema.contextIntro":
        "Snapping pieces together is not enough. The puzzle is ambiguous: border information is missing and spatial order is unknown. The network must infer the correct layout and fill in visual content removed when each patch was cropped.",
      "problema.c1.title": "Unknown order",
      "problema.c1.text":
        "The 9 pieces come from a 3×3 grid but arrive permuted. The model must discover which piece belongs in each position.",
      "problema.c2.title": "Eroded borders",
      "problema.c2.text":
        "Each original cell is 32×32 but is center-cropped to 28×28. The frame that would allow edge continuity matching is lost.",
      "problema.c3.title": "Coherent reconstruction",
      "problema.c3.text":
        "Besides ordering, inpainting is required: fill gaps and produce a continuous 96×96 image without assembly artifacts.",
      "problema.constraintsTitle": "Assignment constraints",
      "problema.r1": "Neural networks only. Non-neural algorithmic components are not allowed.",
      "problema.r2": "Pretrained models are forbidden.",
      "problema.r3": "Fewer than 6 million trainable parameters.",
      "problema.r4": "Keras implementation runnable on Google Colab.",
      "problema.r5":
        "Quality is measured with <strong>Mean Absolute Error (MAE)</strong> on the test set, also reporting standard deviation.",
      "dataset.eyebrow": "Data",
      "dataset.title": "About the STL-10 dataset",
      "dataset.intro":
        "We use the unlabeled split of <strong>Stanford STL-10</strong>: 100,000 color images at native 96×96 resolution with 10 visual classes. It fits naturally because the model output matches each image size exactly.",
      "dataset.statImages": "unlabeled images",
      "dataset.statRes": "RGB resolution",
      "dataset.statClasses": "visual classes",
      "dataset.statSplit": "train / val / test",
      "dataset.splitTitle": "Split used",
      "dataset.split1": "<strong>80,000</strong> training images",
      "dataset.split2": "<strong>10,000</strong> validation",
      "dataset.split3": "<strong>10,000</strong> test",
      "dataset.splitNote":
        "The generator crops nine 32×32 patches, center-crops to 28×28, and applies a random permutation. The label is the full image normalized to [0, 1].",
      "dataset.classesTitle": "STL-10 classes",
      "dataset.fig1.alt": "Test set example: grayscale cow",
      "dataset.fig1.cap": "Test set sample (full 96×96 image).",
      "dataset.fig2.alt": "Nine shuffled dog patches",
      "dataset.fig2.cap": "Same kind of sample as a puzzle: nine 28×28 patches with gaps.",
      "dataset.fig3.alt": "Target dog image",
      "dataset.fig3.cap": "Goal: reconstruct the original scene from those pieces.",
      "arch.eyebrow": "Design",
      "arch.title": "Solution architecture",
      "arch.intro":
        "The <em>Jigsaw_Model</em> is a fully neural pipeline: understand each patch, infer a valid permutation, assemble a 96×96 canvas, and fill gaps with a residual U-Net.",
      "arch.s1.title": "Patch input",
      "arch.s1.text": "Tensor <code>(B, 9, 28, 28, 3)</code>. Nine shuffled RGB pieces per batch.",
      "arch.s2.title": "Robust encoder",
      "arch.s2.text":
        "<code>TimeDistributed</code> CNN with 64→128→256 convolutions. Extracts a 256-D vector per patch without global context yet.",
      "arch.s3.title": "Transformer",
      "arch.s3.text":
        "Positional embeddings + 2 multi-head attention blocks (8 heads). Models relations between pieces to decide relative order.",
      "arch.s4.title": "Sinkhorn router",
      "arch.s4.text":
        "Custom layer turning 9×9 logits into a doubly stochastic matrix. Enforces one-to-one assignment, not independent softmax.",
      "arch.s5.title": "Physical reordering",
      "arch.s5.text":
        "The permutation matrix reorders original patches, not just embeddings. Real texture from each piece is preserved.",
      "arch.s6.title": "Canvas assembly",
      "arch.s6.text":
        "Each piece is padded to 32×32 and placed on a 3×3 grid. The 96×96 canvas has cracks from dataset erosion.",
      "arch.s7.title": "Inpainting U-Net",
      "arch.s7.text":
        "A deep U-Net predicts a residual on the canvas. Sum + sigmoid returns pixels in [0, 1] and a continuous image.",
      "arch.trainTitle": "Training",
      "arch.train1": "<strong>AdamW</strong> optimizer (lr 3e-4, weight decay 1e-4)",
      "arch.train2": "Loss and metric: <strong>MAE</strong>",
      "arch.train3": "Up to 200 epochs, batch size 8",
      "arch.train4": "Callbacks: Drive backup, best val_loss checkpoint, and ReduceLROnPlateau",
      "arch.whyTitle": "Why Sinkhorn + U-Net",
      "arch.whyText":
        "The Transformer proposes an order; Sinkhorn makes it a valid permutation. The U-Net does not invent layout—it fills seams and refines texture. That split keeps the model under 6M parameters.",
      "model.eyebrow": "Trained weights",
      "model.title": "Model link",
      "model.intro":
        "Weights are published as a downloadable <code>.keras</code> file via <code>gdown</code>, as required. In Colab they load with <code>load_model(..., safe_mode=False)</code> to register custom <code>SinkhornRouting</code>.",
      "model.bannerTitle": "Trained model ready to load",
      "model.bannerText": "60.2 MB file. Downloaded and loaded successfully in the notebook.",
      "model.btnDrive": "Open in Google Drive",
      "model.btnGdown": "Direct download (gdown)",
      "model.btnDemo": "Use in demo",
      "model.statTotal": "Total parameters",
      "model.statTrain": "Trainable",
      "model.statLimit": "Limit",
      "demo.eyebrow": "Interactive trial",
      "demo.title": "Demo",
      "demo.intro":
        "Upload a photo. The page crops it to <strong>96×96</strong>, builds nine shuffled <strong>28×28</strong> patches, and reconstructs the image.",
      "demo.dropzone": "Drop an image or click to choose",
      "demo.sample": "Load sample",
      "demo.shuffle": "New shuffle",
      "demo.run": "Reconstruct",
      "demo.rebuilding": "Reconstructing…",
      "demo.fig1": "1. 96×96 image",
      "demo.fig2": "2. Random patches",
      "demo.fig3": "3. Reconstruction",
      "demo.mae": "MAE vs cropped image: {{mae}}",
      "demo.status.ready": "TF.js model found. Upload an image and click <strong>Reconstruct</strong>.",
      "demo.status.missing":
        "Web model missing. Put the <code>.keras</code> in <code>site/model/</code> and run <code>python scripts/convert_model.py site/model/best_jigsaw_model.keras</code>. You can still preview random patches.",
      "demo.status.inference":
        "Model is present but inference failed: <code>{{msg}}</code>. Reconvert the <code>.keras</code> with the script.",
      "demo.err.tf": "Could not load TensorFlow.js. Reload the page.",
      "demo.err.image": "Could not read the image",
      "demo.err.zero": "Model output is all zeros. Try reloading or reconverting the .keras.",
      "demo.err.tensor": "Model did not return a valid tensor",
      "colab.eyebrow": "Full solution",
      "colab.title": "Solution Colab",
      "colab.intro":
        "Below are real outputs from the repository notebook. Download it to open in Google Colab or run locally with the same project setup.",
      "colab.download": "Download notebook (.ipynb)",
      "colab.meta": "Python 3 · A100 GPU · 31 cells",
      "metrics.eyebrow": "Results",
      "metrics.title": "Metrics obtained",
      "metrics.intro":
        "The official metric is MAE on the test set with standard deviation. A naive baseline—repeat the mean patch and rescale—serves as reference.",
      "metrics.baseline": "Baseline · mean patch",
      "metrics.delta": "lower error",
      "metrics.model": "Jigsaw_Model · test",
      "metrics.v1.title": "Validation",
      "metrics.v1.text":
        "Best checkpoint <code>val_loss</code> was <strong>0.04751</strong>. In late epochs training MAE stabilized near 0.0438.",
      "metrics.v2.title": "Capacity",
      "metrics.v2.text":
        "<strong>4.97M</strong> total parameters, <strong>4.97M</strong> trainable. ~1M below the 6M cap.",
      "metrics.v3.title": "Visual quality",
      "metrics.v3.text":
        "On test samples the model reorders pieces and fills seams. Residual error concentrates on fine texture, not layout.",
      "metrics.fig.alt": "Patches, prediction, and target for three test samples",
      "metrics.fig.cap":
        "Real notebook run: input patches, model prediction, and target for three test samples.",
      "footer.text": "Patches to Images · neural jigsaw reconstruction on STL-10 · Keras / TensorFlow",
    },
    pt: {
      "meta.title": "Patches to Images — Reconstrução visual de quebra-cabeça",
      "meta.description":
        "Projeto de reconstrução de imagens 96×96 a partir de 9 patches embaralhados 28×28 no STL-10, com rede neural em Keras.",
      "nav.aria": "Seções do projeto",
      "lang.aria": "Idioma da página",
      "lang.label": "Idioma",
      "brand.sub": "Reconstrução neural tipo jigsaw",
      "tab.problema": "Problema",
      "tab.dataset": "Dataset",
      "tab.arquitectura": "Arquitetura",
      "tab.modelo": "Modelo",
      "tab.demo": "Demo",
      "tab.colab": "Colab",
      "tab.metricas": "Métricas",
      "hero.eyebrow": "Projeto de visão computacional",
      "hero.title": "Reconstruir uma imagem completa a partir de nove peças embaralhadas.",
      "hero.lead":
        "O modelo recebe 9 patches RGB de <strong>28×28</strong>, deslocados e com bordas erodidas, e deve devolver a imagem original de <strong>96×96</strong> sem atalhos geométricos nem algoritmos clássicos.",
      "hero.btnDemo": "Testar a demo",
      "hero.btnColab": "Ver o Colab executado",
      "hero.statInput": "Entrada",
      "hero.statOutput": "Saída",
      "hero.statMetric": "Métrica",
      "hero.stageScrambled": "Peças embaralhadas",
      "hero.stageArrow": "rede neural",
      "hero.stageReconstructed": "Imagem reconstruída",
      "hero.altReconstructed": "Imagem alvo de um cão reconstruída em 96×96",
      "problema.contextTitle": "Contexto do problema",
      "problema.contextIntro":
        "Não basta encaixar as peças. O quebra-cabeça é ambíguo: falta informação de borda e a ordem espacial é desconhecida. A rede deve inferir a disposição correta e preencher o conteúdo visual removido ao recortar cada patch.",
      "problema.c1.title": "Ordem desconhecida",
      "problema.c1.text":
        "As 9 peças vêm de uma grade 3×3, mas chegam permutadas. O modelo deve descobrir qual peça corresponde a cada posição.",
      "problema.c2.title": "Bordas erodidas",
      "problema.c2.text":
        "Cada célula original é 32×32, mas é recortada ao centro 28×28. Perde-se a moldura que permitiria encaixar por continuidade de borda.",
      "problema.c3.title": "Reconstrução coerente",
      "problema.c3.text":
        "Além de ordenar, é preciso inpainting: completar lacunas e produzir uma imagem 96×96 contínua, sem artefatos de montagem.",
      "problema.constraintsTitle": "Restrições do enunciado",
      "problema.r1": "Somente redes neurais. Não são permitidos componentes algorítmicos não neurais.",
      "problema.r2": "Proibido usar modelos pré-treinados.",
      "problema.r3": "Menos de 6 milhões de parâmetros treináveis.",
      "problema.r4": "Implementação em Keras, executável no Google Colab.",
      "problema.r5":
        "A qualidade é medida com <strong>Mean Absolute Error (MAE)</strong> no conjunto de teste, reportando também o desvio padrão.",
      "dataset.eyebrow": "Dados",
      "dataset.title": "Sobre o dataset STL-10",
      "dataset.intro":
        "Usamos o conjunto não etiquetado do <strong>Stanford STL-10</strong>: 100.000 imagens coloridas em resolução nativa 96×96, com 10 classes visuais. Encaixa naturalmente porque a saída do modelo coincide com o tamanho de cada imagem.",
      "dataset.statImages": "imagens sem etiqueta",
      "dataset.statRes": "resolução RGB",
      "dataset.statClasses": "classes visuais",
      "dataset.statSplit": "train / val / test",
      "dataset.splitTitle": "Partição usada",
      "dataset.split1": "<strong>80.000</strong> imagens de treino",
      "dataset.split2": "<strong>10.000</strong> de validação",
      "dataset.split3": "<strong>10.000</strong> de teste",
      "dataset.splitNote":
        "O gerador recorta 9 patches 32×32, recorta o centro para 28×28 e aplica uma permutação aleatória. O alvo é a imagem completa normalizada em [0, 1].",
      "dataset.classesTitle": "Classes do STL-10",
      "dataset.fig1.alt": "Exemplo do conjunto de teste: vaca em tons de cinza",
      "dataset.fig1.cap": "Amostra do test set (imagem completa 96×96).",
      "dataset.fig2.alt": "Nove patches embaralhados de um cão",
      "dataset.fig2.cap": "O mesmo tipo de amostra como quebra-cabeça: 9 patches 28×28 com lacunas.",
      "dataset.fig3.alt": "Imagem alvo do cão",
      "dataset.fig3.cap": "Objetivo: reconstruir a cena original a partir dessas peças.",
      "arch.eyebrow": "Design",
      "arch.title": "Arquitetura da solução",
      "arch.intro":
        "O <em>Jigsaw_Model</em> é um pipeline 100% neural: entende cada patch, infere uma permutação válida, monta um canvas 96×96 e completa lacunas com uma U-Net residual.",
      "arch.s1.title": "Entrada de patches",
      "arch.s1.text": "Tensor <code>(B, 9, 28, 28, 3)</code>. Nove peças RGB embaralhadas por batch.",
      "arch.s2.title": "Encoder robusto",
      "arch.s2.text":
        "CNN <code>TimeDistributed</code> com convoluções 64→128→256. Extrai um vetor de 256 dimensões por patch, sem contexto global ainda.",
      "arch.s3.title": "Transformer",
      "arch.s3.text":
        "Embeddings posicionais + 2 blocos de atenção multi-cabeça (8 cabeças). Modela relações entre peças para decidir a ordem relativa.",
      "arch.s4.title": "Router Sinkhorn",
      "arch.s4.text":
        "Camada personalizada que converte logits 9×9 em matriz duplamente estocástica. Força atribuição 1 a 1, não softmax independente.",
      "arch.s5.title": "Reordenação física",
      "arch.s5.text":
        "A matriz de permutação reordena os patches originais, não só os embeddings. Preserva a textura real de cada peça.",
      "arch.s6.title": "Montagem do canvas",
      "arch.s6.text":
        "Cada peça é preenchida para 32×32 e colocada em grade 3×3. O canvas 96×96 fica com fissuras do material erodido no dataset.",
      "arch.s7.title": "U-Net de inpainting",
      "arch.s7.text":
        "U-Net profunda prevê residual sobre o canvas. Soma + sigmoid devolve pixels em [0, 1] e imagem contínua.",
      "arch.trainTitle": "Treinamento",
      "arch.train1": "Otimizador <strong>AdamW</strong> (lr 3e-4, weight decay 1e-4)",
      "arch.train2": "Perda e métrica: <strong>MAE</strong>",
      "arch.train3": "Até 200 épocas, batch size 8",
      "arch.train4": "Callbacks: backup no Drive, checkpoint do melhor val_loss e ReduceLROnPlateau",
      "arch.whyTitle": "Por que Sinkhorn + U-Net",
      "arch.whyText":
        "O Transformer propõe uma ordem; Sinkhorn a torna permutação válida. A U-Net não inventa o layout: só preenche juntas e refina textura. Essa separação mantém o modelo abaixo de 6M de parâmetros.",
      "model.eyebrow": "Pesos treinados",
      "model.title": "Link do modelo",
      "model.intro":
        "Os pesos são publicados como arquivo <code>.keras</code> baixável com <code>gdown</code>, como exige o enunciado. No Colab carregam com <code>load_model(..., safe_mode=False)</code> para registrar <code>SinkhornRouting</code>.",
      "model.bannerTitle": "Modelo treinado pronto para carregar",
      "model.bannerText": "Arquivo de 60,2 MB. Baixado e carregado sem erros no notebook.",
      "model.btnDrive": "Abrir no Google Drive",
      "model.btnGdown": "Download direto (gdown)",
      "model.btnDemo": "Usar na demo",
      "model.statTotal": "Parâmetros totais",
      "model.statTrain": "Treináveis",
      "model.statLimit": "Limite",
      "demo.eyebrow": "Teste interativo",
      "demo.title": "Demo",
      "demo.intro":
        "Envie uma foto. A página recorta para <strong>96×96</strong>, gera 9 patches <strong>28×28</strong> embaralhados e reconstrói a imagem.",
      "demo.dropzone": "Solte uma imagem ou clique para escolher",
      "demo.sample": "Carregar exemplo",
      "demo.shuffle": "Nova mistura",
      "demo.run": "Reconstruir",
      "demo.rebuilding": "Reconstruindo…",
      "demo.fig1": "1. Imagem 96×96",
      "demo.fig2": "2. Patches aleatórios",
      "demo.fig3": "3. Reconstrução",
      "demo.mae": "MAE em relação à imagem recortada: {{mae}}",
      "demo.status.ready":
        "Modelo TF.js encontrado. Envie uma imagem e clique em <strong>Reconstruir</strong>.",
      "demo.status.missing":
        "Falta o modelo web. Coloque o <code>.keras</code> em <code>site/model/</code> e execute <code>python scripts/convert_model.py site/model/best_jigsaw_model.keras</code>. Enquanto isso você pode ver os patches aleatórios.",
      "demo.status.inference":
        "O modelo está presente, mas a inferência falhou: <code>{{msg}}</code>. Reconverta o <code>.keras</code> com o script.",
      "demo.err.tf": "Não foi possível carregar TensorFlow.js. Recarregue a página.",
      "demo.err.image": "Não foi possível ler a imagem",
      "demo.err.zero": "A saída do modelo é toda zero. Tente recarregar ou reconverter o .keras.",
      "demo.err.tensor": "O modelo não retornou um tensor válido",
      "colab.eyebrow": "Solução completa",
      "colab.title": "Colab da solução",
      "colab.intro":
        "Abaixo estão as saídas reais do notebook do repositório. Baixe-o para abrir no Google Colab ou executar localmente com o mesmo ambiente do projeto.",
      "colab.download": "Baixar notebook (.ipynb)",
      "colab.meta": "Python 3 · GPU A100 · 31 células",
      "metrics.eyebrow": "Resultados",
      "metrics.title": "Métricas obtidas",
      "metrics.intro":
        "A métrica oficial é MAE no test set, com desvio padrão. O baseline ingênuo — repetir o patch médio e reescalar — serve de referência.",
      "metrics.baseline": "Baseline · patch médio",
      "metrics.delta": "menor erro",
      "metrics.model": "Jigsaw_Model · test",
      "metrics.v1.title": "Validação",
      "metrics.v1.text":
        "O melhor <code>val_loss</code> do checkpoint foi <strong>0.04751</strong>. Nas últimas épocas o MAE de treino estabilizou perto de 0.0438.",
      "metrics.v2.title": "Capacidade",
      "metrics.v2.text":
        "<strong>4,97M</strong> parâmetros totais, <strong>4,97M</strong> treináveis. ~1M abaixo do limite de 6 milhões.",
      "metrics.v3.title": "Qualidade visual",
      "metrics.v3.text":
        "Nas amostras de teste, o modelo recoloca peças e preenche juntas. O erro residual concentra-se em texturas finas, não no layout.",
      "metrics.fig.alt": "Comparação de patches, predição e alvo para três amostras de teste",
      "metrics.fig.cap":
        "Execução real do notebook: patches de entrada, predição do modelo e alvo, para três amostras do test set.",
      "footer.text": "Patches to Images · reconstrução neural de quebra-cabeça no STL-10 · Keras / TensorFlow",
    },
    it: {
      "meta.title": "Patches to Images — Ricostruzione visiva del puzzle",
      "meta.description":
        "Progetto di ricostruzione di immagini 96×96 da 9 patch mischiati 28×28 su STL-10, con rete neurale in Keras.",
      "nav.aria": "Sezioni del progetto",
      "lang.aria": "Lingua della pagina",
      "lang.label": "Lingua",
      "brand.sub": "Ricostruzione neurale tipo jigsaw",
      "tab.problema": "Problema",
      "tab.dataset": "Dataset",
      "tab.arquitectura": "Architettura",
      "tab.modelo": "Modello",
      "tab.demo": "Demo",
      "tab.colab": "Colab",
      "tab.metricas": "Metriche",
      "hero.eyebrow": "Progetto di visione artificiale",
      "hero.title": "Ricostruire un'immagine completa da nove pezzi mischiati.",
      "hero.lead":
        "Il modello riceve 9 patch RGB <strong>28×28</strong>, spostati e con bordi erosi, e deve restituire l'immagine originale <strong>96×96</strong> senza scorciatoie geometriche né algoritmi classici.",
      "hero.btnDemo": "Prova la demo",
      "hero.btnColab": "Vedi il Colab eseguito",
      "hero.statInput": "Ingresso",
      "hero.statOutput": "Uscita",
      "hero.statMetric": "Metrica",
      "hero.stageScrambled": "Pezzi mischiati",
      "hero.stageArrow": "rete neurale",
      "hero.stageReconstructed": "Immagine ricostruita",
      "hero.altReconstructed": "Immagine obiettivo di un cane ricostruita a 96×96",
      "problema.contextTitle": "Contestualizzazione del problema",
      "problema.contextIntro":
        "Non basta incastrare i pezzi. Il puzzle è ambiguo: manca informazione sui bordi e l'ordine spaziale è sconosciuto. La rete deve inferire la disposizione corretta e riempire il contenuto visivo rimosso dal ritaglio di ogni patch.",
      "problema.c1.title": "Ordine sconosciuto",
      "problema.c1.text":
        "I 9 pezzi provengono da una griglia 3×3 ma arrivano permutati. Il modello deve scoprire quale pezzo corrisponde a ogni posizione.",
      "problema.c2.title": "Bordi erosi",
      "problema.c2.text":
        "Ogni cella originale è 32×32 ma viene ritagliata al centro 28×28. Si perde il bordo che permetterebbe l'incastro per continuità.",
      "problema.c3.title": "Ricostruzione coerente",
      "problema.c3.text":
        "Oltre all'ordinamento serve inpainting: completare i vuoti e produrre una immagine 96×96 continua, senza artefatti di assemblaggio.",
      "problema.constraintsTitle": "Vincoli del compito",
      "problema.r1": "Solo reti neurali. Non sono ammessi componenti algoritmici non neurali.",
      "problema.r2": "Vietato usare modelli pre-addestrati.",
      "problema.r3": "Meno di 6 milioni di parametri addestrabili.",
      "problema.r4": "Implementazione in Keras, eseguibile su Google Colab.",
      "problema.r5":
        "La qualità si misura con <strong>Mean Absolute Error (MAE)</strong> sul test set, riportando anche la deviazione standard.",
      "dataset.eyebrow": "Dati",
      "dataset.title": "Il dataset STL-10",
      "dataset.intro":
        "Si usa la parte non etichettata di <strong>Stanford STL-10</strong>: 100.000 immagini a colori a risoluzione nativa 96×96, con 10 classi visive. È naturale per questo problema perché l'uscita del modello coincide con la dimensione di ogni immagine.",
      "dataset.statImages": "immagini non etichettate",
      "dataset.statRes": "risoluzione RGB",
      "dataset.statClasses": "classi visive",
      "dataset.statSplit": "train / val / test",
      "dataset.splitTitle": "Partizione usata",
      "dataset.split1": "<strong>80.000</strong> immagini di training",
      "dataset.split2": "<strong>10.000</strong> di validazione",
      "dataset.split3": "<strong>10.000</strong> di test",
      "dataset.splitNote":
        "Il generatore ritaglia 9 patch 32×32, centra a 28×28 e applica una permutazione casuale. L'etichetta è l'immagine completa normalizzata in [0, 1].",
      "dataset.classesTitle": "Classi STL-10",
      "dataset.fig1.alt": "Esempio dal test set: mucca in scala di grigi",
      "dataset.fig1.cap": "Campione del test set (immagine completa 96×96).",
      "dataset.fig2.alt": "Nove patch mischiati di un cane",
      "dataset.fig2.cap": "Lo stesso tipo di campione come puzzle: 9 patch 28×28 con spazi vuoti.",
      "dataset.fig3.alt": "Immagine obiettivo del cane",
      "dataset.fig3.cap": "Obiettivo: ricostruire la scena originale da quei pezzi.",
      "arch.eyebrow": "Design",
      "arch.title": "Architettura della soluzione",
      "arch.intro":
        "Il <em>Jigsaw_Model</em> è una pipeline 100% neurale: comprende ogni patch, inferisce una permutazione valida, assembla un canvas 96×96 e completa i vuoti con una U-Net residuale.",
      "arch.s1.title": "Ingresso patch",
      "arch.s1.text": "Tensor <code>(B, 9, 28, 28, 3)</code>. Nove pezzi RGB mischiati per batch.",
      "arch.s2.title": "Encoder robusto",
      "arch.s2.text":
        "CNN <code>TimeDistributed</code> con convoluzioni 64→128→256. Estrae un vettore 256-D per patch, senza ancora contesto globale.",
      "arch.s3.title": "Transformer",
      "arch.s3.text":
        "Embedding posizionali + 2 blocchi di attenzione multi-testa (8 teste). Modella relazioni tra pezzi per decidere l'ordine relativo.",
      "arch.s4.title": "Router Sinkhorn",
      "arch.s4.text":
        "Layer personalizzato che converte logits 9×9 in matrice doppiamente stocastica. Impone assegnazione 1 a 1, non softmax indipendente.",
      "arch.s5.title": "Riordino fisico",
      "arch.s5.text":
        "La matrice di permutazione riordina i patch originali, non solo gli embedding. Si conserva la texture reale di ogni pezzo.",
      "arch.s6.title": "Assemblaggio canvas",
      "arch.s6.text":
        "Ogni pezzo viene portato a 32×32 e posizionato su griglia 3×3. Il canvas 96×96 ha crepe dal materiale eroso nel dataset.",
      "arch.s7.title": "U-Net di inpainting",
      "arch.s7.text":
        "U-Net profonda predice un residuo sul canvas. Somma + sigmoid restituisce pixel in [0, 1] e immagine continua.",
      "arch.trainTitle": "Addestramento",
      "arch.train1": "Ottimizzatore <strong>AdamW</strong> (lr 3e-4, weight decay 1e-4)",
      "arch.train2": "Loss e metrica: <strong>MAE</strong>",
      "arch.train3": "Fino a 200 epoche, batch size 8",
      "arch.train4": "Callback: backup su Drive, checkpoint del miglior val_loss e ReduceLROnPlateau",
      "arch.whyTitle": "Perché Sinkhorn + U-Net",
      "arch.whyText":
        "Il Transformer propone un ordine; Sinkhorn lo rende una permutazione valida. La U-Net non inventa il layout: riempie giunzioni e rifinisce la texture. Questa separazione tiene il modello sotto 6M di parametri.",
      "model.eyebrow": "Pesi addestrati",
      "model.title": "Link al modello",
      "model.intro":
        "I pesi sono pubblicati come file <code>.keras</code> scaricabile con <code>gdown</code>, come richiesto. Nel Colab si caricano con <code>load_model(..., safe_mode=False)</code> per registrare <code>SinkhornRouting</code>.",
      "model.bannerTitle": "Modello addestrato pronto al caricamento",
      "model.bannerText": "File da 60,2 MB. Scaricato e caricato correttamente nel notebook.",
      "model.btnDrive": "Apri in Google Drive",
      "model.btnGdown": "Download diretto (gdown)",
      "model.btnDemo": "Usa nella demo",
      "model.statTotal": "Parametri totali",
      "model.statTrain": "Addestrabili",
      "model.statLimit": "Limite",
      "demo.eyebrow": "Prova interattiva",
      "demo.title": "Demo",
      "demo.intro":
        "Carica una foto. La pagina la ritaglia a <strong>96×96</strong>, genera 9 patch <strong>28×28</strong> mischiati e ricostruisce l'immagine.",
      "demo.dropzone": "Trascina un'immagine o clicca per scegliere",
      "demo.sample": "Carica esempio",
      "demo.shuffle": "Nuovo mix",
      "demo.run": "Ricostruisci",
      "demo.rebuilding": "Ricostruzione…",
      "demo.fig1": "1. Immagine 96×96",
      "demo.fig2": "2. Patch casuali",
      "demo.fig3": "3. Ricostruzione",
      "demo.mae": "MAE rispetto all'immagine ritagliata: {{mae}}",
      "demo.status.ready":
        "Modello TF.js trovato. Carica un'immagine e premi <strong>Ricostruisci</strong>.",
      "demo.status.missing":
        "Manca il modello web. Metti il <code>.keras</code> in <code>site/model/</code> ed esegui <code>python scripts/convert_model.py site/model/best_jigsaw_model.keras</code>. Puoi comunque vedere i patch casuali.",
      "demo.status.inference":
        "Il modello è presente ma l'inferenza è fallita: <code>{{msg}}</code>. Riconverti il <code>.keras</code> con lo script.",
      "demo.err.tf": "Impossibile caricare TensorFlow.js. Ricarica la pagina.",
      "demo.err.image": "Impossibile leggere l'immagine",
      "demo.err.zero": "L'uscita del modello è tutta zero. Prova a ricaricare o riconvertire il .keras.",
      "demo.err.tensor": "Il modello non ha restituito un tensore valido",
      "colab.eyebrow": "Soluzione completa",
      "colab.title": "Colab della soluzione",
      "colab.intro":
        "Sotto vedi le uscite reali del notebook del repository. Scaricalo per aprirlo su Google Colab o eseguirlo in locale con lo stesso ambiente del progetto.",
      "colab.download": "Scarica notebook (.ipynb)",
      "colab.meta": "Python 3 · GPU A100 · 31 celle",
      "metrics.eyebrow": "Risultati",
      "metrics.title": "Metriche ottenute",
      "metrics.intro":
        "La metrica ufficiale è MAE sul test set, con deviazione standard. Il baseline ingenuo — ripetere il patch medio e riscalare — serve come riferimento.",
      "metrics.baseline": "Baseline · patch medio",
      "metrics.delta": "errore minore",
      "metrics.model": "Jigsaw_Model · test",
      "metrics.v1.title": "Validazione",
      "metrics.v1.text":
        "Il miglior <code>val_loss</code> salvato dal checkpoint è stato <strong>0.04751</strong>. Nelle ultime epoche il MAE di training si è stabilizzato intorno a 0.0438.",
      "metrics.v2.title": "Capacità",
      "metrics.v2.text":
        "<strong>4,97M</strong> parametri totali, <strong>4,97M</strong> addestrabili. ~1M sotto il limite di 6 milioni.",
      "metrics.v3.title": "Qualità visiva",
      "metrics.v3.text":
        "Su campioni di test, il modello ricolloca i pezzi e riempie le giunzioni. L'errore residuo si concentra su texture fini, non sul layout.",
      "metrics.fig.alt": "Confronto patch, predizione e obiettivo per tre campioni di test",
      "metrics.fig.cap":
        "Esecuzione reale del notebook: patch di ingresso, predizione del modello e obiettivo, per tre campioni del test set.",
      "footer.text": "Patches to Images · ricostruzione neurale di puzzle su STL-10 · Keras / TensorFlow",
    },
  };

  let currentLang = "es";

  function interpolate(text, vars) {
    if (!vars) return text;
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : ""));
  }

  function t(key, vars) {
    const pack = M[currentLang] || M.es;
    const fallback = M.es[key] || key;
    return interpolate(pack[key] || fallback, vars);
  }

  function isInsideNotebook(el) {
    return Boolean(el.closest("[data-i18n-skip]"));
  }

  function applyLanguage(lang) {
    if (!LOCALES.includes(lang)) lang = "es";
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const htmlLang = lang === "pt" ? "pt-BR" : lang;
    document.documentElement.lang = htmlLang;
    document.title = t("meta.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t("meta.description");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (isInsideNotebook(el)) return;
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      if (isInsideNotebook(el)) return;
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(key);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      if (isInsideNotebook(el)) return;
      const key = el.getAttribute("data-i18n-alt");
      if (key) el.setAttribute("alt", t(key));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key));
    });

    const select = document.getElementById("lang-select");
    if (select && select.value !== lang) select.value = lang;

    document.dispatchEvent(new CustomEvent("pti:language", { detail: { lang } }));
  }

  function initLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = LOCALES.includes(saved) ? saved : "es";
    const select = document.getElementById("lang-select");
    if (select) {
      select.addEventListener("change", () => applyLanguage(select.value));
    }
    applyLanguage(initial);
  }

  window.ptiT = t;
  window.ptiGetLanguage = () => currentLang;
  window.ptiApplyLanguage = applyLanguage;
  window.ptiInitLanguage = initLanguage;

  document.addEventListener("DOMContentLoaded", initLanguage);
})();
