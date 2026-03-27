import { useState } from 'react';
import { createPortal } from 'react-dom';
import './avaliationPortal.css';


import star from '../../assets/ui/star.svg';
import starfull from '../../assets/ui/starfull.svg';

function avaliationPortal({
    isOpen,
    title,
    confirmLabel = 'Enviar Avaliação',
    cancelLabel = 'Cancelar Avaliação',
    onConfirm,
    onCancel
}) {
    const [rating, setRating] = useState(0);

    if (!isOpen || typeof document === 'undefined') return null;

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onCancel?.();
        }
    };
    function Stars({ rating, onChange }) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <img
                    key={i}
                    src={i <= rating ? starfull : star}
                    alt={`${i} estrela${i > 1 ? 's' : ''}`}
                    onClick={() => onChange(i)}
                    className="AvaliationStar"
                />
            );
        }
        return <div className="AvaliationStars">{stars}</div>;
    }

    return createPortal(
        <div className="AvaliationOverlay" onClick={handleBackdropClick} role="presentation">
            <div className="AvaliationCard" role="dialog" aria-modal="true" aria-label={title}>
                <h3>Quantas estrelas você está dando ao mangá <br/> {title}?</h3>
                <Stars rating={rating} onChange={setRating} />
                <div className="AvaliationActions">
                    <button type="button" className="AvaliationButton cancel" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" className="AvaliationButton confirm" onClick={() => onConfirm?.(rating)}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default avaliationPortal;
