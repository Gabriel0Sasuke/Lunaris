import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateTo() {
    const navigate = useNavigate();

    const navigateTo = useCallback((path) => {
        window.scrollTo(0, 0);
        navigate(path);
    }, [navigate]);

    return navigateTo;
}
