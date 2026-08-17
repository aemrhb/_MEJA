document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const bibtexText = document.getElementById('bibtexText');

  if (copyBtn && bibtexText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(bibtexText.textContent.trim());
      } catch (err) {
        const range = document.createRange();
        range.selectNode(bibtexText);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      }
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 1800);
    });
  }

  document.querySelectorAll('a[data-placeholder]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
  });

  const scrollCue = document.querySelector('.scroll-cue');
  const main = document.querySelector('main');
  if (scrollCue && main) {
    scrollCue.addEventListener('click', (e) => {
      e.preventDefault();
      main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
