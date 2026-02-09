//CSS
import '../assets/styles/home.css';

//UI
import star from '../assets/ui/star.svg';
import layer from '../assets/ui/layer.svg';
import history from '../assets/ui/history.svg';
import openbook from '../assets/ui/openbook.svg';
import bookmark from '../assets/ui/bookmark.svg';

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

//Componentes
import MangaCard from '../components/mangaCard.jsx';

import { useState, useEffect, useRef } from 'react';

function Home() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Mudar slide a cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current === 2 ? 0 : current + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const newChaptersRef = useRef(null);
    const newMangasRef = useRef(null);

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
            <div id="carousel">

                {/* ITEM 1 - Solo Leveling */}
                <div className={`carousel-item ${activeIndex === 0 ? 'active' : ''}`}>
                    <img src="/banner/sololeveling.png" alt="Solo Leveling" />
                    <div className="carousel-item-info">
                        <div className="carousel-info-tags">
                            <div className="info-tag">EM ALTA #1</div>
                            <div className="info-tag"><img src={star} alt="star" />4.9</div>
                            <div className="info-tag"><img src={layer} alt="layer" />Chapters: 124</div>
                            <div className="info-tag"><img src={history} alt="history" />Status: Em Lançamento</div>
                        </div>
                        <h2>Solo Leveling: Arise from the shadow and the dawn</h2>
                        <span>Sung Jinwoo, um caçador de rank E, descobre poderes misteriosos após um evento traumático. Agora, ele deve se tornar mais forte para proteger aqueles que ama enquanto desvendar os segredos por trás de seu novo destino.</span>
                        <div className="buttonsBox">
                            <button className="btn-primary"><img src={openbook} alt="openbook" /> Ler Agora</button>
                            <button className="btn-secondary"><img src={bookmark} alt="bookmark" /> Adicionar a Lista</button>
                        </div>
                    </div>
                </div>

                {/* ITEM 2 - One Piece */}
                <div className={`carousel-item ${activeIndex === 1 ? 'active' : ''}`}>
                    <img src="/banner/onepiece.png" alt="One Piece" />
                    <div className="carousel-item-info">
                        <div className="carousel-info-tags">
                            <div className="info-tag">EM ALTA #2</div>
                            <div className="info-tag"><img src={star} alt="star" />5.0</div>
                            <div className="info-tag"><img src={layer} alt="layer" />Chapters: 1100+</div>
                            <div className="info-tag"><img src={history} alt="history" />Status: Em Lançamento</div>
                        </div>
                        <h2>One Piece: A Grande Era dos Piratas</h2>
                        <span>Monkey D. Luffy viaja pelo Grand Line com sua tripulação em busca do tesouro lendário One Piece para se tornar o Rei dos Piratas. Uma jornada épica repleta de batalhas, risadas e momentos emocionantes.</span>
                        <div className="buttonsBox">
                            <button className="btn-primary"><img src={openbook} alt="openbook" /> Ler Agora</button>
                            <button className="btn-secondary"><img src={bookmark} alt="bookmark" /> Adicionar a Lista</button>
                        </div>
                    </div>
                </div>

                {/* ITEM 3 - Jujutsu Kaisen */}
                <div className={`carousel-item ${activeIndex === 2 ? 'active' : ''}`}>
                    <img src="/banner/jujutsu.png" alt="Jujutsu Kaisen" />
                    <div className="carousel-item-info">
                        <div className="carousel-info-tags">
                            <div className="info-tag">EM ALTA #3</div>
                            <div className="info-tag"><img src={star} alt="star" />4.8</div>
                            <div className="info-tag"><img src={layer} alt="layer" />Chapters: 248</div>
                            <div className="info-tag"><img src={history} alt="history" />Status: Finalizado</div>
                        </div>
                        <h2>Jujutsu Kaisen: Batalha de Feiticeiros</h2>
                        <span>Yuuji Itadori entra no mundo dos Feiticeiros Jujutsu após engolir um dedo amaldiçoado. Agora ele deve reunir os outros fragmentos do demônio Sukuna para proteger a humanidade das maldições.</span>
                        <div className="buttonsBox">
                            <button className="btn-primary"><img src={openbook} alt="openbook" /> Ler Agora</button>
                            <button className="btn-secondary"><img src={bookmark} alt="bookmark" /> Adicionar a Lista</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Seção de Tags Pra todas as Seções Abaixo*/}
            <div className="newTags">
                <button className='newTagsItem'><img src={infinity} alt="infinity" /> Tudo</button>
                <button className='newTagsItem'><img src={swords} alt="swords" /> Ação</button>
                <button className='newTagsItem'><img src={explore} alt="explore" /> Aventura</button>
                <button className='newTagsItem'><img src={comedyMask} alt="comedyMask" /> Comédia</button>
                <button className='newTagsItem'><img src={dominoMask} alt="dominoMask" /> Drama</button>
                <button className='newTagsItem'><img src={wandStars} alt="wandStars" /> Fantasia</button>
                <button className='newTagsItem'><img src={skull} alt="skull" /> Horror</button>
                <button className='newTagsItem'><img src={heart} alt="heart" /> Romance</button>
                <button className='newTagsItem'><img src={rocket} alt="rocket" /> Sci-fi</button>
                <button className='newTagsItem'><img src={eye} alt="eye" /> Suspense</button>
                <button className='newTagsItem'><img src={coffee} alt="coffee" /> Slice of Life</button>
            </div>

            {/* Seção de Novos Capitulos */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Capitulos Recém-Lançados</span></div>
            <div className="mangaRow" ref={newChaptersRef}>
                {MangaCard({ manga: {
                    title: "Solo Leveling",
                    image: "/manga/sololeveling.png",
                    genre: "Ação",
                    genre2: "Fantasia",
                    rating: "4.9",
                    views: "1.2M",
                    lastUpdate: "4h"
                }})}
            {MangaCard({ manga: {
                title: "One Piece",
                image: "/manga/onepiece.jpg",
                genre: "Aventura",
                genre2: "Ação",
                rating: "5.0",
                views: "3.5M",
                lastUpdate: "2h"
            }})}
            {MangaCard({ manga: {
                title: "Jujutsu Kaisen",
                image: "/manga/jujutsu.jpg",
                genre: "Ação",
                genre2: "Sobrenatural",
                rating: "4.8",
                views: "2.1M",
                lastUpdate: "1h"
            }})}
            {MangaCard({ manga: {
                title: "Chainsaw Man",
                image: "/manga/chainsaw.jpg",
                genre: "Ação",
                genre2: "Horror",
                rating: "4.8",
                views: "1.8M",
                lastUpdate: "5h"
            }})}
            {MangaCard({ manga: {
                title: "Black Clover",
                image: "/manga/blackclover.webp",
                genre: "Ação",
                genre2: "Fantasia",
                rating: "4.7",
                views: "1.1M",
                lastUpdate: "3h"
            }})}
            {MangaCard({ manga: {
                title: "My Hero Academia",
                image: "/manga/myhero.jpg",
                genre: "Aventura",
                genre2: "Ação",
                rating: "4.7",
                views: "1.5M",
                lastUpdate: "6h"
            }})}
            {MangaCard({ manga: {
                title: "Demon Slayer",
                image: "/manga/demon.jpg",
                genre: "Ação",
                genre2: "Histórico",
                rating: "4.9",
                views: "2.8M",
                lastUpdate: "8h"
            }})}
            {MangaCard({ manga: {
                title: "Boruto: TBV",
                image: "/manga/boruto.jpg",
                genre: "Ação",
                genre2: "Aventura",
                rating: "4.6",
                views: "900K",
                lastUpdate: "7h"
            }})}
            {MangaCard({ manga: {
                title: "Dragon Ball Super",
                image: "/manga/dragonball.jpg",
                genre: "Ação",
                genre2: "Sci-fi",
                rating: "4.5",
                views: "1.2M",
                lastUpdate: "4h"
            }})}
            {MangaCard({ manga: {
                title: "Oshi no Ko",
                image: "/manga/oshinoko.webp",
                genre: "Drama",
                genre2: "Sobrenatural",
                rating: "4.9",
                views: "950K",
                lastUpdate: "9h"
            }})}
            </div>
            {/* Seção de Novos Mangás */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Novos Mangás</span></div>
            <div className="mangaRow" ref={newMangasRef}>
                {MangaCard({ manga: {
                    title: "Kagurabachi",
                    image: "/manga/kagurabachi.jpg",
                    genre: "Ação",
                    genre2: "Sobrenatural",
                    rating: "4.8",
                    views: "800K",
                    lastUpdate: "3d"
                }})}
            {MangaCard({ manga: {
                title: "Kaiju No. 8",
                image: "/manga/kaiju.jpg",
                genre: "Ação",
                genre2: "Sci-fi",
                rating: "4.7",
                views: "1.2M",
                lastUpdate: "1d"
            }})}
            {MangaCard({ manga: {
                title: "Sakamoto Days",
                image: "/manga/sakamoto.jpg",
                genre: "Ação",
                genre2: "Comédia",
                rating: "4.9",
                views: "700K",
                lastUpdate: "2d"
            }})}
            {MangaCard({ manga: {
                title: "Dandadan",
                image: "/manga/dandadan.jpg",
                genre: "Ação",
                genre2: "Sobrenatural",
                rating: "4.9",
                views: "1.1M",
                lastUpdate: "4d"
            }})}
            {MangaCard({ manga: {
                title: "Blue Lock",
                image: "/manga/bluelock.jpg",
                genre: "Esportes",
                genre2: "Ação",
                rating: "4.8",
                views: "2.5M",
                lastUpdate: "5d"
            }})}
            {MangaCard({ manga: {
                title: "Frieren",
                image: "/manga/frieren.webp",
                genre: "Fantasia",
                genre2: "Aventura",
                rating: "5.0",
                views: "3.2M",
                lastUpdate: "6d"
            }})}
            {MangaCard({ manga: {
                title: "Mashle",
                image: "/manga/mashle.jpg",
                genre: "Comédia",
                genre2: "Fantasia",
                rating: "4.6",
                views: "1.5M",
                lastUpdate: "7d"
            }})}
            {MangaCard({ manga: {
                title: "One Punch Man",
                image: "/manga/onepunch.jpg",
                genre: "Ação",
                genre2: "Sobrenatural",
                rating: "4.8",
                views: "900K",
                lastUpdate: "1w"
            }})}
            {MangaCard({ manga: {
                title: "Mushoku Tensei",
                image: "/manga/mushoku.jpg",
                genre: "Ação",
                genre2: "Aventura",
                rating: "5.0",
                views: "200B",
                lastUpdate: "1w"
            }})}
            {MangaCard({ manga: {
                title: "Gachiakuta",
                image: "/manga/gachiakuta.jpg",
                genre: "Ação",
                genre2: "Fantasia",
                rating: "4.8",
                views: "450K",
                lastUpdate: "2w"
            }})}
            </div>
            {/* Seção de Descubra mais com tudo */}
            <div className="SectionInfo"><div className='Bar'></div><span className='SectionTitle'>Descubra Mais</span></div>
            <div className='mangaGrid'>
                {MangaCard({ isGrid: true, manga: {
                    title: "Solo Leveling",
                    image: "/manga/sololeveling.png",
                    genre: "Ação",
                    genre2: "Fantasia",
                    rating: "4.9",
                    views: "1.2M",
                    lastUpdate: "4h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "One Piece",
                    image: "/manga/onepiece.jpg",
                    genre: "Aventura",
                    genre2: "Ação",
                    rating: "5.0",
                    views: "3.5M",
                    lastUpdate: "2h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Jujutsu Kaisen",
                    image: "/manga/jujutsu.jpg",
                    genre: "Ação",
                    genre2: "Sobrenatural",
                    rating: "4.8",
                    views: "2.1M",
                    lastUpdate: "1h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Chainsaw Man",
                    image: "/manga/chainsaw.jpg",
                    genre: "Ação",
                    genre2: "Horror",
                    rating: "4.8",
                    views: "1.8M",
                    lastUpdate: "5h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Black Clover",
                    image: "/manga/blackclover.webp",
                    genre: "Ação",
                    genre2: "Fantasia",
                    rating: "4.7",
                    views: "1.1M",
                    lastUpdate: "3h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "My Hero Academia",
                    image: "/manga/myhero.jpg",
                    genre: "Aventura",
                    genre2: "Ação",
                    rating: "4.7",
                    views: "1.5M",
                    lastUpdate: "6h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Demon Slayer",
                    image: "/manga/demon.jpg",
                    genre: "Ação",
                    genre2: "Histórico",
                    rating: "4.9",
                    views: "2.8M",
                    lastUpdate: "8h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Boruto: TBV",
                    image: "/manga/boruto.jpg",
                    genre: "Ação",
                    genre2: "Aventura",
                    rating: "4.6",
                    views: "900K",
                    lastUpdate: "7h"
                }})}
                {/* Linha 2 */}
                {MangaCard({ isGrid: true, manga: {
                    title: "Dragon Ball Super",
                    image: "/manga/dragonball.jpg",
                    genre: "Ação",
                    genre2: "Sci-fi",
                    rating: "4.5",
                    views: "1.2M",
                    lastUpdate: "4h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Oshi no Ko",
                    image: "/manga/oshinoko.webp",
                    genre: "Drama",
                    genre2: "Sobrenatural",
                    rating: "4.9",
                    views: "950K",
                    lastUpdate: "9h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Kagurabachi",
                    image: "/manga/kagurabachi.jpg",
                    genre: "Ação",
                    genre2: "Sobrenatural",
                    rating: "4.8",
                    views: "800K",
                    lastUpdate: "3d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Kaiju No. 8",
                    image: "/manga/kaiju.jpg",
                    genre: "Ação",
                    genre2: "Sci-fi",
                    rating: "4.7",
                    views: "1.2M",
                    lastUpdate: "1d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Sakamoto Days",
                    image: "/manga/sakamoto.jpg",
                    genre: "Ação",
                    genre2: "Comédia",
                    rating: "4.9",
                    views: "700K",
                    lastUpdate: "2d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Dandadan",
                    image: "/manga/dandadan.jpg",
                    genre: "Ação",
                    genre2: "Sobrenatural",
                    rating: "4.9",
                    views: "1.1M",
                    lastUpdate: "4d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Blue Lock",
                    image: "/manga/bluelock.jpg",
                    genre: "Esportes",
                    genre2: "Ação",
                    rating: "4.8",
                    views: "2.5M",
                    lastUpdate: "5d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Frieren",
                    image: "/manga/frieren.webp",
                    genre: "Fantasia",
                    genre2: "Aventura",
                    rating: "5.0",
                    views: "3.2M",
                    lastUpdate: "6d"
                }})}
                {/* Linha 3 */}
                {MangaCard({ isGrid: true, manga: {
                    title: "Mashle",
                    image: "/manga/mashle.jpg",
                    genre: "Comédia",
                    genre2: "Fantasia",
                    rating: "4.6",
                    views: "1.5M",
                    lastUpdate: "7d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "One Punch Man",
                    image: "/manga/onepunch.jpg",
                    genre: "Ação",
                    genre2: "Sobrenatural",
                    rating: "4.8",
                    views: "900K",
                    lastUpdate: "1w"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Mushoku Tensei",
                    image: "/manga/mushoku.jpg",
                    genre: "Ação",
                    genre2: "Aventura",
                    rating: "5.0",
                    views: "200B",
                    lastUpdate: "1w"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Gachiakuta",
                    image: "/manga/gachiakuta.jpg",
                    genre: "Ação",
                    genre2: "Fantasia",
                    rating: "4.8",
                    views: "450K",
                    lastUpdate: "2w"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Solo Leveling",
                    image: "/manga/sololeveling.png",
                    genre: "Ação",
                    genre2: "Fantasia",
                    rating: "4.9",
                    views: "1.2M",
                    lastUpdate: "1d"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "One Piece",
                    image: "/manga/onepiece.jpg",
                    genre: "Aventura",
                    genre2: "Ação",
                    rating: "5.0",
                    views: "3.5M",
                    lastUpdate: "3h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Jujutsu Kaisen",
                    image: "/manga/jujutsu.jpg",
                    genre: "Ação",
                    genre2: "Sobrenatural",
                    rating: "4.8",
                    views: "2.1M",
                    lastUpdate: "2h"
                }})}
                {MangaCard({ isGrid: true, manga: {
                    title: "Chainsaw Man",
                    image: "/manga/chainsaw.jpg",
                    genre: "Ação",
                    genre2: "Horror",
                    rating: "4.8",
                    views: "1.8M",
                    lastUpdate: "6h"
                }})}
            </div>
            <div className="mangaGridSeeAll">
                <button>Ver Todos</button>
            </div>
        </main>
    );
}
export default Home;