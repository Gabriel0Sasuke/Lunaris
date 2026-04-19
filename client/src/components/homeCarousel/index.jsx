import './homeCarousel.css';

// UI
import star from '../../assets/ui/starfull.svg';
import layer from '../../assets/ui/layer.svg';
import history from '../../assets/ui/history.svg';
import openbook from '../../assets/ui/openbook.svg';
import bookmark from '../../assets/ui/bookmark.svg';
import bookmarkadded from '../../assets/ui/bookmarkadded.svg';
import bookmarkremove from '../../assets/ui/bookmarkremove.svg';
import loading from '../../assets/ui/loading.svg';

// React
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { useAuth } from '../../context/AuthContext';

// Services
import { notify } from '../../utils/notify';
import { mangaAPI } from '../../api/mangaApi';
import { mangaFormatter } from '../../utils/mangaFormatter';

function HomeCarousel({ items = [], isLoading, onLoginRequired }) {
    const { usuario } = useAuth();
    const navigateTo = useNavigateTo();
    const [activeIndex, setActiveIndex] = useState(0);

    // Bookmark state
    const [bookmarkStatus, setBookmarkStatus] = useState({});
    const [bookmarkLoading, setBookmarkLoading] = useState({});
    const [bookmarkHover, setBookmarkHover] = useState({});

    // Touch / Mouse swipe
    const startX = useRef(null);
    const isDragging = useRef(false);

    // ── Auto-play ──
    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setActiveIndex((i) => (i + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length]);

    const currentIndex = items.length > 0 ? activeIndex % items.length : 0;

    // ── Navegação ──
    const go = useCallback((dir) => {
        if (items.length <= 1) return;
        setActiveIndex((i) => (i + dir + items.length) % items.length);
    }, [items.length]);

    // Touch
    const onTouchStart = (e) => { startX.current = e.touches[0]?.clientX ?? null; };
    const onTouchEnd = (e) => {
        if (startX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        startX.current = null;
    };

    // Mouse swipe (no carousel itself)
    const onMouseDown = (e) => { startX.current = e.clientX; isDragging.current = true; };
    const onMouseUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const dx = e.clientX - (startX.current ?? e.clientX);
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        startX.current = null;
    };
    const onMouseLeave = () => { isDragging.current = false; startX.current = null; };

    // ── Bookmarks ──
    useEffect(() => {
        if (!usuario?.id || items.length === 0) return;
        const check = async () => {
            const updates = {};
            await Promise.all(
                items.map(async (m) => {
                    if (!m?.id) return;
                    try {
                        const d = await mangaAPI.checkBookmark({ id: m.id });
                        updates[m.id] = Boolean(d.bookmarked);
                    } catch { /* silencioso */ }
                })
            );
            setBookmarkStatus((p) => ({ ...p, ...updates }));
        };
        check();
    }, [usuario?.id, items]);

    const toggleBookmark = async (id) => {
        if (bookmarkLoading[id] || !id) return;
        if (!usuario?.id) { onLoginRequired?.(); return; }
        try {
            setBookmarkHover((p) => ({ ...p, [id]: false }));
            setBookmarkLoading((p) => ({ ...p, [id]: true }));
            const data = await mangaAPI.toggleBookmark({ id });
            setBookmarkStatus((p) => ({ ...p, [id]: !p[id] }));
            notify.success(data.message);
        } catch {
            notify.error('Erro ao atualizar bookmark');
        } finally {
            setBookmarkLoading((p) => ({ ...p, [id]: false }));
        }
    };

    const getBookmarkIcon = (id) => {
        if (bookmarkLoading[id]) return loading;
        if (bookmarkStatus[id]) return bookmarkHover[id] ? bookmarkremove : bookmarkadded;
        return bookmark;
    };

    const getBookmarkLabel = (id) => {
        if (bookmarkLoading[id]) return '';
        if (bookmarkStatus[id]) return bookmarkHover[id] ? 'Remover da Lista' : 'Adicionado à Lista';
        return 'Adicionar a Lista';
    };

    // ── Render ──
    if (isLoading) return (
        <div className="home-carousel">
            <div className="carousel-skeleton">
                <div className="carousel-skeleton-bg" />
                <div className="carousel-skeleton-content">
                    <div className="carousel-skeleton-tags">
                        <div className="carousel-skeleton-tag" />
                        <div className="carousel-skeleton-tag" />
                        <div className="carousel-skeleton-tag" />
                    </div>
                    <div className="carousel-skeleton-title" />
                    <div className="carousel-skeleton-line" />
                    <div className="carousel-skeleton-line" />
                    <div className="carousel-skeleton-line short" />
                    <div className="carousel-skeleton-buttons">
                        <div className="carousel-skeleton-btn" />
                        <div className="carousel-skeleton-btn" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (items.length === 0) return (
        <div className="home-carousel">
            <div className="carousel-empty">
                <div className="carousel-empty-icon">{'(>_<)'}</div>
                <h3>Nenhum destaque no momento</h3>
                <p>Estamos preparando os mangás em alta. Tente novamente em instantes.</p>
            </div>
        </div>
    );

    return (
        <div
            className="home-carousel"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            {items.map((manga, idx) => (
                <div key={manga.id || `slide-${idx}`} className={`carousel-slide ${currentIndex === idx ? 'active' : ''}`}>
                    <img
                        className="carousel-slide-image"
                        src={manga.banner || manga.foto || '/banner/sololeveling.png'}
                        alt={manga.titulo || `Mangá em alta ${idx + 1}`}
                        draggable="false"
                    />
                    <div className="carousel-overlay" />
                    <div className="carousel-content">
                        <div className="carousel-tags">
                            <span className="carousel-tag tag-rank">EM ALTA #{idx + 1}</span>
                            <span className="carousel-tag tag-rating">
                                <img src={star} alt="star" />{manga.avg_rating ?? 'N/A'}
                            </span>
                            <span className="carousel-tag">
                                <img src={layer} alt="tipo" />
                                {mangaFormatter.formatType(manga.tipo)} - {mangaFormatter.formatDemographic(manga.demografia)}
                            </span>
                            <span className="carousel-tag tag-status">
                                <img src={history} alt="status" />Status: {mangaFormatter.formatStatus(manga.status)}
                            </span>
                        </div>
                        <h2 className="carousel-title">{manga.titulo || 'Mangá em destaque'}</h2>
                        <p className="carousel-synopsis">
                            {manga.sinopse || 'Confira um dos mangás mais populares do momento na plataforma.'}
                        </p>
                        <div className="carousel-buttons">
                            <button className="carousel-btn carousel-btn-primary" onClick={() => navigateTo(`/manga/${manga.id}`)}>
                                <img src={openbook} alt="ler" /> Ler Agora
                            </button>
                            <button
                                className="carousel-btn carousel-btn-secondary"
                                onClick={() => toggleBookmark(manga.id)}
                                disabled={Boolean(bookmarkLoading[manga.id])}
                                onMouseEnter={() => !bookmarkLoading[manga.id] && setBookmarkHover((p) => ({ ...p, [manga.id]: true }))}
                                onMouseLeave={() => setBookmarkHover((p) => ({ ...p, [manga.id]: false }))}
                            >
                                <img src={getBookmarkIcon(manga.id)} alt="bookmark" />
                                {getBookmarkLabel(manga.id)}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {items.length > 1 && (
                <div className="carousel-dots">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            className={`carousel-dot ${currentIndex === i ? 'active' : ''}`}
                            onClick={() => setActiveIndex(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomeCarousel;
