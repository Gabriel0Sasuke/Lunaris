//React
import { useEffect, useState } from 'react';

//Componentes
import MangaCard from '../../components/mangaCard';

//CSS
import './browser.css';

//Imports
//Icones do button
import infinity from '../../assets/ui/infinity.svg';
import add from '../../assets/ui/add.svg';
import remove from '../../assets/ui/remove.svg';
import filterIcon from '../../assets/ui/filter.svg';
import filterOff from '../../assets/ui/filterOff.svg';
import { API_URL } from '../../services/api';
import { notify } from '../../services/notify';
import { formatRelativeTimeShort } from '../../services/CreatedManga';

function Browser() {
    const [SelectedTag, setSelectedTag] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tags, setTags] = useState([{ id: 0, label: 'Tudo', icon: infinity, prioridade: 1 }]);
    const [mangas, setMangas] = useState([]);
    const [RankBy, setRankBy] = useState('A-Z');
    const [Type, setType] = useState('all');
    const [Status, setStatus] = useState('all');

    // Pegar Os Mangás
    const fetchMangas = async () => {
            const tagParam = SelectedTag > 0 ? encodeURIComponent(String(SelectedTag)) : '';
            try{
                const response = await fetch(`${API_URL}/manga/list${tagParam ? `?tag=${tagParam}&` : '?'}orderby=${RankBy}&type=${Type}&status=${Status}&search=${encodeURIComponent(searchTerm.trim())}`, {
                    credentials: 'include'
                });
            const MangasData = await response.json();
            setMangas(Array.isArray(MangasData.manga) ? MangasData.manga : []);
            } catch (error) {
                notify.error('Erro ao carregar mangas');
                setMangas([]);
                return;
            }
        };
        // useEffect pra quando pesquisa
    useEffect(()=> {
        const delayDebounceFn = setTimeout(() => {
            fetchMangas();
        }, 1000); // Aguarda 1000ms (1 Segundo) Após o usuario parar de digitar pra pesquisar
    }, [searchTerm]);
    // useEffect pra quando troca o filtro ou a tag
    useEffect(() => {
        fetchMangas();
    }, [SelectedTag, RankBy, Type, Status]);

    // Pegar as Tags para o filtro
    useEffect(() => {
        const fetchBrowserTags = async () => {
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
                        label: tag.name,
                        icon: tag.icon ? `data:image/svg+xml;utf8,${encodeURIComponent(tag.icon)}` : infinity,
                        prioridade: Number(tag.prioridade) === 1 ? 1 : 0
                    }))
                    .sort((a, b) => b.prioridade - a.prioridade || a.label.localeCompare(b.label));

                setTags([
                    { id: 0, label: 'Tudo', icon: infinity, prioridade: 1 },
                    ...sortedTags
                ]);
            } catch {
                setTags([{ id: 0, label: 'Tudo', icon: infinity, prioridade: 1 }]);
            }
        };

        fetchBrowserTags();
    }, []);

    const displayedTags = showAll ? tags : tags.slice(0, 10);

    const resetFilter = () => {
        setRankBy('A-Z');
        setType('all');
        setStatus('all');
    };

    return (
        <main className="browser-content">
            <div className="browserSearchContainer">
                <div className="browserSearch">
                    <input
                        type="text"
                        name="browserInput"
                        id="browserInput"
                        placeholder="Pesquise por título, autor ou palavras-chave"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="BrowserTags">
                    {displayedTags.map(tag => (
                        <button 
                            key={tag.id}
                            className={`BrowserTagsItem ${SelectedTag === tag.id ? 'selected' : ''}`} 
                            onClick={() => setSelectedTag(tag.id)}
                        >
                            <img src={tag.icon} alt={tag.id} /> {tag.label}
                        </button>
                    ))}
                    {tags.length > 10 && (
                        <button
                            className="BrowserTagsItem show-more-btn"
                            onClick={() => setShowAll((prev) => !prev)}
                        >
                            <img src={showAll ? remove : add} alt={showAll ? 'Mostrar menos' : 'Adicionar mais'} />
                            {showAll ? 'Mostrar menos' : 'Adicionar mais'}
                        </button>
                    )}
                    <button onClick={() => setFilter((prev) => !prev)} className="BrowserTagsItem filter-btn">
                        <img src={filter ? filterOff : filterIcon} alt={filter ? 'Fechar filtros' : 'Abrir filtros'} />
                        {filter ? 'Fechar filtros' : 'Abrir filtros'}
                    </button>
                </div>
            </div>
            <div id='browserPrincipal'>
            <div className={`browserFilter ${filter ? 'ativo' : ''}`}>
                <div className='browserFilterTop'>
                    <h3>Filtros</h3>
                    <span onClick={resetFilter}>Resetar</span>
                </div>

                <div className="browserFilterRank">
                    <h4>Ordenar por:</h4>
                    <div className={`FilterRankOptions ${RankBy === 'A-Z' ? 'selected' : ''}`} onClick={() => setRankBy('A-Z')}>
                        <input type="radio" name="rank" id="rank1" value="A-Z" checked={RankBy === 'A-Z'} readOnly />
                        <label htmlFor="rank1" readOnly>A-Z</label>
                    </div>
                    <div className={`FilterRankOptions ${RankBy === 'views' ? 'selected' : ''}`} onClick={() => setRankBy('views')}>
                        <input type="radio" name="rank" id="rank2" value="views" checked={RankBy === 'views'} readOnly />
                        <label htmlFor="rank2" readOnly>Popularidade</label>
                    </div>
                    <div className={`FilterRankOptions`} > {/* Avaliação desativada por enquanto */}
                        <input type="radio" name="rank" id="rank3" value="rating" checked={RankBy === 'rating'} readOnly />
                        <label htmlFor="rank3" readOnly>Avaliação</label>
                    </div>
                    <div className={`FilterRankOptions ${RankBy === 'recent' ? 'selected' : ''}`} onClick={() => setRankBy('recent')}>
                        <input type="radio" name="rank" id="rank4" value="recent" checked={RankBy === 'recent'} readOnly />
                        <label htmlFor="rank4" readOnly>Data de Lançamento</label>
                    </div>
                </div>

                <div className="browserFilterType">
                    <h4>Tipo:</h4>
                    <div className="FilterTypeOptions">
                        <button className={`${Type === 'all' ? 'selected' : ''}`} type="button" onClick={() => setType('all')}>Todos</button>
                        <button className={`${Type === 'manga' ? 'selected' : ''}`} type="button" onClick={() => setType('manga')}>Manga</button>
                        <button className={`${Type === 'manhwa' ? 'selected' : ''}`} type="button" onClick={() => setType('manhwa')}>Manhwa</button>
                        <button className={`${Type === 'manhua' ? 'selected' : ''}`} type="button" onClick={() => setType('manhua')}>Manhua</button>
                    </div>
                </div>

                <div className="browserFilterStatus">
                    <h4>Status:</h4>
                    <div className="FilterStatusOptions">
                        <button className={`${Status === 'all' ? 'selected' : ''}`} type="button" onClick={() => setStatus('all')}>Todos</button>
                        <button className={`${Status === 'ongoing' ? 'selected' : ''}`} type="button" onClick={() => setStatus('ongoing')}>Lançando</button>
                        <button className={`${Status === 'completed' ? 'selected' : ''}`} type="button" onClick={() => setStatus('completed')}>Completo</button>
                    </div>
                </div>
            </div>
            <div className="browserContent">
                {mangas.length > 0 ? (
                    mangas.map((manga) => (
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
                    <div className="browserEmptyState">
                        <h3>Nenhum mangá encontrado</h3>
                        <p>Não encontramos resultados para essa tag. Tente outra ou volte para "Tudo".</p>
                        {SelectedTag !== 0 && (
                            <button type="button" onClick={() => setSelectedTag(0)}>
                                Ver Todos
                            </button>
                        )}
                    </div>
                )}
            </div>

            </div>
        </main>
    );
}
export default Browser;
