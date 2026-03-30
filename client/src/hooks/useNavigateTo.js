import { useNavigate } from 'react-router-dom';

export function useNavigateTo() {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        window.scrollTo(0, 0);
        navigate(path);
    };

    return navigateTo;
}
