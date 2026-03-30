import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Scansections.css';
import { notify } from '../../../utils/notify';
import { tagAPI } from '../../../api/tagApi';
import description from '../../../assets/ui/description.svg';

function ManageTags() {
    const [tags, setTags] = useState([]);
    const [tagName, setTagName] = useState('');
    const [tagSlug, setTagSlug] = useState('');
    const [tagIcon, setTagIcon] = useState('');
    const [iconFileName, setIconFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const slugifyTag = (value) => value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    const fetchTags = async () => {
        try {
            const data = await tagAPI.getTags();
            const tagsArray = Array.isArray(data?.tags)
                ? data.tags
                : (Array.isArray(data) ? data : []);
            setTags(tagsArray);
        } catch (error) {
            notify.error(error.message || 'Erro ao carregar tags.');
            setTags([]);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleTagNameChange = (event) => {
        const value = event.target.value;
        setTagName(value);
        setTagSlug(slugifyTag(value));
    };

    const handleTagIconChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const isSvgByType = file.type === 'image/svg+xml';
        const isSvgByName = file.name.toLowerCase().endsWith('.svg');

        if (!isSvgByType && !isSvgByName) {
            notify.error('O ícone deve ser um arquivo SVG.');
            event.target.value = '';
            return;
        }

        try {
            const svgContent = await file.text();
            if (!svgContent.includes('<svg')) {
                notify.error('Arquivo inválido. Envie um SVG válido.');
                event.target.value = '';
                return;
            }

            setTagIcon(svgContent);
            setIconFileName(file.name);
        } catch {
            notify.error('Erro ao ler o arquivo SVG.');
            event.target.value = '';
        }
    };

    const resetTagForm = () => {
        setTagName('');
        setTagSlug('');
        setTagIcon('');
        setIconFileName('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const normalizedName = tagName.trim();
        const normalizedSlug = slugifyTag(tagSlug || normalizedName);

        if (!normalizedName || !normalizedSlug) {
            notify.error('Informe nome e slug da tag.');
            return;
        }

        if (!tagIcon || !tagIcon.includes('<svg')) {
            notify.error('Selecione um ícone SVG válido.');
            return;
        }

        try {
            setIsSubmitting(true);
            const responseData = await tagAPI.createTag({
                name: normalizedName,
                slug: normalizedSlug,
                icon: tagIcon
            });
            const createdTag = responseData?.tag || {
                name: normalizedName,
                slug: normalizedSlug,
                icon: tagIcon
            };

            setTags((prev) => [createdTag, ...prev]);
            resetTagForm();
            setIsAddModalOpen(false);
            notify.success('Tag adicionada com sucesso.');
        } catch (error) {
            notify.error(error.message || 'Erro ao adicionar tag.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTagModal = isAddModalOpen ? createPortal(
        <div className="ManageTagsModal">
            <div className="ManageTagsModalCard">
                <h4>Adicionar Nova Tag</h4>
                <form className="ManageTagsModalForm" onSubmit={handleSubmit}>
                    <div className="ManageTagsField">
                        <label htmlFor="tagName">Nome</label>
                        <input
                            id="tagName"
                            type="text"
                            maxLength={15}
                            placeholder="Nome da tag"
                            value={tagName}
                            onChange={handleTagNameChange}
                        />
                    </div>

                    <div className="ManageTagsField">
                        <label htmlFor="tagSlug">Slug</label>
                        <input
                            id="tagSlug"
                            type="text"
                            maxLength={15}
                            placeholder="slug-da-tag"
                            value={tagSlug}
                            onChange={(event) => setTagSlug(slugifyTag(event.target.value))}
                        />
                    </div>

                    <div className="ManageTagsField">
                        <label htmlFor="tagIcon">Ícone (SVG)</label>
                        <input
                            id="tagIcon"
                            type="file"
                            accept=".svg,image/svg+xml"
                            onChange={handleTagIconChange}
                        />
                        <span className="ManageTagsHint">{iconFileName ? `Arquivo: ${iconFileName}` : 'Selecione um arquivo SVG'}</span>
                    </div>

                    <div className="ManageTagsActions">
                        <button className="ManageTagsSubmit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Adicionar Tag'}
                        </button>
                        <button
                            className="ManageTagsCancel"
                            type="button"
                            onClick={() => {
                                setIsAddModalOpen(false);
                                resetTagForm();
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="ManageTags">
            <div className="ScanSectionTitle">
                <div className="ScanSectionTitleImg"><img src={description} alt="Gerenciar Tags" /></div>
                <div className='ScanSectionTitleLegend'><h3>Gerenciar Tags</h3></div>
            </div>

            <div className="ManageTagsToolbar">
                <button className="ManageTagsOpenModalBtn" type="button" onClick={() => setIsAddModalOpen(true)}>
                    Adicionar Tag
                </button>
            </div>

            <div className="ManageTagsList">
                {tags.map((tag) => (
                    <div key={tag.id || `${tag.slug}-${tag.name}`} className="ManageTagItem">
                        <div className="ManageTagIcon">
                            {tag.icon ? (
                                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(tag.icon)}`} alt={tag.name} />
                            ) : (
                                <span>SVG</span>
                            )}
                        </div>
                        <div className="ManageTagInfo">
                            <strong>{tag.name}</strong>
                            <span>{tag.slug}</span>
                        </div>
                    </div>
                ))}
            </div>

            {addTagModal}
        </div>
    );
}

export default ManageTags;