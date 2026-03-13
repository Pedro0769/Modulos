// flipbookUI.js
import { updateProgress, setupProgressBar } from './progress.js';
import { handleResize } from './resizeHandler.js';

let boundResizeHandler = null;

export function resetFlipbook(flipbook, thumbnails) {
  // Si el flipbook ya estaba inicializado, destrúyelo
  if (flipbook.data('turn')) {
    flipbook.turn('destroy');
    flipbook.off();
  }

  // 🔹 Borra únicamente las páginas (no las flechas)
  flipbook.find('.page').remove();

  // 🔹 Limpia las miniaturas
  thumbnails.empty();

  // 🔹 Elimina el resize handler si estaba activo
  if (boundResizeHandler) {
    window.removeEventListener('resize', boundResizeHandler);
    boundResizeHandler = null;
  }
}

//initFlipbook(baseWidth, baseHeight, flipSound, adjustFlipbookHeight, pdf.numPages);

export function initFlipbook(width, height, flipSound, adjustFlipbookHeight, totalPages) {
  const isMobile = window.innerWidth <= 768;
  const isPortrait = window.innerHeight > window.innerWidth;
  const displayMode = (isMobile || isPortrait) ? 'single' : 'double';

  const containerWidth = document.getElementById('flipbook').clientWidth;
  const scaleFactor = containerWidth / width;
  const initHeight = Math.round(height * scaleFactor);

  $('#flipbook').turn({
    width: containerWidth,   // 👈 ancho controlado por el contenedor
    height: initHeight,      // 👈 altura proporcional a la primera página
    autoCenter: true,
    display: displayMode,
    pages: totalPages,
    page: 1
  });

  updateProgress(1, totalPages);

  $('#flipbook').bind("turning", () => {
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.play();
    }
  });

  $('#flipbook').bind("turned", (event, page) => {
    updateProgress(page, totalPages);
    adjustFlipbookHeight(page);  // 👈 ajusta altura dinámica por página
  });

  $('#nav-left').off('click').on('click', () => $('#flipbook').turn('previous'));
  $('#nav-right').off('click').on('click', () => $('#flipbook').turn('next'));

  setupProgressBar($('#flipbook'), totalPages);

  boundResizeHandler = () => handleResize($('#flipbook'), adjustFlipbookHeight);
  window.addEventListener('resize', boundResizeHandler);
}
