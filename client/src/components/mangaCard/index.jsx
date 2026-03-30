import './mangaCard.css';
import { useNavigateTo } from '../../hooks/useNavigateTo';
//UI
import star from '../../assets/ui/starfull.svg';
import eye from '../../assets/ui/eye.svg';
import clock from '../../assets/ui/clock.svg'; 

function MangaCard( { manga, isGrid, isLoading } ) {
    const navigateTo = useNavigateTo();
    const onClick = (path) => {
        navigateTo(path);
    }
    return (
        <div className={`mangaCard no-select ${isGrid ? 'grid-mode' : ''}`} onClick={() => !isLoading && manga?.id && onClick(`/manga/${manga.id}`)}>
                    <div className='mangaCardImage'>
                        {!isLoading ? <img src={manga.image} alt={manga.title} /> : <div className='skeletonImage'> </div>}
                        <div className='mangaCardImageTags'>
                            {!isLoading ? <div className="CardImageTag">{manga.genre}</div> : <div className='skeletonGenre'></div>}
                            {!isLoading ? <div className="CardImageTag">{manga.genre2}</div> : <div className='skeletonGenre'></div>}
                        </div>
                    </div>
                    <div className='mangaCardInfo' >
                        {!isLoading ? <h3>{manga.title}</h3> : <div className='skeletonTitle'></div>}
                        <div className='mangaCardSubInfo'>
                            {!isLoading ? <div className='mangaCardTag'><img src={star} alt="star" />{manga.rating}</div> : <div className='skeletonCardTag'></div>} {/* Avaliação */}
                            {!isLoading ? <div className='mangaCardTag'><img src={eye} alt="eye" />{manga.views}</div> : <div className='skeletonCardTag'></div>} {/* Número de views */}
                            {!isLoading ? <div className='mangaCardTag'><img src={clock} alt="clock" />{manga.lastUpdate}</div> : <div className='skeletonCardTag'></div>} {/* Tempo desde o lançamento do último capítulo */}
                        </div>
                    </div>
                </div>
    );
}
export default MangaCard;
