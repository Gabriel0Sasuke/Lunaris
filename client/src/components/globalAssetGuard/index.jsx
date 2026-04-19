import { useEffect } from 'react';

function GlobalAssetGuard() {
  useEffect(() => {
    const applyNoDrag = () => {
      document.querySelectorAll('img, svg').forEach((element) => {
        element.setAttribute('draggable', 'false');
      });
    };

    const handleContextMenu = (event) => {
      if (event.target.closest('img, svg, .no-context-menu, [data-no-context-menu="true"]')) {
        event.preventDefault();
      }
    };

    const handleDragStart = (event) => {
      if (event.target.closest('img, svg, .no-drag, [data-no-drag="true"]')) {
        event.preventDefault();
      }
    };

    applyNoDrag();

    const observer = new MutationObserver(() => {
      applyNoDrag();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      observer.disconnect();
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}

export default GlobalAssetGuard;
