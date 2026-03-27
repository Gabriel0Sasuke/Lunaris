import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { createPortal } from 'react-dom';
import './Scansections.css';
import './index.css';

// SVG Icons
import photo from './assets/ui/photo.svg';
import panorama from './assets/ui/panorama.svg';
import photoAdd from './assets/ui/photoAdd.svg';
import openBook from './assets/ui/openbook.svg';
import descriptionIcon from './assets/ui/description.svg';
import trash from './assets/ui/trash.svg';
import list from './assets/ui/list.svg';
import rocket from './assets/ui/rocket.svg';
import settingsIcon from './assets/ui/settings.svg';
import loadingIcon from './assets/ui/loading.svg';
import bolt from './assets/ui/bolt.svg';

const LUNARIS_API = 'http://localhost:8000';
const ANILIST_API = 'https://graphql.anilist.co';

// cropImage (idêntico ao client/src/services/cropImage.js)
const cropImage = async (fileURL, pixels) => {
  const image = new Image();
  image.src = fileURL;
  image.crossOrigin = 'anonymous';
  await new Promise((resolve) => { image.onload = resolve; image.onerror = resolve; });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = pixels.width;
  canvas.height = pixels.height;
  ctx.drawImage(image, pixels.x, pixels.y, pixels.width, pixels.height, 0, 0, pixels.width, pixels.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Falha ao criar blob.')); return; }
      resolve({ blob, previewURL: URL.createObjectURL(blob) });
    }, 'image/jpeg', 0.9);
  });
};

function App() {
  // ===== CONFIGURAÇÃO =====
  const [openAiKey, setOpenAiKey] = useState(localStorage.getItem('openAiKey') || '');
  const [openAiBaseUrl, setOpenAiBaseUrl] = useState(localStorage.getItem('openAiBaseUrl') || 'https://api.openai.com/v1');
  const [openAiModel, setOpenAiModel] = useState(localStorage.getItem('openAiModel') || 'gpt-4o-mini');
  const [lunarisEmail, setLunarisEmail] = useState(localStorage.getItem('lunarisEmail') || '');
  const [lunarisPassword, setLunarisPassword] = useState(localStorage.getItem('lunarisPassword') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ===== ESTADOS =====
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [TAG_OPTIONS, setTAG_OPTIONS] = useState([]);

  // ===== CAMPOS DO MANGÁ =====
  const [mangaTitle, setMangaTitle] = useState('');
  const [mangaSynopsis, setMangaSynopsis] = useState('');
  const [mangaType, setMangaType] = useState('');
  const [mangaDemographic, setMangaDemographic] = useState('');
  const [mangaReleaseDate, setMangaReleaseDate] = useState('');
  const [mangaStatus, setMangaStatus] = useState('');
  const [mangaAuthor, setMangaAuthor] = useState('');
  const [mangaArtist, setMangaArtist] = useState('');
  const [genresInput, setGenresInput] = useState([]);

  // ===== IMAGENS =====
  const [mangaPhoto, setMangaPhoto] = useState(null);
  const [mangaBanner, setMangaBanner] = useState(null);
  const [URLmangaPhoto, setURLMangaPhoto] = useState('');
  const [URLmangaBanner, setURLMangaBanner] = useState('');
  const coverInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // ===== CROP =====
  const [isCropping, setIsCropping] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // ===== EFEITOS =====
  useEffect(() => { fetchTags(); }, []);

  useEffect(() => {
    localStorage.setItem('openAiKey', openAiKey);
    localStorage.setItem('openAiBaseUrl', openAiBaseUrl);
    localStorage.setItem('openAiModel', openAiModel);
    localStorage.setItem('lunarisEmail', lunarisEmail);
    localStorage.setItem('lunarisPassword', lunarisPassword);
  }, [openAiKey, openAiBaseUrl, openAiModel, lunarisEmail, lunarisPassword]);

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${LUNARIS_API}/tag/list`, { withCredentials: true });
      const tagsArray = res.data?.tags || res.data?.tag || [];
      setTAG_OPTIONS(tagsArray.map(tag => ({
        value: Number(tag.id),
        label: String(tag.name)
      })));
    } catch (err) {
      console.error("Erro ao buscar tags:", err);
    }
  };

  // ===== LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setErrorDetails('');
    try {
      const res = await axios.post(`${LUNARIS_API}/auth/login`, {
        email: lunarisEmail,
        password: lunarisPassword
      }, { withCredentials: true });
      setIsLoggedIn(true);
      fetchTags();
      setStatusMsg("Login realizado com sucesso!");
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro de conexão com o backend";
      setErrorMsg(`Falha no login: ${msg}`);
      setErrorDetails(JSON.stringify(err.response?.data || { error: err.message, url: `${LUNARIS_API}/auth/login` }, null, 2));
    }
  };

  // ===== UPLOAD MANUAL DE IMAGENS (igual ao original) =====
  const handleCoverFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) { setErrorMsg('Selecione um arquivo de imagem válido.'); return; }
    if (file.size > 3 * 1024 * 1024) { setErrorMsg('O arquivo de capa deve ser menor que 3MB.'); return; }
    const URLfile = URL.createObjectURL(file);
    setMangaPhoto(file);
    setURLMangaPhoto(URLfile);
    setIsCropping('cover');
  };

  const handleBannerFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) { setErrorMsg('Selecione um arquivo de imagem válido.'); return; }
    if (file.size > 5 * 1024 * 1024) { setErrorMsg('O arquivo de banner deve ser menor que 5MB.'); return; }
    const URLfile = URL.createObjectURL(file);
    setMangaBanner(file);
    setURLMangaBanner(URLfile);
    setIsCropping('banner');
  };

  const onCropComplete = (_area, pixels) => setCroppedAreaPixels(pixels);

  const handleCropConfirm = async () => {
    try {
      const srcUrl = isCropping === 'cover' ? URLmangaPhoto : URLmangaBanner;
      const { blob, previewURL } = await cropImage(srcUrl, croppedAreaPixels);
      const croppedFile = new File([blob], isCropping === 'cover' ? 'cover.jpg' : 'banner.jpg', { type: 'image/jpeg' });
      if (isCropping === 'cover') {
        URL.revokeObjectURL(URLmangaPhoto);
        setMangaPhoto(croppedFile);
        setURLMangaPhoto(previewURL);
      } else {
        URL.revokeObjectURL(URLmangaBanner);
        setMangaBanner(croppedFile);
        setURLMangaBanner(previewURL);
      }
    } catch (error) {
      setErrorMsg('Erro ao recortar a imagem.');
    } finally {
      setCroppedAreaPixels(null); setIsCropping('');
    }
  };

  const handleCropDiscard = () => {
    if (isCropping === 'cover') { setMangaPhoto(null); setURLMangaPhoto(''); }
    else { setMangaBanner(null); setURLMangaBanner(''); }
    setCroppedAreaPixels(null); setIsCropping('');
  };

  const cropModal = isCropping ? createPortal(
    <div className="AddMangaModalCrop">
      <div className="CropModalCard">
        <div className="CropStage">
          <Cropper
            image={isCropping === 'cover' ? URLmangaPhoto : URLmangaBanner}
            crop={crop} zoom={zoom}
            aspect={isCropping === 'cover' ? 2 / 3 : 21 / 9}
            onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}
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

  // ===== PROCESSAMENTO IA =====
  const handleAiProcess = async (e) => {
    e.preventDefault();
    if (!searchTitle) { setErrorMsg("Digite um título para buscar"); return; }

    setIsProcessingAI(true);
    setStatusMsg("Buscando dados do AniList e IA...");
    setErrorMsg(''); setErrorDetails('');

    try {
      setStatusMsg("1. Buscando capa e banner no AniList...");
      const anilistQuery = `
        query ($search: String) {
          Media(search: $search, type: MANGA) {
            title { romaji english }
            coverImage { extraLarge }
            bannerImage
          }
        }
      `;
      const anilistRes = await axios.post(ANILIST_API, { query: anilistQuery, variables: { search: searchTitle } });
      const media = anilistRes.data?.data?.Media;
      const bestTitle = media?.title?.english || media?.title?.romaji || searchTitle;

      setStatusMsg("2. Analisando metadados com IA...");
      const tagsList = TAG_OPTIONS.map(t => `ID ${t.value} = "${t.label}"`).join(', ');

      const systemPrompt = `Você é um catalogador especialista em mangás, manhwas e novels. Você SEMPRE responde em Português Brasileiro. Você SEMPRE responde com um objeto JSON válido sem markdown, sem explicação.`;

      const userPrompt = `Estou adicionando o mangá/manhwa/novel chamado "${bestTitle}" ao meu banco de dados.

Retorne um objeto JSON com estes campos:
- "title" (String: melhor nome oficial da obra)
- "synopsis" (String: um resumo detalhado da obra em Português Brasileiro, com pelo menos 3 frases)
- "type" (String: um de "manga", "manhua", "manhwa", "comic", "novel")
- "demographic" (String: um de "kodomo", "shounen", "shoujo", "seinen", "josei")
- "releaseDate" (String: formato YYYY-MM-DD)
- "status" (String: um de "ongoing", "completed", "hiatus", "cancelled")
- "author" (String: nome do autor)
- "artist" (String: nome do artista/ilustrador)
- "genres" (Array de Números: analise cuidadosamente o conteúdo e os temas da obra "${bestTitle}" e selecione APENAS as tags que realmente se aplicam. Tags disponíveis: ${tagsList})

IMPORTANTE sobre genres: Pense no enredo, temas e elementos da obra antes de escolher. NÃO selecione tags genéricas que não fazem parte da obra.

Retorne APENAS o JSON.`;

      const aiResponse = await axios.post(
        `${openAiBaseUrl}/chat/completions`,
        {
          model: openAiModel,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`,
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Lunaris Auto-Uploader',
          }
        }
      );

      let content = aiResponse.data.choices[0].message.content.trim();
      if (content.startsWith("\`\`\`json")) content = content.substring(7);
      if (content.startsWith("\`\`\`")) content = content.substring(3);
      if (content.endsWith("\`\`\`")) content = content.substring(0, content.length - 3);

      const parsedData = JSON.parse(content.trim());
      const parsedGenres = (parsedData.genres || []).map(g => Number(g)).filter(g => !isNaN(g));

      setMangaTitle(parsedData.title || bestTitle);
      setMangaSynopsis(parsedData.synopsis || '');
      setMangaType(parsedData.type || 'manga');
      setMangaDemographic(parsedData.demographic || 'shounen');
      setMangaReleaseDate(parsedData.releaseDate || new Date().toISOString().split('T')[0]);
      setMangaStatus(parsedData.status || 'ongoing');
      setMangaAuthor(parsedData.author || '');
      setMangaArtist(parsedData.artist || '');
      setGenresInput(parsedGenres);

      if (media?.coverImage?.extraLarge) { setURLMangaPhoto(media.coverImage.extraLarge); setMangaPhoto(null); }
      if (media?.bannerImage) { setURLMangaBanner(media.bannerImage); setMangaBanner(null); }

      setStatusMsg("Processamento da IA concluído! Revise os dados e clique nas imagens para trocar se necessário.");
    } catch (err) {
      console.error(err);
      setErrorMsg("Falha ao processar com IA ou AniList");
      setErrorDetails(err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.message || JSON.stringify(err));
      setStatusMsg("");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // ===== ENVIO PARA O LUNARIS =====
  const urlToFile = async (url) => {
    // Roteia imagens do AniList pelo proxy do Vite para evitar CORS
    let fetchUrl = url;
    if (url.includes('s4.anilist.co')) {
      fetchUrl = url.replace('https://s4.anilist.co', '/anilist-cdn');
    }
    const response = await axios.get(fetchUrl, { responseType: 'blob' });
    const bitmap = await createImageBitmap(response.data);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    const jpegBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    return new File([jpegBlob], 'image.jpg', { type: 'image/jpeg' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMsg("Preparando envio..."); setErrorMsg(''); setErrorDetails('');

    try {
      const formData = new FormData();
      formData.append('title', mangaTitle.trim());
      formData.append('synopsis', mangaSynopsis.trim());
      formData.append('type', mangaType.trim());
      formData.append('demographic', mangaDemographic.trim());
      formData.append('releaseDate', mangaReleaseDate);
      formData.append('status', mangaStatus.trim());
      formData.append('author', mangaAuthor.trim());
      formData.append('artist', mangaArtist.trim());
      genresInput.forEach((genre) => formData.append('genres[]', genre));

      if (mangaPhoto) {
        formData.append('cover', mangaPhoto);
      } else if (URLmangaPhoto) {
        setStatusMsg("Baixando capa da internet...");
        formData.append('cover', await urlToFile(URLmangaPhoto));
      } else { throw new Error("Capa obrigatória."); }

      if (mangaBanner) {
        formData.append('banner', mangaBanner);
      } else if (URLmangaBanner) {
        setStatusMsg("Baixando banner da internet...");
        formData.append('banner', await urlToFile(URLmangaBanner));
      } else { throw new Error("Banner obrigatório."); }

      setStatusMsg("Enviando para a API do Lunaris...");
      await axios.post(`${LUNARIS_API}/manga/create`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatusMsg("Mangá adicionado com sucesso!");
      handleDiscard();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || "Falha no envio.");
      setErrorDetails(err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.stack || '');
      setStatusMsg("");
    } finally { setIsLoading(false); }
  };

  const handleDiscard = () => {
    setMangaTitle(''); setMangaSynopsis(''); setMangaType(''); setMangaDemographic('');
    setMangaReleaseDate(''); setMangaStatus(''); setMangaAuthor(''); setMangaArtist('');
    setMangaPhoto(null); setMangaBanner(null);
    if (URLmangaPhoto) URL.revokeObjectURL(URLmangaPhoto);
    if (URLmangaBanner) URL.revokeObjectURL(URLmangaBanner);
    setURLMangaPhoto(''); setURLMangaBanner('');
    setGenresInput([]); setSearchTitle('');
  };

  const handleGenreToggle = (value) => {
    setGenresInput((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  // Validação
  const hojeIso = new Date().toISOString().split('T')[0];
  const formularioValido =
    mangaTitle.trim().length > 0 && mangaSynopsis.trim().length > 0 &&
    mangaType && mangaDemographic && mangaReleaseDate && mangaStatus &&
    mangaAuthor.trim().length > 0 && mangaArtist.trim().length > 0 &&
    genresInput.length > 0 && (URLmangaPhoto || mangaPhoto) && (URLmangaBanner || mangaBanner);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '40px 0' }}>

      {/* ===== PAINEL DE CONFIGURAÇÃO E IA ===== */}
      <div className="AddManga">
        <div className="ScanSectionTitle">
          <div className="ScanSectionTitleImg"><img src={settingsIcon} alt="Configurações" /></div>
          <div className='ScanSectionTitleLegend'><h3>Configurações</h3></div>
        </div>

        {/* Login */}
        <div className="AddMangaGeneralInfo" style={{ padding: '0 1rem' }}>
          {!isLoggedIn ? (
            <>
              <div className="AddMangaDualGeneralInfoField">
                <div className="AddMangaDualField">
                  <label>E-mail do Lunaris</label>
                  <input type="email" value={lunarisEmail} onChange={e => setLunarisEmail(e.target.value)} placeholder="seu@email.com" />
                </div>
                <div className="AddMangaDualField">
                  <label>Senha do Lunaris</label>
                  <input type="password" value={lunarisPassword} onChange={e => setLunarisPassword(e.target.value)} placeholder="••••••••" />
                </div>
              </div>
              <button type="button" className='AddMangaBtnSubmit' style={{ alignSelf: 'flex-start', borderRadius: '8px', minHeight: '40px', padding: '0.5rem 1.5rem' }} onClick={handleLogin}>
                Entrar no Lunaris
              </button>
            </>
          ) : (
            <div style={{ color: '#10b981', fontSize: '0.9rem', padding: '0.25rem 0 0.75rem' }}>✓ Autenticado no Lunaris com sucesso</div>
          )}
        </div>

        {/* Configuração de IA */}
        <div className="ScanSectionTitle" style={{ marginTop: '0.5rem' }}>
          <div className="ScanSectionTitleImg"><img src={bolt} alt="IA" /></div>
          <div className='ScanSectionTitleLegend'><h3>Inteligência Artificial</h3></div>
        </div>

        <div className="AddMangaGeneralInfo" style={{ padding: '0 1rem' }}>
          <div className="AddMangaDualGeneralInfoField">
            <div className="AddMangaDualField">
              <label>Chave de API</label>
              <input type="password" value={openAiKey} onChange={e => setOpenAiKey(e.target.value)} placeholder="sk-..." />
            </div>
            <div className="AddMangaDualField">
              <label>URL Base</label>
              <input type="text" value={openAiBaseUrl} onChange={e => setOpenAiBaseUrl(e.target.value)} placeholder="https://api.openai.com/v1" />
            </div>
            <div className="AddMangaDualField">
              <label>Modelo</label>
              <input type="text" value={openAiModel} onChange={e => setOpenAiModel(e.target.value)} placeholder="gpt-4o-mini" />
            </div>
          </div>

          <div className="AddMangaGeneralInfoField">
            <label>Título para Busca Automática</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} placeholder="Digite o nome do mangá e clique em Extrair" style={{ flex: 1 }} />
              <button type="button" className='AddMangaBtnSubmit' style={{ borderRadius: '8px', minHeight: '42px', padding: '0 1.5rem', whiteSpace: 'nowrap' }} onClick={handleAiProcess} disabled={isProcessingAI}>
                {isProcessingAI ? <img src={loadingIcon} alt="..." style={{ width: 18, height: 18 }} /> : <img src={rocket} alt="" style={{ width: 18, height: 18 }} />}
                {isProcessingAI ? 'Processando...' : 'Extrair e Preencher'}
              </button>
            </div>
          </div>
        </div>

        {statusMsg && <div style={{ color: '#60a5fa', padding: '0.5rem 1rem 1rem', fontSize: '0.88rem' }}>{statusMsg}</div>}
        {errorMsg && (
          <div style={{ padding: '1rem', margin: '0 1rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px' }}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>{errorMsg}</div>
            {errorDetails && <pre style={{ marginTop: '8px', fontSize: '0.78rem', color: '#fca5a5', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{errorDetails}</pre>}
          </div>
        )}
      </div>

      {/* ===== FORMULÁRIO PADRÃO LUNARIS ===== */}
      <div className="AddManga">
        <div className="ScanSectionTitle">
          <div className="ScanSectionTitleImg"><img src={photo} alt="Assets Visuais" /></div>
          <div className='ScanSectionTitleLegend'><h3>Assets Visuais</h3></div>
        </div>

        <div className="AddMangaVisual">
          <div className="AddMangaVisualPortrait">
            <h4>Capa em Formato Retrato</h4>
            <div className={`PortraitExample ${URLmangaPhoto ? 'hasPreview' : ''}`} onClick={() => coverInputRef.current?.click()}>
              {URLmangaPhoto ? (
                <><img className="PortraitPreviewImage" src={URLmangaPhoto} alt="Preview da capa" /><div className="PreviewOverlay"><span>Clique para trocar a capa</span></div></>
              ) : (
                <><div className='PortraitExampleImg'><img src={photoAdd} alt="" /></div><h5>Adicionar Capa</h5><span>Aspecto 2:3 (máx. 3MB)</span></>
              )}
            </div>
            <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverFileChange} style={{ display: 'none' }} />
          </div>
          <div className="AddMangaVisualLandscape">
            <h4>Capa em Formato Paisagem</h4>
            <div className={`LandscapeExample ${URLmangaBanner ? 'hasPreview' : ''}`} onClick={() => bannerInputRef.current?.click()}>
              {URLmangaBanner ? (
                <><img className="LandscapePreviewImage" src={URLmangaBanner} alt="Preview do banner" /><div className="PreviewOverlay"><span>Clique para trocar o banner</span></div></>
              ) : (
                <><div className='LandscapeExampleImg'><img src={panorama} alt="" /></div><h5>Adicionar Banner</h5><span>Aspecto 21:9 (máx. 5MB)</span></>
              )}
            </div>
            <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerFileChange} style={{ display: 'none' }} />
          </div>
        </div>

        <div className="ScanSectionTitle">
          <div className="ScanSectionTitleImg"><img src={openBook} alt="Informações Gerais" /></div>
          <div className='ScanSectionTitleLegend'><h3>Informações Gerais</h3></div>
        </div>

        <div className="AddMangaGeneralInfo">
          <div className="AddMangaGeneralInfoField">
            <label htmlFor="mangaTitle">Título do Mangá</label>
            <input type="text" id="mangaTitle" placeholder="Digite o título do mangá" value={mangaTitle} onChange={(e) => setMangaTitle(e.target.value)} />
          </div>
          <div className="AddMangaDualGeneralInfoField">
            <div className="AddMangaDualField">
              <label htmlFor="mangaAuthor">Autor</label>
              <input type="text" id="mangaAuthor" placeholder="Nome do autor" value={mangaAuthor} onChange={(e) => setMangaAuthor(e.target.value)} />
            </div>
            <div className="AddMangaDualField">
              <label htmlFor="mangaArtist">Artista</label>
              <input type="text" id="mangaArtist" placeholder="Nome do artista" value={mangaArtist} onChange={(e) => setMangaArtist(e.target.value)} />
            </div>
          </div>
          <div className="AddMangaGeneralInfoField">
            <label htmlFor="mangaDate">Data de Lançamento</label>
            <input type="date" id="mangaDate" max={hojeIso} value={mangaReleaseDate} onChange={(e) => setMangaReleaseDate(e.target.value)} />
          </div>
          <div className="AddMangaGeneralInfoField">
            <label htmlFor="mangaSynopsis">Sinopse</label>
            <textarea id="mangaSynopsis" placeholder="Escreva uma breve sinopse do mangá" value={mangaSynopsis} onChange={(e) => setMangaSynopsis(e.target.value)}></textarea>
          </div>
        </div>

        <div className="ScanSectionTitle">
          <div className="ScanSectionTitleImg"><img src={descriptionIcon} alt="Metadata" /></div>
          <div className='ScanSectionTitleLegend'><h3>Metadata</h3></div>
        </div>

        <div className="AddMangaMetadata">
          <div className="AddMangaTripleMetadataField">
            <div className="AddMangaMetadataField">
              <label htmlFor="mangaType">Tipo</label>
              <select id="mangaType" value={mangaType} onChange={(e) => setMangaType(e.target.value)}>
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
              <select id="mangaDemographic" value={mangaDemographic} onChange={(e) => setMangaDemographic(e.target.value)}>
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
              <select id="mangaStatus" value={mangaStatus} onChange={(e) => setMangaStatus(e.target.value)}>
                <option value="" disabled>Selecione o status</option>
                <option value="ongoing">Em andamento</option>
                <option value="completed">Completo</option>
                <option value="hiatus">Em hiato</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="AddMangaSingleMetadataField">
            <label>Gêneros</label>
            <div className="GenresCheckboxList">
              {TAG_OPTIONS.map((option) => (
                <label key={option.value} className={`GenreCheckboxItem ${genresInput.includes(option.value) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={genresInput.includes(option.value)} onChange={() => handleGenreToggle(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <div className="AddMangaMetadataGenreDisplay" style={{ marginTop: '0.45rem' }}>
              {genresInput.length > 0 ? (
                genresInput.map((id) => {
                  const tag = TAG_OPTIONS.find(t => t.value === id);
                  return <span key={id} className="GenreChip">{tag ? tag.label : `ID ${id}`}</span>;
                })
              ) : (
                <span className="GenreHint">As tags selecionadas aparecerão aqui</span>
              )}
            </div>
          </div>
        </div>

        <div className='AddMangaActions'>
          <button type="submit" onClick={handleSubmit} disabled={!formularioValido || isLoading || isProcessingAI} className='AddMangaBtnSubmit'>
            {isLoading ? <img src={loadingIcon} alt="" style={{ width: 18, height: 18 }} /> : <img src={list} alt="" style={{ width: 18, height: 18 }} />}
            {isLoading ? 'Enviando...' : 'Adicionar Mangá'}
          </button>
          <button type="button" onClick={handleDiscard} className='AddMangaBtnDiscard'>
            <img src={trash} alt="" style={{ width: 18, height: 18 }} />Descartar
          </button>
        </div>
      </div>

      {cropModal}
    </div>
  );
}

export default App;
