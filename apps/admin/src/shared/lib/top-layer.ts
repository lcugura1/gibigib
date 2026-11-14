let displayTransition: boolean | undefined;

function canTransitionDisplay() {
  if (displayTransition !== undefined) return displayTransition;
  if (!CSS.supports('transition-behavior', 'allow-discrete')) return (displayTransition = false);
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  displayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return displayTransition;
}

const supportsTopLayerExit = () => CSS.supports('overlay', 'auto') && canTransitionDisplay();

export const supportsLightDismiss = () => 'closedBy' in HTMLDialogElement.prototype;

export async function closeDialog(dialog: HTMLDialogElement) {
  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    await Promise.race([
      Promise.allSettled(animations.map((animation) => animation.finished)),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }
  dialog.close();
}

export function isBackdropClick(
  dialog: HTMLDialogElement,
  event: { target: EventTarget; clientX: number; clientY: number },
) {
  if (event.target !== dialog) return false;
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right
  );
}
