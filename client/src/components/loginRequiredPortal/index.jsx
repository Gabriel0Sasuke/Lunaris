import { createPortal } from 'react-dom';
import './loginRequiredPortal.css';

function LoginRequiredPortal({
    isOpen,
    title = 'Faça login para continuar',
    message = 'Essa ação exige autenticação. Deseja ir para a tela de login agora?',
    confirmLabel = 'Ir para login',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel
}) {
    if (!isOpen || typeof document === 'undefined') return null;

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onCancel?.();
        }
    };

    return createPortal(
        <div className="LoginRequiredOverlay" onClick={handleBackdropClick} role="presentation">
            <div className="LoginRequiredCard" role="dialog" aria-modal="true" aria-label={title}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="LoginRequiredActions">
                    <button type="button" className="LoginRequiredButton cancel" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" className="LoginRequiredButton confirm" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default LoginRequiredPortal;
