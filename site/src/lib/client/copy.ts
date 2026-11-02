const RESET_MS = 2000;

function textFor(button: HTMLElement): string {
  if (button.dataset.copy !== undefined) return button.dataset.copy;
  const block = button.closest('[data-test="code-block"]');
  const code = block?.querySelector('pre code') ?? block?.querySelector('pre');
  return code instanceof HTMLElement ? code.innerText.replace(/\n$/, '') : '';
}

function setState(button: HTMLElement, state: 'idle' | 'copied' | 'failed'): void {
  const label = button.querySelector('.copy-label');
  const original = button.dataset.label ?? label?.textContent ?? 'copy';
  button.dataset.label = original;
  if (label) label.textContent = state === 'idle' ? original : state === 'copied' ? 'copied' : 'copy failed';
  button.querySelector('.copy-icon')?.classList.toggle('hidden', state === 'copied');
  button.querySelector('.copied-icon')?.classList.toggle('hidden', state !== 'copied');
  button.dataset.state = state;
}

export function setupCopyButtons(): void {
  for (const button of document.querySelectorAll<HTMLElement>('[data-copy-button]')) {
    let timer: number | undefined;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textFor(button));
        setState(button, 'copied');
      } catch {
        setState(button, 'failed');
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setState(button, 'idle'), RESET_MS);
    });
  }
}
