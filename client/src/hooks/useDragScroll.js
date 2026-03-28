import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook reutilizável para scroll com drag do mouse em containers horizontais.
 * Também mantém o touch scroll nativo.
 * 
 * @returns {React.RefObject} ref para aplicar ao container scrollável
 */
export function useDragScroll() {
    const ref = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);
    const hasMoved = useRef(false);

    const onMouseDown = useCallback((e) => {
        const el = ref.current;
        if (!el) return;

        isDragging.current = true;
        hasMoved.current = false;
        startX.current = e.pageX;
        scrollStart.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!isDragging.current) return;
        const el = ref.current;
        if (!el) return;

        const dx = e.pageX - startX.current;
        if (Math.abs(dx) > 5) hasMoved.current = true; 
        el.scrollLeft = scrollStart.current - dx * 1; // Ajuste de velocidade do scroll
    }, []);

    const onMouseUp = useCallback(() => {
        isDragging.current = false;
        const el = ref.current;
        if (el) {
            el.style.cursor = 'grab';
            el.style.removeProperty('user-select');
        }
    }, []);

    const onClickCapture = useCallback((e) => {
        // Previne cliques acidentais após arrastar
        if (hasMoved.current) {
            e.preventDefault();
            e.stopPropagation();
            hasMoved.current = false;
        }
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.cursor = 'grab';

        el.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        el.addEventListener('click', onClickCapture, true);

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            el.removeEventListener('click', onClickCapture, true);
        };
    }, [onMouseDown, onMouseMove, onMouseUp, onClickCapture]);

    return ref;
}
