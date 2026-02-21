//React
import { useState } from 'react';

//Componentes
import MangaCard from '../components/mangaCard';

//CSS
import '../assets/styles/browser.css';

//Imports
//Icones do button
import coffee from '../assets/ui/coffee.svg';
import comedyMask from '../assets/ui/comedy-mask.svg';
import heart from '../assets/ui/favorite.svg';
import skull from '../assets/ui/skull.svg';
import swords from '../assets/ui/swords.svg';
import rocket from '../assets/ui/rocket.svg';
import wandStars from '../assets/ui/wand-stars.svg';
import dominoMask from '../assets/ui/domino-mask.svg';
import eye from '../assets/ui/eye.svg';
import explore from '../assets/ui/explore.svg';
import infinity from '../assets/ui/infinity.svg';
import star from '../assets/ui/star.svg';
import person from '../assets/ui/person.svg';
import history from '../assets/ui/history.svg';
import openbook from '../assets/ui/openbook.svg';
import search from '../assets/ui/search.svg';
import clock from '../assets/ui/clock.svg';
import add from '../assets/ui/add.svg';
import remove from '../assets/ui/remove.svg';
import filterIcon from '../assets/ui/filter.svg';
import filterOff from '../assets/ui/filterOff.svg';

const tags = [
    { id: 'Tudo', label: 'Tudo', icon: infinity },
    { id: 'Acao', label: 'Ação', icon: swords },
    { id: 'Aventura', label: 'Aventura', icon: explore },
    { id: 'Comedia', label: 'Comédia', icon: comedyMask },
    { id: 'Drama', label: 'Drama', icon: dominoMask },
    { id: 'Fantasia', label: 'Fantasia', icon: wandStars },
    { id: 'Horror', label: 'Horror', icon: skull },
    { id: 'Romance', label: 'Romance', icon: heart },
    { id: 'Sci-fi', label: 'Sci-fi', icon: rocket },
    { id: 'Suspense', label: 'Suspense', icon: eye },
    { id: 'SliceofLife', label: 'Slice of Life', icon: coffee },
    { id: 'Misterio', label: 'Mistério', icon: search },
    { id: 'Sobrenatural', label: 'Sobrenatural', icon: wandStars },
    { id: 'Psicologico', label: 'Psicológico', icon: eye },
    { id: 'Escolar', label: 'Escolar', icon: openbook },
    { id: 'Historico', label: 'Histórico', icon: history },
    { id: 'Isekai', label: 'Isekai', icon: clock },
    { id: 'ArtesMarciais', label: 'Artes Marciais', icon: swords },
    { id: 'Shounen', label: 'Shounen', icon: star },
    { id: 'Seinen', label: 'Seinen', icon: person },
    { id: 'Shoujo', label: 'Shoujo', icon: heart },
    { id: 'Josei', label: 'Josei', icon: heart },
    { id: 'Esportes', label: 'Esportes', icon: explore },
    { id: 'Mecha', label: 'Mecha', icon: rocket }
];

const mockMangas = [
    {
        id: 1,
        title: "Solo Leveling",
        image: "/manga/sololeveling.png",
        genre: "Ação",
        genre2: "Fantasia",
        rating: "4.9",
        views: "1.2M",
        lastUpdate: "4h"
    },
    {
        id: 2,
        title: "One Piece",
        image: "/manga/onepiece.jpg",
        genre: "Aventura",
        genre2: "Ação",
        rating: "5.0",
        views: "3.5M",
        lastUpdate: "2h"
    },
    {
        id: 3,
        title: "Jujutsu Kaisen",
        image: "/manga/jujutsu.jpg",
        genre: "Ação",
        genre2: "Sobrenatural",
        rating: "4.8",
        views: "2.1M",
        lastUpdate: "1h"
    },
    {
        id: 4,
        title: "Chainsaw Man",
        image: "/manga/chainsaw.jpg",
        genre: "Ação",
        genre2: "Horror",
        rating: "4.8",
        views: "1.8M",
        lastUpdate: "5h"
    },
    {
        id: 5,
        title: "Black Clover",
        image: "/manga/blackclover.webp",
        genre: "Ação",
        genre2: "Fantasia",
        rating: "4.7",
        views: "1.1M",
        lastUpdate: "3h"
    },
    {
        id: 6,
        title: "My Hero Academia",
        image: "/manga/myhero.jpg",
        genre: "Aventura",
        genre2: "Ação",
        rating: "4.7",
        views: "1.5M",
        lastUpdate: "6h"
    },
    {
        id: 7,
        title: "Demon Slayer",
        image: "/manga/demon.jpg",
        genre: "Ação",
        genre2: "Histórico",
        rating: "4.9",
        views: "2.8M",
        lastUpdate: "8h"
    },
    {
        id: 8,
        title: "Boruto: TBV",
        image: "/manga/boruto.jpg",
        genre: "Ação",
        genre2: "Aventura",
        rating: "4.6",
        views: "900K",
        lastUpdate: "7h"
    },
    {
        id: 9,
        title: "Dragon Ball Super",
        image: "/manga/dragonball.jpg",
        genre: "Ação",
        genre2: "Sci-fi",
        rating: "4.5",
        views: "1.2M",
        lastUpdate: "4h"
    },
    {
        id: 10,
        title: "Oshi no Ko",
        image: "/manga/oshinoko.webp",
        genre: "Drama",
        genre2: "Sobrenatural",
        rating: "4.9",
        views: "950K",
        lastUpdate: "9h"
    },
    {
        id: 11,
        title: "Kagurabachi",
        image: "/manga/kagurabachi.jpg",
        genre: "Ação",
        genre2: "Sobrenatural",
        rating: "4.8",
        views: "800K",
        lastUpdate: "3d"
    },
    {
        id: 12,
        title: "Kaiju No. 8",
        image: "/manga/kaiju.jpg",
        genre: "Ação",
        genre2: "Sci-fi",
        rating: "4.7",
        views: "1.2M",
        lastUpdate: "1d"
    },
    {
        id: 13,
        title: "Sakamoto Days",
        image: "/manga/sakamoto.jpg",
        genre: "Ação",
        genre2: "Comédia",
        rating: "4.9",
        views: "700K",
        lastUpdate: "2d"
    },
    {
        id: 14,
        title: "Dandadan",
        image: "/manga/dandadan.jpg",
        genre: "Ação",
        genre2: "Sobrenatural",
        rating: "4.9",
        views: "1.1M",
        lastUpdate: "4d"
    },
    {
        id: 15,
        title: "Blue Lock",
        image: "/manga/bluelock.jpg",
        genre: "Esportes",
        genre2: "Ação",
        rating: "4.8",
        views: "2.5M",
        lastUpdate: "5d"
    },
    {
        id: 16,
        title: "Frieren",
        image: "/manga/frieren.webp",
        genre: "Fantasia",
        genre2: "Aventura",
        rating: "5.0",
        views: "3.2M",
        lastUpdate: "6d"
    },
    {
        id: 17,
        title: "Mashle",
        image: "/manga/mashle.jpg",
        genre: "Comédia",
        genre2: "Fantasia",
        rating: "4.6",
        views: "1.5M",
        lastUpdate: "7d"
    },
    {
        id: 18,
        title: "One Punch Man",
        image: "/manga/onepunch.jpg",
        genre: "Ação",
        genre2: "Sobrenatural",
        rating: "4.8",
        views: "900K",
        lastUpdate: "1w"
    },
    {
        id: 19,
        title: "Mushoku Tensei",
        image: "/manga/mushoku.jpg",
        genre: "Ação",
        genre2: "Aventura",
        rating: "5.0",
        views: "200B",
        lastUpdate: "1w"
    },
    {
        id: 20,
        title: "Gachiakuta",
        image: "/manga/gachiakuta.jpg",
        genre: "Ação",
        genre2: "Fantasia",
        rating: "4.8",
        views: "450K",
        lastUpdate: "2w"
    }
];

function Browser() {
    const [SelectedTag, setSelectedTag] = useState('Tudo');
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtros de ordenação
    const [RankBy, setRankBy] = useState('A-Z');
    const [Type, setType] = useState('Todos');
    const [Status, setStatus] = useState('Todos');

    const displayedTags = showAll ? tags : tags.slice(0, 10);
    
    const resetFilter = () => {
        setRankBy('A-Z');
        setType('Todos');
        setStatus('Todos');
    }
    return (
        <main className="browser-content">
            <div className="browserSearchContainer">
                <div className="browserSearch">
                    <input type="text" name="browserInput"  id="browserInput" placeholder="Pesquise por título, autor ou palavras-chave" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                    <button 
                        className="BrowserTagsItem show-more-btn" 
                        onClick={() => setShowAll(!showAll)}
                    >
                        <img src={showAll ? remove : add} alt={showAll ? "Mostrar menos" : "Mostrar mais"} /> {showAll ? 'Mostrar menos' : 'Mostrar mais'}
                    </button>
                    <button onClick={() => setFilter(!filter)} className="BrowserTagsItem filter-btn">
                        <img src={filter ? filterOff : filterIcon} alt={filter ? "Fechar filtros" : "Abrir filtros"} />
                        {filter ? "Fechar filtros" : "Abrir filtros"}
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
                    <div className={`FilterRankOptions ${RankBy === 'A-Z' ? 'selected' : ''}`} onClick={() => setRankBy('A-Z')}><input type="radio" name="rank" id="rank1" value="A-Z" checked={RankBy === 'A-Z'} readOnly /><label htmlFor="rank1" readOnly>A-Z</label></div>
                    <div className={`FilterRankOptions ${RankBy === 'Popularidade' ? 'selected' : ''}`} onClick={() => setRankBy('Popularidade')}><input type="radio" name="rank" id="rank2" value="Popularidade" checked={RankBy === 'Popularidade'} readOnly /><label htmlFor="rank2" readOnly>Popularidade</label></div>
                    <div className={`FilterRankOptions ${RankBy === 'Avaliacao' ? 'selected' : ''}`} onClick={() => setRankBy('Avaliacao')}><input type="radio" name="rank" id="rank3" value="Avaliacao" checked={RankBy === 'Avaliacao'} readOnly /><label htmlFor="rank3" readOnly>Avaliação</label></div>
                    <div className={`FilterRankOptions ${RankBy === 'Data de Lançamento' ? 'selected' : ''}`} onClick={() => setRankBy('Data de Lançamento')}><input type="radio" name="rank" id="rank4" value="Data de Lançamento" checked={RankBy === 'Data de Lançamento'} readOnly /><label htmlFor="rank4" readOnly>Data de Lançamento</label></div>
                </div>
                <div className="browserFilterType">
                    <h4>Tipo:</h4>
                    <div className="FilterTypeOptions">
                    <button className={` ${Type === 'Todos' ? 'selected' : ''}`} onClick={() => setType('Todos')}>Todos</button>
                    <button className={` ${Type === 'Manga' ? 'selected' : ''}`} onClick={() => setType('Manga')}>Manga</button>
                    <button className={` ${Type === 'Manhwa' ? 'selected' : ''}`} onClick={() => setType('Manhwa')}>Manhwa</button>
                    <button className={` ${Type === 'Manhua' ? 'selected' : ''}`} onClick={() => setType('Manhua')}>Manhua</button>
                    </div>
                </div>
                <div className="browserFilterStatus">
                    <h4>Status:</h4>
                    <div className="FilterStatusOptions">
                    <button className={` ${Status === 'Todos' ? 'selected' : ''}`} onClick={() => setStatus('Todos')}>Todos</button>
                    <button className={` ${Status === 'Lancando' ? 'selected' : ''}`} onClick={() => setStatus('Lancando')}>Lançando</button>
                    <button className={` ${Status === 'Completo' ? 'selected' : ''}`} onClick={() => setStatus('Completo')}>Completo</button>
                    </div>
                </div>
            </div>
            <div className="browserContent">
                {mockMangas.map(manga => (
                    <MangaCard key={manga.id} manga={manga} isGrid={true} />
                ))}
            </div>    

            </div>
        </main>
    );
}
export default Browser;