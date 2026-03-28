// CSS
import './mangasection.css'

// Icons
import label from '../../../assets/ui/label.svg';
import description from '../../../assets/ui/description.svg';
import info from '../../../assets/ui/info.svg';
import star from '../../../assets/ui/star.svg';
import { mangaFormatter } from '../../../utils/mangaFormatter';

function Overview( { manga } ) {
    const tagsFromBackend = Array.isArray(manga?.tags)
        ? manga.tags
            .map((tag) => ({
                name: String(tag?.name || '').trim(),
                icon: String(tag?.icon || '').trim()
            }))
            .filter((tag) => tag.name)
        : [];

    const fallbackTags = (manga?.tag_names || '')
        .split('||')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((name) => ({ name, icon: '' }));

    const tags = tagsFromBackend.length > 0 ? tagsFromBackend : fallbackTags;

    return(
        <div className='MangaSection'>
            <div className="MangaSynopse">
                <h2><img src={description} alt="Description" /> Sinopse</h2>

                <p className='MangaSynopseText'>{manga?.sinopse}</p>

                <div className="MangaSynopseLine"></div>

                <div className="MangaSynopseExtra">
                    <div className="MangaSynopseExtraItem">
                        <div className="MangaSynopseExtraItemLabel">Status</div>
                        <div className="MangaSynopseExtraItemValue">{mangaFormatter.formatStatus(manga?.status)}</div>
                    </div>
                    <div className="MangaSynopseExtraItem">
                        <div className="MangaSynopseExtraItemLabel">Lançamento</div>
                        <div className="MangaSynopseExtraItemValue">{mangaFormatter.formatDateMonth(manga?.releasedate)}</div>
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
                        <div className="MangaInfoItemValue">{mangaFormatter.formatType(manga?.tipo)}</div>
                    </div>
                    <div className="MangaInfoItem">
                        <div className="MangaInfoItemLabel">Demografia</div>
                        <div className="MangaInfoItemValue">{mangaFormatter.formatDemographic(manga?.demografia)}</div>
                    </div>
                </div>
            </div>

            <div className="MangaTags">
                <h2><img src={label} alt="Tags" /> Tags</h2>
                <div className="MangaTagsItems">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
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