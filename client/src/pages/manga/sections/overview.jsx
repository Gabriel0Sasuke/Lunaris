// CSS
import './mangasection.css'

// Icons
import label from '../../../assets/ui/label.svg';
import description from '../../../assets/ui/description.svg';
import info from '../../../assets/ui/info.svg';
import star from '../../../assets/ui/star.svg';

function Overview( { manga } ) {

    const formatarData = (dataString) => {
        if (!dataString) return 'Data desconhecida';
        const data = new Date(dataString);
        if (isNaN(data)) return 'Data desconhecida';
        return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    const formatarStatus = (status) => {
        switch (status) {
            case 'ongoing':
                return 'Em andamento';
            case 'completed':
                return 'Completo';
            case 'hiatus':
                return 'Hiato';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status || 'Status desconhecido';
        }
    };

    const formatarTipo = (tipo) => {
        switch (tipo) {
            case 'manga':
                return 'Mangá';
            case 'manhwa':
                return 'Manhwa';
            case 'manhua':
                return 'Manhua';
            default:
                return tipo || 'Tipo desconhecido';
        }
    };

    const formatarDemografia = (demografia) => {
        switch (demografia) {
            case 'shounen':
                return 'Shounen';
            case 'shoujo':
                return 'Shoujo';
            case 'seinen':
                return 'Seinen';
            case 'josei':
                return 'Josei';
            default:
                return demografia || 'Demografia desconhecida';
        }
    };

    return(
        <div className='MangaSection'>
            <div className="MangaSynopse">
                <h2><img src={description} alt="Description" /> Sinopse</h2>

                <p className='MangaSynopseText'>{manga?.sinopse}</p>

                <div className="MangaSynopseLine"></div>

                <div className="MangaSynopseExtra">
                    <div className="MangaSynopseExtraItem">
                        <div className="MangaSynopseExtraItemLabel">Status</div>
                        <div className="MangaSynopseExtraItemValue">{formatarStatus(manga?.status)}</div>
                    </div>
                    <div className="MangaSynopseExtraItem">
                        <div className="MangaSynopseExtraItemLabel">Lançamento</div>
                        <div className="MangaSynopseExtraItemValue">{formatarData(manga?.releasedate)}</div>
                    </div>
                    <div className="MangaSynopseExtraItem">
                        <div className="MangaSynopseExtraItemLabel">Autor</div>
                        <div className="MangaSynopseExtraItemValue">{manga?.autor}</div>
                    </div>
                    <div className="MangaSynopseExtraItem">
                        <div className="MangaSynopseExtraItemLabel">Artista</div>
                        <div className="MangaSynopseExtraItemValue">{manga?.artista}</div>
                    </div>
                </div> 
            </div>

            <div className="MangaInfo">
                <h2><img src={info} alt="Info" /> Informações</h2>

                <div className="MangaInfoItems">
                    <div className="MangaInfoItem">
                        <div className="MangaInfoItemLabel">Tipo</div>
                        <div className="MangaInfoItemValue">{formatarTipo(manga?.tipo)}</div>
                    </div>
                    <div className="MangaInfoItem">
                        <div className="MangaInfoItemLabel">Demografia</div>
                        <div className="MangaInfoItemValue">{formatarDemografia(manga?.demografia)}</div>
                    </div>
                </div>
            </div>

            <div className="MangaTags">
                <h2><img src={label} alt="Tags" /> Tags</h2>
                <div className="MangaTagsItems">
                    {manga?.tags && manga.tags.length > 0 ? (
                        manga.tags.map((tag, index) => (
                            <div className="MangaTag" key={`${tag?.name || 'tag'}-${index}`} title={tag?.name || 'Tag'}>
                                {tag?.icon ? (
                                    <img
                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(tag.icon)}`}
                                        alt={tag?.name || 'Tag'}
                                        className="MangaTagIcon"
                                    />
                                ) : (
                                    <img src={star} alt="Tag" className="MangaTagIcon" />
                                )}
                                <span className="MangaTagText">{tag?.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="MangaTagsEmpty">Nenhuma tag disponível.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Overview;