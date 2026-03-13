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
    // 🔹 Reinsertar flechas
  flipbook.append(`
    <button id="nav-left" class="nav-arrow" aria-label="Página anterior">
      <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
    <button id="nav-right" class="nav-arrow" aria-label="Página siguiente">
      <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
    </button>
  `);

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

  // Estado inicial del progreso
  updateProgress(1, totalPages);

  // Sonido al pasar página
  $('#flipbook').bind("turning", () => {
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.play();
    }
  });

  // Actualizar progreso y altura dinámica
  $('#flipbook').bind("turned", (event, page) => {
    updateProgress(page, totalPages);
    adjustFlipbookHeight(page);  // 👈 ajusta altura dinámica por página
      // 🔹 Control de visibilidad de flechas
    document.getElementById('nav-left').style.display = (page === 1) ? 'none' : 'flex';
    document.getElementById('nav-right').style.display = (page === totalPages) ? 'none' : 'flex';
  });

  // Enganchar flechas de navegación (se asegura de no duplicar eventos)
  $('#nav-left').off('click').on('click', () => $('#flipbook').turn('previous'));
  $('#nav-right').off('click').on('click', () => $('#flipbook').turn('next'));

  // Configurar barra de progreso interactiva
  setupProgressBar($('#flipbook'), totalPages);

  // Handler de resize para adaptar display y altura
  boundResizeHandler = () => handleResize($('#flipbook'), adjustFlipbookHeight);
  window.addEventListener('resize', boundResizeHandler);
  
  // 🔹 Estado inicial de flechas
  document.getElementById('nav-left').style.display = 'none'; // primera página
  document.getElementById('nav-right').style.display = (totalPages > 1) ? 'flex' : 'none';
}

