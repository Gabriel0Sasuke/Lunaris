//CSS
import './home.css';

//UI
import star from '../../assets/ui/star.svg';
import layer from '../../assets/ui/layer.svg';
import history from '../../assets/ui/history.svg';
import openbook from '../../assets/ui/openbook.svg';
import bookmark from '../../assets/ui/bookmark.svg';
import bookmarkadded from '../../assets/ui/bookmarkadded.svg';
import bookmarkremove from '../../assets/ui/bookmarkremove.svg';
import loading from '../../assets/ui/loading.svg';

//Icones do button
import infinity from '../../assets/ui/infinity.svg';

//Componentes
import MangaCard from '../../components/mangaCard';
import LoginRequiredPortal from '../../components/loginRequiredPortal';

//React
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

//Services
import { notify } from '../../services/notify';
import { formatRelativeTimeShort } from '../../services/CreatedManga';

function Home() {
    const { usuario } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const [SelectedTag, setSelectedTag] = useState(0);
    const [homeTags, setHomeTags] = useState([{ id: 0, label: 'Tudo', icon: infinity, prioridade: 1 }]);
    const touchStartX = useRef(null);
    const [mangasList, setMangasList] = useState([]);
    const [recentMangasList, setRecentMangasList] = useState([]);
    const [topMangasList, setTopMangasList] = useState([]);
    const [carouselBookmarkStatus, setCarouselBookmarkStatus] = useState({});
    const [carouselBookmarkLoading, setCarouselBookmarkLoading] = useState({});
    const [carouselBookmarkHover, setCarouselBookmarkHover] = useState({});
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const carouselItems = topMangasList.slice(0, 3);

    // Pegar Os Mangás
    useEffect(() => {
        setIsLoading(true);
        const fetchMangas = async () => {
            // Declaração de Valor Maximo
            const MAX_MANGAS_GRID = 24; // Valor Maximo de Grid
            const MAX_MANGAS_ROWS = 14; // Valor Maximo de Rows
            const tagParam = SelectedTag > 0 ? encodeURIComponent(String(SelectedTag)) : '';
            try{
            const response = await Promise.all([
                fetch(`${API_URL}/manga/list${tagParam ? `?tag=${tagParam}&` : '?'}orderby=A-Z&max=${MAX_MANGAS_GRID}`, {
                    credentials: 'include'
                }),
                fetch(`${API_URL}/manga/list${tagParam ? `?tag=${tagParam}&` : '?'}orderby=views&max=${MAX_MANGAS_ROWS}`, {
                    credentials: 'include'
                }),
                fetch(`${API_URL}/manga/list${tagParam ? `?tag=${tagParam}&` : '?'}orderby=recent&max=${MAX_MANGAS_ROWS}`, {
                    credentials: 'include'
                })
            ]);
            const mangasData = await response[0].json();
            const topMangasData = await response[1].json();
            const recentMangasData = await response[2].json();

            setMangasList(Array.isArray(mangasData.manga) ? mangasData.manga : []);
            setRecentMangasList(Array.isArray(recentMangasData.manga) ? recentMangasData.manga : []);
            setTopMangasList(Array.isArray(topMangasData.manga) ? topMangasData.manga : []);
            } catch (error) {
                notify.error('Erro ao carregar mangas');
                setMangasList([]);
                setRecentMangasList([]);
                setTopMangasList([]);
                return;
            }finally {
                setIsLoading(false);
            }
        }
        fetchMangas();
    }, [SelectedTag]);

    // Buscar as Tags para o filtro
    useEffect(() => {
        const fetchHomeTags = async () => {
            try {
                const response = await fetch(`${API_URL}/tag/list`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar tags');
                }

                const data = await response.json();
                const sortedTags = (Array.isArray(data.tags) ? data.tags : [])
                    .map((tag) => ({
                        id: tag.id,
                        slug: tag.slug,
                        label: tag.name,
                        icon: tag.icon ? `data:image/svg+xml;utf8,${encodeURIComponent(tag.icon)}` : infinity,
                        prioridade: Number(tag.prioridade) === 1 ? 1 : 0
                    }))
                    .sort((a, b) => b.prioridade - a.prioridade || a.label.localeCompare(b.label));

                const MAX_HOME_TAGS = 11;
                setHomeTags([
                    { id: 0, label: 'Tudo', icon: infinity, prioridade: 1 },
                    ...sortedTags.slice(0, Math.max(0, MAX_HOME_TAGS - 1))
                ]);
            } catch {
                setHomeTags([{ id: 0, label: 'Tudo', icon: infinity, prioridade: 1 }]);
            }
        };

        fetchHomeTags();
    }, []);


    useEffect(() => {
        if (carouselItems.length === 0) {
            setActiveIndex(0);
            return;
        }

        if (activeIndex >= carouselItems.length) {
            setActiveIndex(0);
        }
    }, [carouselItems.length, activeIndex]);


    // Mudar slide a cada 3 segundos
    useEffect(() => {
        const totalSlides = carouselItems.length;
        if (totalSlides <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => ((current + 1) % totalSlides));
        }, 5000);

        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const newChaptersRef = useRef(null);
    const newMangasRef = useRef(null);

    const nextSlide = () => {
        const totalSlides = carouselItems.length;
        if (totalSlides <= 1) return;
        setActiveIndex((current) => ((current + 1) % totalSlides));
    };

    const prevSlide = () => {
        const totalSlides = carouselItems.length;
        if (totalSlides <= 1) return;
        setActiveIndex((current) => ((current - 1 + totalSlides) % totalSlides));
    };

    const handleCarouselTouchStart = (e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
    };

    const handleCarouselTouchEnd = (e) => {
        if (touchStartX.current === null) return;

        const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const deltaX = touchEndX - touchStartX.current;

        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        touchStartX.current = null;
    };

    useEffect(() => {
        const setupScroll = (ref) => {
            const el = ref.current;
            if (!el) return;

            const handleWheel = (e) => {
                if (e.deltaY === 0) return;
                const canScroll = el.scrollWidth > el.clientWidth;
                if (canScroll) {
                    e.preventDefault();
                    el.scrollLeft += e.deltaY;
                }
            };

            el.addEventListener('wheel', handleWheel, { passive: false });
            return () => el.removeEventListener('wheel', handleWheel);
        };

        const cleanup1 = setupScroll(newChaptersRef);
        const cleanup2 = setupScroll(newMangasRef);

        return () => {
            if (cleanup1) cleanup1();
            if (cleanup2) cleanup2();
        };
    }, []);

    const link = (pagina) => {
        navigate(pagina);
    };

    const checkCarouselBookmarks = async (mangas) => {
        if (!usuario?.id || !Array.isArray(mangas) || mangas.length === 0) return;

        const updates = {};
        await Promise.all(
            mangas.map(async (manga) => {
                if (!manga?.id) return;
                try {
                    const response = await fetch(`${API_URL}/user/bookmark/check?mangaid=${manga.id}`, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (!response.ok) return;

                    const data = await response.json();
                    updates[manga.id] = Boolean(data.bookmarked);
                } catch {
                    return;
                }
            })
        );

        setCarouselBookmarkStatus((prev) => ({ ...prev, ...updates }));
    };

    const handleCarouselBookmark = async (mangaId) => {
        if (!mangaId) return;
        if (!usuario?.id) {
            setLoginPromptOpen(true);
            return;
        }
        if (carouselBookmarkLoading[mangaId]) return;

        try {
            setCarouselBookmarkLoading((prev) => ({ ...prev, [mangaId]: true }));

            const response = await fetch(`${API_URL}/user/bookmark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ mangaid: mangaId })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar bookmark');
            }

            const data = await response.json();
            setCarouselBookmarkStatus((prev) => ({ ...prev, [mangaId]: !prev[mangaId] }));
            notify.success(data?.message || 'Bookmark atualizado');
        } catch {
            notify.error('Erro ao atualizar bookmark');
        } finally {
            setCarouselBookmarkLoading((prev) => ({ ...prev, [mangaId]: false }));
        }
    };

    useEffect(() => {
        checkCarouselBookmarks(carouselItems);
    }, [usuario?.id, topMangasList]);

    return (
        <main className="home-content">
            {/* Carrousel de Items de Mangá em destaque*/}
            <div id="carousel" onTouchStart={handleCarouselTouchStart} onTouchEnd={handleCarouselTouchEnd}>
                {isLoading ? (
                    <div className="carouselSkeleton">
                        <div className="carouselSkeletonMedia"></div>
                        <div className="carouselSkeletonInfo">
                            <div className="carouselSkeletonTags">
                                <div className="carouselSkeletonTag"></div>
                                <div className="carouselSkeletonTag"></div>
                                <div className="carouselSkeletonTag"></div>
                                <div className="carouselSkeletonTag"></div>
                            </div>
                            <div className="carouselSkeletonTitle"></div>
                            <div className="carouselSkeletonLine"></div>
                            <div className="carouselSkeletonLine"></div>
                            <div className="carouselSkeletonLine short"></div>
                            <div className="carouselSkeletonButtons">
                                <div className="carouselSkeletonBtn"></div>
                                <div className="carouselSkeletonBtn"></div>
                            </div>
                        </div>
                    </div>
                ) : carouselItems.length > 0 ? (
                    carouselItems.map((manga, index) => (
                        <div key={manga.id || manga.titulo || `carousel-${index}`} className={`carousel-item ${activeIndex === index ? 'active' : ''}`}>
                            <img src={manga.banner || manga.foto || '/banner/sololeveling.png'} alt={manga.titulo || `Mangá em alta ${index + 1}`} />
                            <div className="carousel-item-info">
                                <div className="carousel-info-tags">
                                    <div className="info-tag">EM ALTA #{index + 1}</div>
                                    <div className="info-tag"><img src={star} alt="star" />{manga.rating || 'N/A'}</div>
                                    <div className="info-tag"><img src={layer} alt="layer" />{manga.tipo || 'Tipo'} - {manga.demografia || 'Demografia'}</div>
                                    <div className="info-tag"><img src={history} alt="history" />Status: {manga.status || 'Em Lançamento'}</div>
                                </div>
                                <h2>{manga.titulo || 'Mangá em destaque'}</h2>
                                <span>{manga.sinopse || 'Confira um dos mangás mais populares do momento na plataforma.'}</span>
                                <div className="buttonsBox">
                                    <button type="button" className="btn-primary" onClick={() => link(`/manga/${manga.id}`)}>
                                        <img src={openbook} alt="openbook" /> Ler Agora
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => handleCarouselBookmark(manga.id)}
                                        disabled={Boolean(carouselBookmarkLoading[manga.id])}
                                        onMouseEnter={() => {
                                            if (!carouselBookmarkLoading[manga.id]) {
                                                setCarouselBookmarkHover((prev) => ({ ...prev, [manga.id]: true }));
                                            }
                                        }}
                                        onMouseLeave={() => setCarouselBookmarkHover((prev) => ({ ...prev, [manga.id]: false }))}
                                    >
                                        <img
                                            src={
                                                carouselBookmarkLoading[manga.id]
                                                    ? loading
                                                    : carouselBookmarkStatus[manga.id]
                                                        ? (carouselBookmarkHover[manga.id] ? bookmarkremove : bookmarkadded)
                                                        : bookmark
                                            }
                                            alt="bookmark"
                                        />
                                        {carouselBookmarkLoading[manga.id]
                                            ? ''
                                            : carouselBookmarkStatus[manga.id]
                                                ? (carouselBookmarkHover[manga.id] ? 'Remover da Lista' : 'Adicionado à Lista')
                                                : 'Adicionar a Lista'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="carouselEmptyState mangaEmptyState">
                        <div className="mangaEmptyIcon">{'(>_<)'}</div>
                        <h3>Nenhum destaque no momento</h3>
                        <p>Estamos preparando os mangás em alta. Tente novamente em instantes.</p>
                    </div>
                )}
            </div>
            {/* Seção de Tags Pra todas as Seções Abaixo*/}
            <div className="newTags">
                {homeTags.map((tag) => (
                    <button
                        key={tag.id}
                        className={`newTagsItem ${SelectedTag === tag.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTag(tag.id)}
                    >
                        <img src={tag.icon} alt={tag.label} /> {tag.label}
                    </button>
                ))}
            </div>

            {/* Seção de Novos Capitulos */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Capitulos Recém-Lançados</span></div>
            <div className="mangaRow" ref={newChaptersRef}>
                <div className="mangaEmptyState mangaEmptyStateRow">
                    <div className="mangaEmptyIcon">{'(>_<)'}</div>
                    <h3>Em breve</h3>
                    <p>Estamos preparando os capítulos recém-lançados para esta seção.</p>
                </div>
            </div>
            {/* Seção de Mangás em alta */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Mangás em Alta</span></div>
            <div className="mangaRow" ref={newChaptersRef}>
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <MangaCard key={i} isLoading />
                    ))
                ) : topMangasList.length > 0 ? (
                    topMangasList.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            manga={{
                                id: manga.id,
                                title: manga.titulo,
                                image: manga.foto,
                                genre: manga.tipo,
                                genre2: manga.demografia,
                                rating: manga.rating || 'N/A',
                                views: manga.views ?? 0,
                                lastUpdate: formatRelativeTimeShort(manga.created_at)
                            }}
                        />
                    ))
                ) : (
                    <div className="mangaEmptyState mangaEmptyStateRow">
                        <div className="mangaEmptyIcon">{'(>_<)'}</div>
                        <h3>Nenhum mangá encontrado</h3>
                        <p>Não encontramos resultados para esse filtro, ou há problema com a conexão.</p>
                        {SelectedTag !== 0 && (
                            <button type="button" onClick={() => setSelectedTag(0)}>
                                Ver Todos os Mangás
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Seção de Novos Mangás */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Novos Mangás</span></div>
            <div className="mangaRow" ref={newMangasRef}>
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <MangaCard key={i} isLoading />
                    ))
                ) : recentMangasList.length > 0 ? (
                    recentMangasList.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            manga={{
                                id: manga.id,
                                title: manga.titulo,
                                image: manga.foto,
                                genre: manga.tipo,
                                genre2: manga.demografia,
                                rating: manga.rating || 'N/A',
                                views: manga.views ?? 0,
                                lastUpdate: formatRelativeTimeShort(manga.created_at)
                            }}
                        />
                    ))
                ) : (
                    <div className="mangaEmptyState mangaEmptyStateRow">
                        <div className="mangaEmptyIcon">{'(>_<)'}</div>
                        <h3>Nenhum mangá encontrado</h3>
                        <p>Não encontramos resultados para esse filtro, ou há problema com a conexão.</p>
                        {SelectedTag !== 0 && (
                            <button type="button" onClick={() => setSelectedTag(0)}>
                                Ver Todos os Mangás
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Seção de Descubra mais com tudo */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Descubra Mais</span></div>
            <div className='mangaGrid'>
                {isLoading ? (
                    Array.from({ length: 16 }).map((_, i) => (
                        <MangaCard key={i} isGrid isLoading />
                    ))
                ) : mangasList.length > 0 ? (
                    mangasList.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            isGrid
                            manga={{
                                id: manga.id,
                                title: manga.titulo,
                                image: manga.foto,
                                genre: manga.tipo,
                                genre2: manga.demografia,
                                rating: manga.rating || 'N/A',
                                views: manga.views ?? 0,
                                lastUpdate: formatRelativeTimeShort(manga.created_at)
                            }}
                        />
                    ))
                ) : (
                    <div className="mangaEmptyState mangaEmptyStateGrid">
                        <div className="mangaEmptyIcon">{'(>_<)'}</div>
                        <h3>Nenhum mangá encontrado</h3>
                        <p>Não encontramos resultados para esse filtro, ou há problema com a conexão.</p>
                        {SelectedTag !== 0 && (
                            <button type="button" onClick={() => setSelectedTag(0)}>
                                Ver Todos os Mangás
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="mangaGridSeeAll">
                <button onClick={() => link('/browser') }>Ver Todos</button>
            </div>

            <LoginRequiredPortal
                isOpen={loginPromptOpen}
                onCancel={() => setLoginPromptOpen(false)}
                onConfirm={() => {
                    setLoginPromptOpen(false);
                    link('/login');
                }}
            />
        </main>
    );
}
export default Home;
