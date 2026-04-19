//CSS
import './home.css';

//UI
import infinity from '../../assets/ui/infinity.svg';

//Componentes
import MangaCard from '../../components/mangaCard';
import HomeCarousel from '../../components/homeCarousel';
import LoginRequiredPortal from '../../components/loginRequiredPortal';

//React
import { useState, useEffect } from 'react';
import { useNavigateTo } from '../../hooks/useNavigateTo';

//Hooks
import { useDragScroll } from '../../hooks/useDragScroll';

//Services
import { notify } from '../../utils/notify';
import { mangaAPI } from '../../api/mangaApi';
import { tagAPI } from '../../api/tagApi';
import { mangaFormatter } from '../../utils/mangaFormatter';

function Home() {
    const [SelectedTag, setSelectedTag] = useState(0);
    const [homeTags, setHomeTags] = useState([{ id: 0, label: 'Tudo', icon: infinity, prioridade: 1 }]);
    const [mangasList, setMangasList] = useState([]);
    const [recentMangasList, setRecentMangasList] = useState([]);
    const [topMangasList, setTopMangasList] = useState([]);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const navigateTo = useNavigateTo();
    const [isLoading, setIsLoading] = useState(true);

    const carouselItems = topMangasList.slice(0, 3);

    // Drag scroll refs para os rows
    const newChaptersDragRef = useDragScroll();
    const topMangasDragRef = useDragScroll();
    const newMangasDragRef = useDragScroll();

    // Pegar Os Mangás
    useEffect(() => {
        const fetchMangas = async () => {
            const MAX_MANGAS_GRID = 24;
            const MAX_MANGAS_ROWS = 16;
            const tagParam = SelectedTag > 0 ? encodeURIComponent(String(SelectedTag)) : '';
            try {
                const [mangasData, topMangasData, recentMangasData] = await Promise.all([
                    mangaAPI.getManga({ limit: MAX_MANGAS_GRID, tag: tagParam, orderBy: 'A-Z' }),
                    mangaAPI.getManga({ limit: MAX_MANGAS_ROWS, tag: tagParam, orderBy: 'views' }),
                    mangaAPI.getManga({ limit: MAX_MANGAS_ROWS, tag: tagParam, orderBy: 'recent' })
                ]);
                setMangasList(Array.isArray(mangasData.manga) ? mangasData.manga : []);
                setRecentMangasList(Array.isArray(recentMangasData.manga) ? recentMangasData.manga : []);
                setTopMangasList(Array.isArray(topMangasData.manga) ? topMangasData.manga : []);
            } catch {
                notify.error('Erro ao carregar mangas');
                setMangasList([]);
                setRecentMangasList([]);
                setTopMangasList([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMangas();
    }, [SelectedTag]);

    // Buscar as Tags para o filtro
    useEffect(() => {
        const fetchHomeTags = async () => {
            try {
                const data = await tagAPI.getTags();
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

    // Wheel horizontal nos rows
    useEffect(() => {
        const setupWheel = (ref) => {
            const el = ref.current;
            if (!el) return;
            const handler = (e) => {
                if (e.deltaY === 0) return;
                if (el.scrollWidth > el.clientWidth) {
                    e.preventDefault();
                    el.scrollLeft += e.deltaY * 3; // Ajuste de velocidade do scroll
                }
            };
            el.addEventListener('wheel', handler, { passive: false });
            return () => el.removeEventListener('wheel', handler);
        };

        const c1 = setupWheel(newChaptersDragRef);
        const c2 = setupWheel(topMangasDragRef);
        const c3 = setupWheel(newMangasDragRef);
        return () => { c1?.(); c2?.(); c3?.(); };
    }, [newChaptersDragRef, topMangasDragRef, newMangasDragRef]);

    const link = (pagina) => navigateTo(pagina);

    // Helper para formatar os dados de manga card
    const toCardProps = (manga) => ({
        id: manga.id,
        title: manga.titulo,
        image: manga.foto,
        genre: mangaFormatter.formatType(manga.tipo),
        genre2: mangaFormatter.formatDemographic(manga.demografia),
        rating: manga.avg_rating ?? 'N/A',
        views: manga.views ?? 0,
        lastUpdate: mangaFormatter.formatDateLow(manga.created_at)
    });

    const renderEmptyRow = () => (
        <div className="mangaEmptyState mangaEmptyStateRow">
            <div className="mangaEmptyIcon">{'(>_<)'}</div>
            <h3>Nenhum mangá encontrado</h3>
            <p>Não encontramos resultados para esse filtro, ou há problema com a conexão.</p>
            {SelectedTag !== 0 && (
                <button type="button" onClick={() => setSelectedTag(0)}>Ver Todos os Mangás</button>
            )}
        </div>
    );

    return (
        <main className="home-content">
            {/* Carousel */}
            <HomeCarousel
                items={carouselItems}
                isLoading={isLoading}
                onLoginRequired={() => setLoginPromptOpen(true)}
            />

            {/* Tags */}
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

            {/* Capitulos Recém-Lançados */}
            <div className="SectionInfo"><div className='Bar' /><span className='SectionTitle'>Capitulos Recém-Lançados</span></div>
            <div className="mangaRow" ref={newChaptersDragRef}>
                <div className="mangaEmptyState mangaEmptyStateRow">
                    <div className="mangaEmptyIcon">{'(>_<)'}</div>
                    <h3>Em breve</h3>
                    <p>Estamos preparando os capítulos recém-lançados para esta seção.</p>
                </div>
            </div>

            {/* Mangás em Alta */}
            <div className="SectionInfo"><div className='Bar' /><span className='SectionTitle'>Mangás em Alta</span></div>
            <div className="mangaRow" ref={topMangasDragRef}>
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <MangaCard key={i} isLoading />)
                ) : topMangasList.length > 0 ? (
                    topMangasList.map((manga) => <MangaCard key={manga.id} manga={toCardProps(manga)} />)
                ) : renderEmptyRow()}
            </div>

            {/* Novos Mangás */}
            <div className="SectionInfo"><div className='Bar' /><span className='SectionTitle'>Novos Mangás</span></div>
            <div className="mangaRow" ref={newMangasDragRef}>
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <MangaCard key={i} isLoading />)
                ) : recentMangasList.length > 0 ? (
                    recentMangasList.map((manga) => <MangaCard key={manga.id} manga={toCardProps(manga)} />)
                ) : renderEmptyRow()}
            </div>

            {/* Descubra Mais */}
            <div className="SectionInfo"><div className='Bar' /><span className='SectionTitle'>Descubra Mais</span></div>
            <div className='mangaGrid'>
                {isLoading ? (
                    Array.from({ length: 16 }).map((_, i) => <MangaCard key={i} isGrid isLoading />)
                ) : mangasList.length > 0 ? (
                    mangasList.map((manga) => <MangaCard key={manga.id} isGrid manga={toCardProps(manga)} />)
                ) : (
                    <div className="mangaEmptyState mangaEmptyStateGrid">
                        <div className="mangaEmptyIcon">{'(>_<)'}</div>
                        <h3>Nenhum mangá encontrado</h3>
                        <p>Não encontramos resultados para esse filtro, ou há problema com a conexão.</p>
                        {SelectedTag !== 0 && (
                            <button type="button" onClick={() => setSelectedTag(0)}>Ver Todos os Mangás</button>
                        )}
                    </div>
                )}
            </div>

            <div className="mangaGridSeeAll">
                <button onClick={() => link('/browser')}>Ver Todos</button>
            </div>

            <LoginRequiredPortal
                isOpen={loginPromptOpen}
                onCancel={() => setLoginPromptOpen(false)}
                onConfirm={() => { setLoginPromptOpen(false); link('/login'); }}
            />
        </main>
    );
}

export default Home;
