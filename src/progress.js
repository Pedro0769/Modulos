export function updateProgress(currentPage, totalPages) {
  const percent = (currentPage / totalPages) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').textContent = `Página ${currentPage} / ${totalPages}`;
}

export function setupProgressBar(flipbook, totalPages) {
  const progressContainer = document.getElementById('progress-container');
  const tooltip = document.getElementById('progress-tooltip');

  progressContainer.onmousemove = e => {
    const rect = progressContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percent = mouseX / rect.width;
    const targetPage = Math.min(Math.max(1, Math.round(percent * totalPages)), totalPages);

    tooltip.textContent = `Página ${targetPage}`;
    tooltip.style.left = mouseX + 'px';
    tooltip.classList.remove('hidden');
  };

  progressContainer.onmouseleave = () => {
    tooltip.classList.add('hidden');
  };

  progressContainer.onclick = e => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const targetPage = Math.min(Math.max(1, Math.round(percent * totalPages)), totalPages);
    flipbook.turn('page', targetPage);
  };
}
