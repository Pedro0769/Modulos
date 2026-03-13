import { loadPDF } from './pdfLoader.js';

const flipbook = $('#flipbook');
const thumbnails = $('#thumbnails');
const flipSound = new Audio('./audio/pageturn.mp3');

// 📌 Selector de archivo PDF
document.getElementById('pdf-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      const typedArray = new Uint8Array(this.result);
      // 👇 Llamada correcta a loadPDF con todos los parámetros
      loadPDF(typedArray, flipbook, thumbnails, flipSound);

      // ✅ Inicializar turn.js después de cargar el PDF
      flipbook.turn({
        width: 800,
        height: 600,
        autoCenter: true
      });

      // ✅ Enganchar flechas de navegación
      document.getElementById('nav-left').addEventListener('click', () => {
        flipbook.turn('previous');
      });

      document.getElementById('nav-right').addEventListener('click', () => {
        flipbook.turn('next');
      });

      // ✅ Opcional: ocultar flechas en primera/última página
      flipbook.bind('turned', (event, page) => {
        const total = flipbook.turn('pages');
        document.getElementById('nav-left').style.display = (page === 1) ? 'none' : 'flex';
        document.getElementById('nav-right').style.display = (page === total) ? 'none' : 'flex';
	//document.getElementById('nav-left').style.display = 'flex';
	//document.getElementById('nav-right').style.display = 'flex';

      });
    };
    reader.readAsArrayBuffer(file);
  }
});