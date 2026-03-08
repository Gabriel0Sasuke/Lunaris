//CSS
import './home.css';

//UI
import star from '../../assets/ui/star.svg';
import layer from '../../assets/ui/layer.svg';
import history from '../../assets/ui/history.svg';
import openbook from '../../assets/ui/openbook.svg';
import bookmark from '../../assets/ui/bookmark.svg';

//Icones do button
import infinity from '../../assets/ui/infinity.svg';

//Componentes
import MangaCard from '../../components/mangaCard';

import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../services/api';

//Services
import { notify } from '../../services/notify';
import { formatRelativeTimeShort } from '../../services/CreatedManga';

function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [SelectedTag, setSelectedTag] = useState(0);
    const [homeTags, setHomeTags] = useState([{ id: 0, label: 'Tudo', icon: infinity, prioridade: 1 }]);
    const touchStartX = useRef(null);
    const [mangasList, setMangasList] = useState([]);
    const [recentMangasList, setRecentMangasList] = useState([]);
    const [topMangasList, setTopMangasList] = useState([]);

    const carouselItems = topMangasList.slice(0, 3);

    // Pegar Os Mangás
    // Mangás de A-Z
    useEffect(() => {
        const fetchMangas = async () => {
            try {
                // Quantidade Maxima
                const MAX_MANGAS = 24;
                const response = await fetch(`${API_URL}/manga/list?tag=${encodeURIComponent(String(SelectedTag))}&MAX=${MAX_MANGAS}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao carregar mangas');
                setMangasList(Array.isArray(data.manga) ? data.manga : []);
            } catch (error) {
                notify.error(error.message || 'Erro ao carregar mangas');
            }
        };
        fetchMangas();
    }, [SelectedTag]);

    // Mangás Recentes
    useEffect(() => {
        const fetchRecentMangas = async () => {
            try {
                const MAX_RECENT_MANGAS = 14;
                const response = await fetch(`${API_URL}/manga/recent?tag=${encodeURIComponent(String(SelectedTag))}&MAX=${MAX_RECENT_MANGAS}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao carregar mangas recentes');
                setRecentMangasList(Array.isArray(data.manga) ? data.manga : []);
            } catch (error) {
                notify.error(error.message || 'Erro ao carregar mangas recentes');
            }
        };
        fetchRecentMangas();
    }, [SelectedTag]);

    // Mangás Mais Populares
    useEffect(() => {
        const fetchTopMangas = async () => {
            try {
                const MAX_TOP_MANGAS = 24;
                const response = await fetch(`${API_URL}/manga/top?tag=${encodeURIComponent(String(SelectedTag))}&MAX=${MAX_TOP_MANGAS}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao carregar mangas mais populares');
                setTopMangasList(Array.isArray(data.manga) ? data.manga : []);
            } catch (error) {
                notify.error(error.message || 'Erro ao carregar mangas mais populares');
                setTopMangasList([]);
            }
        };
        fetchTopMangas();
    }, [SelectedTag]);

    useEffect(() => {
        if (carouselItems.length === 0) {
            setActiveIndex(0);
            return;
        }

        if (activeIndex >= carouselItems.length) {
            setActiveIndex(0);
        }
    }, [carouselItems.length, activeIndex]);

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

    return (
        <main className="home-content">
            {/* Carrousel de Items de Mangá em destaque*/}
            <div id="carousel" onTouchStart={handleCarouselTouchStart} onTouchEnd={handleCarouselTouchEnd}>
                {carouselItems.length > 0 ? (
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
                                    <button className="btn-primary"><img src={openbook} alt="openbook" /> Ler Agora</button>
                                    <button className="btn-secondary"><img src={bookmark} alt="bookmark" /> Adicionar a Lista</button>
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
                {topMangasList.length > 0 ? (
                    topMangasList.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            manga={{
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
                        <p>Não encontramos resultados para esse filtro. Tente outra tag ou volte para "Tudo".</p>
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
                {recentMangasList.length > 0 ? (
                    recentMangasList.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            manga={{
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
                        <p>Não encontramos resultados para esse filtro. Tente outra tag ou volte para "Tudo".</p>
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
                {mangasList.length > 0 ? (
                    mangasList.map((manga) => (
                        <MangaCard
                            key={manga.id}
                            manga={{
                                title: manga.titulo,
                                image: manga.foto,
                                genre: manga.tipo,
                                genre2: manga.demografia,
                                rating: manga.rating || 'N/A',
                                views: manga.views ?? 0,
                                lastUpdate: formatRelativeTimeShort(manga.created_at)
                            }}
                            isGrid
                        />
                    ))
                ) : (
                    <div className="mangaEmptyState">
                        <div className="mangaEmptyIcon">{'(>_<)'}</div>
                        <h3>Nenhum mangá encontrado</h3>
                        <p>Não encontramos resultados para esse filtro. Tente outra tag ou volte para "Tudo".</p>
                        {SelectedTag !== 0 && (
                            <button type="button" onClick={() => setSelectedTag(0)}>
                                Ver Todos os Mangás
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="mangaGridSeeAll">
                <button>Ver Todos</button>
            </div>
        </main>
    );
}
export default Home;
