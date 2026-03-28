import { createPortal } from 'react-dom';
import './confirmationPortal.css';

function ConfirmationPortal({
    isOpen,
    title = 'Confirmar ação',
    message = 'Tem certeza que deseja continuar?',
    confirmLabel = 'Confirmar',
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
        <div className="ConfirmationOverlay" onClick={handleBackdropClick} role="presentation">
            <div className="ConfirmationCard" role="dialog" aria-modal="true" aria-label={title}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="ConfirmationActions">
                    <button type="button" className="ConfirmationButton cancel" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" className="ConfirmationButton confirm" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmationPortal;