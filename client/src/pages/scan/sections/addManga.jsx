import React, { useEffect, useRef, useState } from 'react';
import './ScanSections.css';
import Cropper from 'react-easy-crop';
import { createPortal } from 'react-dom';
import { notify } from '../../../services/notify';
import { cropImage } from '../../../services/cropImage';
import { API_URL } from '../../../services/api';
// Icons
import photo from '../../../assets/ui/photo.svg';
import panorama from '../../../assets/ui/panorama.svg';
import photoAdd from '../../../assets/ui/photoAdd.svg';
import openBook from '../../../assets/ui/openBook.svg';
import description from '../../../assets/ui/description.svg';
import trash from '../../../assets/ui/trash.svg';
import list from '../../../assets/ui/list.svg';

import loading from '../../../assets/ui/loading.svg';

function AddManga({ onManageTags }) {
    const coverInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const [mangaTitle, setMangaTitle] = useState('');
    const [mangaSynopsis, setMangaSynopsis] = useState('');
    const [mangaType, setMangaType] = useState('');
    const [mangaDemographic, setMangaDemographic] = useState('');
    const [mangaReleaseDate, setMangaReleaseDate] = useState('');
    const [mangaStatus, setMangaStatus] = useState('');
    const [mangaAuthor, setMangaAuthor] = useState('');
    const [mangaArtist, setMangaArtist] = useState('');
    const [genresInput, setGenresInput] = useState([]);
    const [genresTouched, setGenresTouched] = useState(false);

    // Imagens
    const [mangaPhoto, setMangaPhoto] = useState(null);
    const [mangaBanner, setMangaBanner] = useState(null);
    const [URLmangaPhoto, setURLMangaPhoto] = useState('');
    const [URLmangaBanner, setURLMangaBanner] = useState('');
    const [isCropping, setIsCropping] = useState('');
    const [isDraggingCover, setIsDraggingCover] = useState(false);
    const [isDraggingBanner, setIsDraggingBanner] = useState(false);

    const [TAG_OPTIONS, setTAG_OPTIONS] = useState([]);

    //React Easy Crop
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const hojeIso = new Date().toISOString().split('T')[0];

    const tituloValido = mangaTitle.trim().length > 0 && mangaTitle.trim().length <= 100;
    const sinopseValida = mangaSynopsis.trim().length > 0;
    const tipoValido = mangaType.trim().length > 0 && mangaType.trim().length <= 20;
    const demografiaValida = mangaDemographic.trim().length > 0 && mangaDemographic.trim().length <= 20;
    const dataValida = mangaReleaseDate !== '' && mangaReleaseDate <= hojeIso;
    const statusValido = mangaStatus.trim().length > 0 && mangaStatus.trim().length <= 20;
    const autorValido = mangaAuthor.trim().length > 0 && mangaAuthor.trim().length <= 100;
    const artistaValido = mangaArtist.trim().length > 0 && mangaArtist.trim().length <= 100;
    const generosValidos = genresInput.length > 0;

    const formularioValido =
        tituloValido &&
        sinopseValida &&
        tipoValido &&
        demografiaValida &&
        dataValida &&
        statusValido &&
        autorValido &&
        artistaValido &&
        generosValidos;

        useEffect(() => {
            const fetchTags = async () => {
                try {
                    const resposta = await fetch(`${API_URL}/tag/list`, {
                        credentials: 'include',
                    });
                if (!resposta.ok) {
                    throw new Error('Erro ao buscar tags.');
                }
                const responseData = await resposta.json();
                const tagsArray = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.tag)
                        ? responseData.tag
                        : [];

                const normalizedTags = tagsArray.map((tag) => ({
                    value: String(tag.id || tag.value || tag.slug || tag.name),
                    label: tag.name || tag.label || String(tag.slug || tag.value || tag.id)
                }));

                setTAG_OPTIONS(normalizedTags);
                } catch (error) {
                    notify.error('Erro ao buscar tags.');
                    setTAG_OPTIONS([]);
                }
            }
            fetchTags();
        }, []);

    const handleCoverFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type && !file.type.startsWith('image/')) {
            notify.error('Por favor, selecione um arquivo de imagem válido para a capa.');
            return;
        }
        if (file.size > 3 * 1024 * 1024) { // 3MB
            notify.error('O arquivo de capa deve ser menor que 3MB.');
            return;
        }
        const URLfile = URL.createObjectURL(file);
        setMangaPhoto(file);
        setURLMangaPhoto(URLfile);
        setIsCropping('cover');
    };

    const handleBannerFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type && !file.type.startsWith('image/')) {
            notify.error('Por favor, selecione um arquivo de imagem válido para o banner.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            notify.error('O arquivo de banner deve ser menor que 5MB.');
            return;
        }
        const URLfile = URL.createObjectURL(file);
        setMangaBanner(file);
        setURLMangaBanner(URLfile);
        setIsCropping('banner');
    };

    const handleCoverDrop = (event) => {
        event.preventDefault();
        setIsDraggingCover(false);
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        if (file.type && !file.type.startsWith('image/')) {
            notify.error('Por favor, selecione um arquivo de imagem válido para a capa.');
            return;
        }
        if (file.size > 3 * 1024 * 1024) { // 3MB
            notify.error('O arquivo de capa deve ser menor que 3MB.');
            return;
        }
        const URLfile = URL.createObjectURL(file);
        setMangaPhoto(file);
        setURLMangaPhoto(URLfile);
        setIsCropping('cover');
    };

    const handleBannerDrop = (event) => {
        event.preventDefault();
        setIsDraggingBanner(false);
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        if (file.type && !file.type.startsWith('image/')) {
            notify.error('Por favor, selecione um arquivo de imagem válido para o banner.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            notify.error('O arquivo de banner deve ser menor que 5MB.');
            return;
        }
        const URLfile = URL.createObjectURL(file);
        setMangaBanner(file);
        setURLMangaBanner(URLfile);
        setIsCropping('banner');
    };

    const handleGenreToggle = (value) => {
        setGenresTouched(true);
        setGenresInput((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleDiscard = () => {
        setMangaTitle('');
        setMangaSynopsis('');
        setMangaType('');
        setMangaDemographic('');
        setMangaReleaseDate('');
        setMangaStatus('');
        setMangaAuthor('');
        setMangaArtist('');
        setMangaPhoto(null);
        setMangaBanner(null);
        setURLMangaPhoto('');
        setURLMangaBanner('');
        setGenresInput([]);
        setGenresTouched(false);

        // Limpar objetos URL para evitar vazamento de memória
        if (URLmangaPhoto) {
            URL.revokeObjectURL(URLmangaPhoto);
        }
        if (URLmangaBanner) {
            URL.revokeObjectURL(URLmangaBanner);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }
    const handleCropConfirm = async () => {
        try{
            const {blob, previewURL} = await cropImage(isCropping === 'cover' ? URLmangaPhoto : URLmangaBanner, croppedAreaPixels);
            if(isCropping === 'cover') {
                const croppedFile = new File([blob], mangaPhoto.name, { type: blob.type });
                URL.revokeObjectURL(URLmangaPhoto);
                setMangaPhoto(croppedFile);
                setURLMangaPhoto(previewURL);
            }else if(isCropping === 'banner') {
                const croppedFile = new File([blob], mangaBanner.name, { type: blob.type });
                URL.revokeObjectURL(URLmangaBanner);
                setMangaBanner(croppedFile);
                setURLMangaBanner(previewURL);
            }
        } catch (error) {
            notify.error('Erro ao recortar a imagem.');
        }finally{
            setCroppedAreaPixels(null);
            setIsCropping('');
        }
    }

    const handleCropDiscard = () => {
        if(isCropping === 'cover') {
            setMangaPhoto(null);
            setURLMangaPhoto('');
        }else if(isCropping === 'banner') {
            setMangaBanner(null);
            setURLMangaBanner('');
        }
        setCroppedAreaPixels(null);
        setIsCropping('');
    }

    const cropModal = isCropping ? createPortal(
        <div className="AddMangaModalCrop">
            <div className="CropModalCard">
                <div className="CropStage">
                    <Cropper
                        image={isCropping === 'cover' ? URLmangaPhoto : URLmangaBanner}
                        crop={crop}
                        zoom={zoom}
                        aspect={isCropping === 'cover' ? 2 / 3 : 21 / 9}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="CropActions">
                    <button onClick={handleCropConfirm}>Confirmar</button>
                    <button onClick={handleCropDiscard}>Cancelar</button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formularioValido) {
            notify.error('Por favor, preencha todos os campos corretamente antes de enviar.');
            return;
        }
        setIsLoading(true);
        const data = new FormData();
        data.append('title', mangaTitle.trim());
        data.append('synopsis', mangaSynopsis.trim());
        data.append('type', mangaType.trim());
        data.append('demographic', mangaDemographic.trim());
        data.append('releaseDate', mangaReleaseDate);
        data.append('status', mangaStatus.trim());
        data.append('author', mangaAuthor.trim());
        data.append('artist', mangaArtist.trim());
        genresInput.forEach((genre) => data.append('genres[]', genre));
        data.append('cover', mangaPhoto);
        data.append('banner', mangaBanner);

        try{
            const resposta = await fetch(`${API_URL}/manga/create`, {
                method: 'POST',
                credentials: 'include',
                body: data
            });
            const msg = await resposta.json();
            if(!resposta.ok) return notify.error(msg.message);
            notify.success(msg.message);
            handleDiscard();
        }catch(error) {
            notify.error('Erro ao adicionar o mangá. Por favor, tente novamente.');
        }finally{
            setIsLoading(false);
            handleCropDiscard();
        }
    }
    return (
        <div className="AddManga">
            <div className="ScanSectionTitle">
                <div className="ScanSectionTitleImg"><img src={photo} alt="Seção de Assets Visuais" /></div>
                <div className='ScanSectionTitleLegend'><h3>Assets Visuais</h3></div>
            </div>

            <div className="AddMangaVisual">
                <div className="AddMangaVisualPortrait">
                    <h4>Capa em Formato Retrato</h4>
                    <div
                        className={`PortraitExample ${URLmangaPhoto ? 'hasPreview' : ''}`}
                        onClick={() => coverInputRef.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDragEnter={() => setIsDraggingCover(true)}
                        onDragLeave={() => setIsDraggingCover(false)}
                        onDrop={handleCoverDrop}
                    >
                        {URLmangaPhoto ? (
                            <>
                                <img className="PortraitPreviewImage" src={URLmangaPhoto} alt="Preview da capa" />
                                <div className="PreviewOverlay">
                                    <span>{isDraggingCover ? 'Solte o arquivo para prosseguir' : 'Clique para trocar a capa'}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='PortraitExampleImg'><img src={photoAdd} alt="Seleção de Imagem" /></div>
                                <h5>Adicionar Capa</h5>
                                <span>{isDraggingCover ? 'Solte o arquivo para prosseguir' : 'Aspecto 2:3 (máximo de 3MB)'}</span>
                            </>
                        )}
                    </div>
                    <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverFileChange} onDrop={handleCoverFileChange} onDragOver={(e) => e.preventDefault()} style={{ display: 'none' }} />
                </div>
                <div className="AddMangaVisualLandscape">
                    <h4>Capa em Formato Paisagem</h4>
                    <div
                        className={`LandscapeExample ${URLmangaBanner ? 'hasPreview' : ''}`}
                        onClick={() => bannerInputRef.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDragEnter={() => setIsDraggingBanner(true)}
                        onDragLeave={() => setIsDraggingBanner(false)}
                        onDrop={handleBannerDrop}
                    >
                        {URLmangaBanner ? (
                            <>
                                <img className="LandscapePreviewImage" src={URLmangaBanner} alt="Preview do banner" />
                                <div className="PreviewOverlay">
                                    <span>{isDraggingBanner ? 'Solte o arquivo para prosseguir' : 'Clique para trocar o banner'}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='LandscapeExampleImg'><img src={panorama} alt="Seleção de Imagem" /></div>
                                <h5>Adicionar Capa</h5>
                                <span>{isDraggingBanner ? 'Solte o arquivo para prosseguir' : 'Aspecto 21:9 (máximo de 5MB)'}</span>
                            </>
                        )}
                    </div>
                    <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerFileChange} onDrop={handleBannerFileChange} onDragOver={(e) => e.preventDefault()} style={{ display: 'none' }} />
                </div>
            </div>

            <div className="ScanSectionTitle">
                <div className="ScanSectionTitleImg"><img src={openBook} alt="Seção de Informações Gerais" /></div>
                <div className='ScanSectionTitleLegend'><h3>Informações Gerais</h3></div>
            </div>

            <div className="AddMangaGeneralInfo">
                <div className="AddMangaGeneralInfoField">
                    <label htmlFor="mangaTitle">Título do Mangá</label>
                    {!tituloValido && mangaTitle ? <span className='FieldInvalidMessage'>Título obrigatório e com máximo de 100 caracteres.</span> : ''}
                    <input className={!tituloValido && mangaTitle ? 'FieldInvalid' : ''} type="text" id="mangaTitle" placeholder="Digite o título do mangá" value={mangaTitle} onChange={(event) => setMangaTitle(event.target.value)} />
                </div>
                <div className="AddMangaDualGeneralInfoField">
                    <div className="AddMangaDualField">
                        <label htmlFor="mangaAuthor">Autor</label>
                        {!autorValido && mangaAuthor ? <span className='FieldInvalidMessage'>Autor deve ter entre 1 e 100 caracteres.</span> : ''}
                        <input className={!autorValido && mangaAuthor ? 'FieldInvalid' : ''} type="text" id="mangaAuthor" placeholder="Digite o nome do autor" value={mangaAuthor} onChange={(event) => setMangaAuthor(event.target.value)} />
                    </div>
                    <div className="AddMangaDualField">
                        <label htmlFor="mangaArtist">Artista</label>
                        {!artistaValido && mangaArtist ? <span className='FieldInvalidMessage'>Artista deve ter entre 1 e 100 caracteres.</span> : ''}
                        <input className={!artistaValido && mangaArtist ? 'FieldInvalid' : ''} type="text" id="mangaArtist" placeholder="Digite o nome do artista" value={mangaArtist} onChange={(event) => setMangaArtist(event.target.value)} />
                    </div>
                </div>
                <div className="AddMangaGeneralInfoField">
                    <label htmlFor="mangaDate">Data de Lançamento</label>
                    {!dataValida && mangaReleaseDate ? <span className='FieldInvalidMessage'>Data inválida. Use uma data igual ou anterior a hoje.</span> : ''}
                    <input className={!dataValida && mangaReleaseDate ? 'FieldInvalid' : ''} type="date" id="mangaDate" max={hojeIso} value={mangaReleaseDate} onChange={(event) => setMangaReleaseDate(event.target.value)} />
                </div>
                <div className="AddMangaGeneralInfoField">
                    <label htmlFor="mangaSynopsis">Sinopse</label>
                    {!sinopseValida && mangaSynopsis ? <span className='FieldInvalidMessage'>Sinopse não pode ser vazia.</span> : ''}
                    <textarea className={!sinopseValida && mangaSynopsis ? 'FieldInvalid' : ''} id="mangaSynopsis" placeholder="Escreva uma breve sinopse do mangá" value={mangaSynopsis} onChange={(event) => setMangaSynopsis(event.target.value)}></textarea>
                </div>
            </div>

            <div className="ScanSectionTitle">
                <div className="ScanSectionTitleImg"><img src={description} alt="Seção de Metadata" /></div>
                <div className='ScanSectionTitleLegend'><h3>Metadata</h3></div>
            </div>

            <div className="AddMangaMetadata">
                <div className="AddMangaTripleMetadataField">
                    <div className="AddMangaMetadataField">
                        <label htmlFor="mangaType">Tipo</label>
                        {!tipoValido && mangaType ? <span className='FieldInvalidMessage'>Tipo deve ter no máximo 20 caracteres.</span> : ''}
                        <select className={!tipoValido && mangaType ? 'FieldInvalid' : ''} name="mangaType" id="mangaType" value={mangaType} onChange={(event) => setMangaType(event.target.value)}>
                            <option value="" disabled>Selecione o tipo</option>
                            <option value="manga">Mangá (JP)</option>
                            <option value="manhua">Manhua (CN)</option>
                            <option value="manhwa">Manhwa (KR)</option>
                            <option value="comic">WebToon</option>
                            <option value="novel">Novel</option>
                        </select>
                    </div>
                    <div className="AddMangaMetadataField">
                        <label htmlFor="mangaDemographic">Demografia</label>
                        {!demografiaValida && mangaDemographic ? <span className='FieldInvalidMessage'>Demografia deve ter no máximo 20 caracteres.</span> : ''}
                        <select className={!demografiaValida && mangaDemographic ? 'FieldInvalid' : ''} name="mangaDemographic" id="mangaDemographic" value={mangaDemographic} onChange={(event) => setMangaDemographic(event.target.value)}>
                            <option value="" disabled>Selecione a demografia</option>
                            <option value="kodomo">Kodomo</option>
                            <option value="shounen">Shounen</option>
                            <option value="shoujo">Shoujo</option>
                            <option value="seinen">Seinen</option>
                            <option value="josei">Josei</option>
                        </select>
                    </div>
                    <div className="AddMangaMetadataField">
                        <label htmlFor="mangaStatus">Status</label>
                        {!statusValido && mangaStatus ? <span className='FieldInvalidMessage'>Status deve ter no máximo 20 caracteres.</span> : ''}
                        <select className={!statusValido && mangaStatus ? 'FieldInvalid' : ''} name="mangaStatus" id="mangaStatus" value={mangaStatus} onChange={(event) => setMangaStatus(event.target.value)}>
                            <option value="" disabled>Selecione o status</option>
                            <option value="ongoing">Em andamento</option>
                            <option value="completed">Completo</option>
                            <option value="hiatus">Em hiato</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </div>
                <div className="AddMangaSingleMetadataField">
                    <label htmlFor="mangaGenres">Gêneros</label>
                    {genresTouched && !generosValidos ? <span className='FieldInvalidMessage'>Selecione pelo menos um gênero válido.</span> : ''}
                    <div className={`GenresCheckboxList ${genresTouched && !generosValidos ? 'FieldInvalid' : ''}`} id="mangaGenres">
                        {TAG_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className={`GenreCheckboxItem ${genresInput.includes(option.value) ? 'selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={genresInput.includes(option.value)}
                                    onChange={() => handleGenreToggle(option.value)}
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                    <button type="button" className="AddNewTagLink" onClick={() => onManageTags?.()}>Gerenciar Tags</button>
                    <div className="AddMangaMetadataGenreDisplay">
                        {genresInput.length > 0 ? (
                            genresInput.map((genre) => (
                                <span key={genre} className="GenreChip">{TAG_OPTIONS.find((option) => option.value === genre)?.label || genre}</span>
                            ))
                        ) : (
                            <span className="GenreHint">As tags selecionadas aparecerão aqui</span>
                        )}
                    </div>
                </div>
            </div>
            <div className='AddMangaActions'>
                <button type="submit" onClick={handleSubmit} disabled={!formularioValido || isLoading} className='AddMangaBtnSubmit'>{isLoading ? <img src={loading} alt="Carregando" /> : <img src={list} alt="Adicionar" />}{isLoading ? '' : 'Adicionar Mangá'}</button>
                <button type="button" onClick={handleDiscard} className='AddMangaBtnDiscard'><img src={trash} alt="Descartar" />Descartar</button>
            </div>

            {cropModal}
        </div>
    );
}

export default AddManga;