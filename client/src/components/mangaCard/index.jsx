import './mangaCard.css';

//UI
import star from '../../assets/ui/star.svg';
import eye from '../../assets/ui/eye.svg';
import clock from '../../assets/ui/clock.svg'; 

function MangaCard( { manga, isGrid } ) {
    return (
        <div className={`mangaCard no-select ${isGrid ? 'grid-mode' : ''}`}>
                    <div className='mangaCardImage'>
                        <img src={manga.image} alt={manga.title} />
                         <div className='mangaCardImageTags'>
                        <div className="CardImageTag">{manga.genre}</div>
                        <div className="CardImageTag">{manga.genre2}</div>
                        </div>
                    </div>
                    <div className='mangaCardInfo' >
                        <h3>{manga.title}</h3>
                        <div className='mangaCardSubInfo'>
                            <div className='mangaCardTag'><img src={star} alt="star" />{manga.rating}</div> {/* Avaliação */}
                            <div className='mangaCardTag'><img src={eye} alt="eye" />{manga.views}</div> {/* Número de views */}
                            <div className='mangaCardTag'><img src={clock} alt="clock" />{manga.lastUpdate}</div> {/* Tempo desde o lançamento do último capítulo */}
                        </div>
                    </div>
                </div>
    );
}
export default MangaCard;
