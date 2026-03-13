export function handleResize(flipbook, adjustFlipbookHeight) {
  if (flipbook.data('turn')) {
    const currentPage = flipbook.turn('page');
    adjustFlipbookHeight(currentPage);

    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    const displayMode = (isMobile || isPortrait) ? 'single' : 'double';

    flipbook.turn('display', displayMode);
  }
}
