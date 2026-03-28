//CSS
import './manga.css';

//Imagens
import star from '../../assets/ui/star.svg';
import openBook from '../../assets/ui/openbook.svg';
import bookmark from '../../assets/ui/bookmark.svg';
import bookmarkadded from '../../assets/ui/bookmarkadded.svg';
import bookmarkremove from '../../assets/ui/bookmarkremove.svg';
import share from '../../assets/ui/share.svg';
import loading from '../../assets/ui/loading.svg';
import more from '../../assets/ui/more.svg';
import trash from '../../assets/ui/trash.svg';
import edit from '../../assets/ui/edit.svg';

// React
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigateTo } from '../../utils/navigateTo';
import { useAuth } from '../../context/AuthContext';

//Services
import { notify } from '../../services/notify';
import { mangaFormatter } from '../../utils/mangaFormatter';
import { mangaAPI } from '../../services/mangaapi';
import ConfirmationPortal from '../../components/confirmationPortal';

//Sections
import Overview from './sections/overview';
import MangaChapters from './sections/mangachapters';
import MangaComments from './sections/mangacomments';
import LoginRequiredPortal from '../../components/loginRequiredPortal';
import AvaliationPortal from '../../components/avaliationPortal';

const viewedMangaGuard = new Set();

function Manga(){
    const { usuario } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');
    const { id } = useParams();
    const navigateTo = useNavigateTo();
    const [manga, setManga] = useState(null);
    const MAX_VISIBLE_TAGS = 5;
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkProcessing, setBookmarkProcessing] = useState(false);
    const [bookmarkHover, setBookmarkHover] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [avaliationOpen, setAvaliationOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

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

    const allTags = tagsFromBackend.length > 0 ? tagsFromBackend : fallbackTags;
    const visibleTags = allTags.slice(0, MAX_VISIBLE_TAGS);
    const remainingTags = Math.max(allTags.length - MAX_VISIBLE_TAGS, 0);

    const link = (path) => {
        navigateTo(path);
    }

    // Efeito para carregar os detalhes do mangá quando o componente é montado ou quando o ID muda
    useEffect(() => {
        //Tratamento do ID
        const mangaId = parseInt(id);
        if(!mangaId) return link('/404');
        if(mangaId < 0) return link('/404');
        if(!Number.isInteger(mangaId)) return link('/404');

        // Pegar os dados do mangá usando o ID
        const fetchManga = async () => {
            try {
                const data = await mangaAPI.getMangaById({ id: mangaId });
                setManga(data.manga);
            } catch (error) {
                notify.error('Erro ao carregar detalhes do mangá');
                return link('/404');
            }
        };
        // Função para aumentar a contagem de views do mangá
        const incrementViews = async () => {
            const guardKey = `manga-view-${mangaId}`;

            // Evita duplicar contagem no StrictMode (dev) e em remounts rápidos.
            if (viewedMangaGuard.has(guardKey)) return;
            viewedMangaGuard.add(guardKey);

            try {
                await mangaAPI.addView({ id: mangaId });
            } catch (error) {
                return console.error('Erro ao incrementar visualizações do mangá');
            }
        };
        // Função para checar se o usúario ja deu bookmark nesse mangá
        const checkBookmark = async () => {
            try {
                const data = await mangaAPI.checkBookmark({ id: mangaId });
                setBookmarked(Boolean(data?.bookmarked));
            } catch (error) {
                return
            }
        };
                
        fetchManga();
        incrementViews();
        checkBookmark();
    }, [id]);

    const bookmarkHandler = async () => {
        if (bookmarkProcessing || !manga?.id) return;
        if (!usuario?.id) {
            setLoginPromptOpen(true);
            return;
        }
        try {
            setBookmarkHover(false);
            setBookmarkProcessing(true);
            const data = await mangaAPI.toggleBookmark({ id: manga.id });
            setBookmarked((prev) => !prev);
            notify.success(data.message);
        } catch (error) {
            notify.error('Erro ao atualizar bookmark');
        }finally{
            setBookmarkProcessing(false);
        }
    };

    const handleDeleteManga = async () => {
        try {
            setConfirmationOpen(false);
            await mangaAPI.deleteManga({ id: manga.id });
            notify.success('Mangá deletado com sucesso!');
            link('/');
        } catch (error) {
            notify.error('Erro ao deletar mangá');
        }
    };

    return(
        <main className='manga-content'>
            <div className="MangaBackgroundBanner"><img src={manga?.banner} alt={manga?.titulo} /></div>

            <div className="MangaHeader">
                <div className="MangaHeaderCover"><img src={manga?.foto} alt={manga?.titulo} /></div>
                <div className="MangaHeaderInfo">

                    <div className="MangaHeaderInfoStatus">
                        {mangaFormatter.formatHeaderStatus(manga?.status)}
                    </div>
                    <h1 className="MangaHeaderInfoTitle">{manga?.titulo}</h1>
                
                    <div className="MangaHeaderInfoCreators">
                        <div className="MangaHeaderInfoCreator">
                            <span className="MangaHeaderInfoCreatorLabel">Autor:</span>
                            <span className="MangaHeaderInfoCreatorValue">{manga?.autor}</span>
                        </div>
                        <div className='InfoCreatorLine'></div>
                        <div className="MangaHeaderInfoCreator">
                            <span className="MangaHeaderInfoCreatorLabel">Artista:</span>
                            <span className="MangaHeaderInfoCreatorValue">{manga?.artista}</span>
                        </div>
                    </div>

                    <div className="MangaHeaderInfoStatistics">
                        <div className="MangaHeaderInfoStatistic">
                            <span className="MangaHeaderInfoStatisticLabel">Rank</span>
                            <span className="MangaHeaderInfoStatisticValue">#{manga?.rank_position || 0}</span>
                        </div>
                        <div className="MangaHeaderInfoStatistic">
                            <span className="MangaHeaderInfoStatisticLabel">Rating</span>
                            <span className="MangaHeaderInfoStatisticValue">4.5</span>
                            <img src={star} alt="Star" />
                        </div>
                        <div className="MangaHeaderInfoStatistic">
                            <span className="MangaHeaderInfoStatisticLabel">Views</span>
                            <span className="MangaHeaderInfoStatisticValue">{manga?.views || 0}</span>
                        </div>
                        <div className="MangaHeaderInfoStatistic">
                            <span className="MangaHeaderInfoStatisticLabel">Favs</span>
                            <span className="MangaHeaderInfoStatisticValue">{manga?.bookmarks || 0}</span>
                        </div>
                    </div>

                    <div className="MangaHeaderInfoGenres">
                        {visibleTags.map((tag) => (
                            <div className="MangaHeaderInfoGenre" key={tag.name} title={tag.name}>
                                {tag.icon ? (
                                    <img src={`data:image/svg+xml;utf8,${encodeURIComponent(tag.icon)}`} alt={tag.name} className="MangaHeaderInfoGenreIcon" />
                                ) : (
                                    <img src={star} alt="Tag" />
                                )}
                                <span className="MangaHeaderInfoGenreText">{tag.name}</span>
                            </div>
                        ))}
                        {remainingTags > 0 && (
                            <div className="MangaHeaderInfoGenre MangaHeaderInfoGenreMore">+{remainingTags}</div>
                        )}
                    </div>

                    <div className="MangaHeaderInfoActions">
                        <button className="MangaHeaderInfoAction">
                            <img src={openBook} alt="Open Book" />
                            Começar Leitura
                        </button>
                        <button className="MangaHeaderInfoAction" onClick={bookmarkHandler} disabled={bookmarkProcessing || !manga?.id} onMouseEnter={() => !bookmarkProcessing && setBookmarkHover(true)} onMouseLeave={() => setBookmarkHover(false)}>
                            <img src={bookmarkProcessing ? loading : (bookmarked ? (bookmarkHover ? bookmarkremove : bookmarkadded) : bookmark)} alt="Bookmark" />
                            {bookmarkProcessing ? '' : (bookmarked ? (bookmarkHover ? 'Remover da lista' : 'Adicionado à lista') : 'Adicionar à lista')}
                        </button>
                        <button className="MangaHeaderInfoAction" onClick={() => {
                            if(!usuario?.id){
                                setLoginPromptOpen(true);
                                return;
                            }
                            setAvaliationOpen(true);
                        }}>
                            <img src={star} alt="Avaliar" />
                            Avaliar
                        </button>
                        <button className="MangaHeaderInfoAction">
                            <img src={share} alt="Share" />
                        </button>
                        {(usuario?.account_type === 'admin' || usuario?.account_type === 'scan') && (
                            <button className="MangaHeaderInfoAction" onClick={() => setMoreOpen(!moreOpen)}>
                                <img src={more} alt="Mais" />
                            </button>
                        )}
                        {moreOpen && (
                            <div className="MangaHeaderInfoMore">
                                <button className="MangaHeaderInfoMoreItem">
                                    <img src={edit} alt="Editar" />
                                    Editar
                                </button>
                                <button className="MangaHeaderInfoMoreItem" onClick={() => { setMoreOpen(false); setConfirmationOpen(true); }}>
                                    <img src={trash} alt="Deletar" />
                                    Deletar
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <nav className="MangaSectionsNav" aria-label="Navegação das seções do mangá">
                <button className={`MangaSectionsNavItem ${activeSection === 'overview' ? 'is-active' : ''}`} type="button" onClick={() => setActiveSection('overview')}>
                    Visão Geral
                </button>
                <button className={`MangaSectionsNavItem ${activeSection === 'chapters' ? 'is-active' : ''}`} type="button" onClick={() => setActiveSection('chapters')}>
                    Capitulos
                    <span className="MangaSectionsNavPill">0</span>
                </button>
                <button className={`MangaSectionsNavItem ${activeSection === 'comments' ? 'is-active' : ''}`} type="button" onClick={() => setActiveSection('comments')}>
                    Comentários
                    <span className="MangaSectionsNavPill">8.9k</span>
                </button>
                <button className={`MangaSectionsNavItem ${activeSection === 'recommendations' ? 'is-active' : ''}`} type="button" onClick={() => setActiveSection('recommendations')}>
                    Recomendações
                </button>
            </nav>
            {activeSection === 'overview' && <Overview manga={manga} />}
            {activeSection === 'chapters' && <MangaChapters manga={manga} />}
            {activeSection === 'comments' && <MangaComments manga={manga} />}

            <LoginRequiredPortal
                isOpen={loginPromptOpen}
                onCancel={() => setLoginPromptOpen(false)}
                onConfirm={() => {
                    setLoginPromptOpen(false);
                    link('/login');
                }}
            />

            <AvaliationPortal
                isOpen={avaliationOpen}
                title={manga?.titulo}
                onCancel={() => setAvaliationOpen(false)}
                onConfirm={(rating) => {
                    setAvaliationOpen(false);
                    mangaAPI.submitRating({ id: manga.id, usuario: usuario.id, rating })
                    notify.success('Avaliação enviada com sucesso!');
                }}
            />

            <ConfirmationPortal
                isOpen={confirmationOpen}
                title={`Deletar ${manga?.titulo}`}
                message={`Tem certeza que deseja deletar o mangá "${manga?.titulo}"? Essa ação não pode ser desfeita.`}
                confirmLabel="Deletar"
                onConfirm={handleDeleteManga}
                onCancel={() => setConfirmationOpen(false)}
            />
        </main>
    )
}
export default Manga;
