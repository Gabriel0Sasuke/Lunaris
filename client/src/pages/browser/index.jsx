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
    const [Type, setType] = useState('Todos');
    const [Status, setStatus] = useState('Todos');

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

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const response = await fetch(`${API_URL}/manga/list?tag=${encodeURIComponent(String(SelectedTag))}&MAX=0`, {
                    credentials: 'include'
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao carregar mangás');
                setMangas(Array.isArray(data.manga) ? data.manga : []);
            } catch (error) {
                notify.error(error.message || 'Erro ao carregar mangás');
                setMangas([]);
            }
        };

        fetchMangas();
    }, [SelectedTag]);

    const displayedTags = showAll ? tags : tags.slice(0, 10);

    const resetFilter = () => {
        setRankBy('A-Z');
        setType('Todos');
        setStatus('Todos');
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
                    <div className={`FilterRankOptions ${RankBy === 'Popularidade' ? 'selected' : ''}`} onClick={() => setRankBy('Popularidade')}>
                        <input type="radio" name="rank" id="rank2" value="Popularidade" checked={RankBy === 'Popularidade'} readOnly />
                        <label htmlFor="rank2" readOnly>Popularidade</label>
                    </div>
                    <div className={`FilterRankOptions ${RankBy === 'Avaliacao' ? 'selected' : ''}`} onClick={() => setRankBy('Avaliacao')}>
                        <input type="radio" name="rank" id="rank3" value="Avaliacao" checked={RankBy === 'Avaliacao'} readOnly />
                        <label htmlFor="rank3" readOnly>Avaliação</label>
                    </div>
                    <div className={`FilterRankOptions ${RankBy === 'Data de Lançamento' ? 'selected' : ''}`} onClick={() => setRankBy('Data de Lançamento')}>
                        <input type="radio" name="rank" id="rank4" value="Data de Lançamento" checked={RankBy === 'Data de Lançamento'} readOnly />
                        <label htmlFor="rank4" readOnly>Data de Lançamento</label>
                    </div>
                </div>

                <div className="browserFilterType">
                    <h4>Tipo:</h4>
                    <div className="FilterTypeOptions">
                        <button className={`${Type === 'Todos' ? 'selected' : ''}`} type="button" onClick={() => setType('Todos')}>Todos</button>
                        <button className={`${Type === 'Manga' ? 'selected' : ''}`} type="button" onClick={() => setType('Manga')}>Manga</button>
                        <button className={`${Type === 'Manhwa' ? 'selected' : ''}`} type="button" onClick={() => setType('Manhwa')}>Manhwa</button>
                        <button className={`${Type === 'Manhua' ? 'selected' : ''}`} type="button" onClick={() => setType('Manhua')}>Manhua</button>
                    </div>
                </div>

                <div className="browserFilterStatus">
                    <h4>Status:</h4>
                    <div className="FilterStatusOptions">
                        <button className={`${Status === 'Todos' ? 'selected' : ''}`} type="button" onClick={() => setStatus('Todos')}>Todos</button>
                        <button className={`${Status === 'Lancando' ? 'selected' : ''}`} type="button" onClick={() => setStatus('Lancando')}>Lançando</button>
                        <button className={`${Status === 'Completo' ? 'selected' : ''}`} type="button" onClick={() => setStatus('Completo')}>Completo</button>
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
