import * as pdfjsLib from './pdf.mjs';
import { initFlipbook, resetFlipbook } from './flipbookUI.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';

export function loadPDF(data, flipbook, thumbnails, flipSound) {
  pdfjsLib.getDocument({ data }).promise.then(pdf => {
    resetFlipbook(flipbook, thumbnails);

    let pageSizes = {};
    let loadedPages = 0;
    let baseWidth = 0;
    let baseHeight = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      const pageDiv = $('<div class="page"><canvas id="page'+i+'"></canvas></div>');
      flipbook.append(pageDiv);

      pdf.getPage(i).then(page => {
        const canvas = document.getElementById('page'+i);
        const context = canvas.getContext('2d');

        const flipbookWidth = 900 //document.getElementById('flipbook').clientWidth;
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = flipbookWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        page.render({ canvasContext: context, viewport: scaledViewport }).promise.then(() => {
          loadedPages++;
          pageSizes[i] = { width: scaledViewport.width, height: scaledViewport.height };

          if (i === 1) {
            baseWidth = scaledViewport.width;
            baseHeight = scaledViewport.height;
          }

          if (loadedPages === pdf.numPages) {
            initFlipbook(baseWidth, baseHeight, flipSound, adjustFlipbookHeight, pdf.numPages);
          }
        });

        // Miniaturas
        const thumbCanvas = document.createElement('canvas');
        const thumbContext = thumbCanvas.getContext('2d');
        const thumbViewport = page.getViewport({ scale: 0.2 });
        thumbCanvas.width = thumbViewport.width;
        thumbCanvas.height = thumbViewport.height;
        page.render({ canvasContext: thumbContext, viewport: thumbViewport });
        thumbnails.append(thumbCanvas);

        thumbCanvas.addEventListener('click', () => {
          flipbook.turn('page', i);
        });
      });
    }

    function adjustFlipbookHeight(page) {
      const size = pageSizes[page];
      if (size) {
        const containerWidth = document.getElementById('flipbook').clientWidth;
        const scaleFactor = containerWidth / size.width;
        const scaledHeight = Math.round(size.height * scaleFactor);

        // 👇 Ajusta dinámicamente el tamaño del flipbook según la página actual
        $('#flipbook').turn('size', containerWidth, scaledHeight);
      }
   }
  });
}

