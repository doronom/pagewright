type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function current(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function apply(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

export function setupThemeToggle(): void {
  apply(current());
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    button.addEventListener('click', () => {
      const next: Theme = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable (private mode); the theme still applies for this page.
      }
    });
  }
}
