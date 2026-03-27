import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { createPortal } from 'react-dom';
import { notify } from '../../../services/notify';
import { cropImage } from '../../../services/cropImage';

//Icons
import upload from '../../../assets/ui/upload.svg';
import person from '../../../assets/ui/person.svg';
import shield from '../../../assets/ui/shield.svg';

// CSS
import './profileSections.css'

function EditProfile({ usuario }) {
    const profileInputRef = useRef(null);

    //Variaveis de Texto
    const [userName, setUserName] = useState(usuario?.username || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [bio, setBio] = useState(usuario?.bio || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Variaveis de Imagem
    const defaultProfileImage = usuario?.profile_image || '/example/lunaChan.png';
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage);
    const [profileImageURL, setProfileImageURL] = useState('');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isCropping, setIsCropping] = useState(false);

    useEffect(() => {
        setProfileImagePreview(defaultProfileImage);
        setProfileImage(null);
    }, [defaultProfileImage]);

    useEffect(() => {
        return () => {
            if (profileImageURL) {
                URL.revokeObjectURL(profileImageURL);
            }
            if (profileImagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [profileImageURL, profileImagePreview]);

    const onCropComplete = (croppedArea, cropPixels) => {
        setCroppedAreaPixels(cropPixels);
    };

    const handleProfileFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type && !file.type.startsWith('image/')) {
            notify.error('Por favor, selecione um arquivo de imagem válido para o perfil.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            notify.error('O arquivo de perfil deve ser menor que 2MB.');
            return;
        }

        if (profileImageURL) {
            URL.revokeObjectURL(profileImageURL);
        }

        const urlFile = URL.createObjectURL(file);
        setProfileImage(file);
        setProfileImageURL(urlFile);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setIsCropping(true);
    };

    const handleCropConfirm = async () => {
        if (!profileImageURL || !croppedAreaPixels || !profileImage) {
            notify.error('Selecione e ajuste a imagem antes de confirmar o recorte.');
            return;
        }

        try {
            const { blob, previewURL } = await cropImage(profileImageURL, croppedAreaPixels);
            const originalName = profileImage.name || 'profile-image';
            const safeName = originalName.replace(/\.[^.]+$/, '') || 'profile-image';
            const croppedFile = new File([blob], `${safeName}.webp`, { type: blob.type });

            if (profileImagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(profileImagePreview);
            }
            URL.revokeObjectURL(profileImageURL);

            setProfileImage(croppedFile);
            setProfileImagePreview(previewURL);
            setProfileImageURL('');
        } catch (error) {
            notify.error('Erro ao recortar a imagem de perfil.');
        } finally {
            setCroppedAreaPixels(null);
            setIsCropping(false);
        }
    };

    const handleCropDiscard = () => {
        if (profileImageURL) {
            URL.revokeObjectURL(profileImageURL);
        }
        if (profileInputRef.current) {
            profileInputRef.current.value = '';
        }

        setProfileImageURL('');
        setProfileImage(null);
        setCroppedAreaPixels(null);
        setIsCropping(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const handleRemoveProfileImage = () => {
        if (profileImagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(profileImagePreview);
        }
        if (profileImageURL) {
            URL.revokeObjectURL(profileImageURL);
        }
        if (profileInputRef.current) {
            profileInputRef.current.value = '';
        }

        setProfileImage(null);
        setProfileImageURL('');
        setProfileImagePreview(defaultProfileImage);
        setCroppedAreaPixels(null);
        setIsCropping(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const handleDiscardChanges = () => {
        setUserName(usuario?.username || '');
        setEmail(usuario?.email || '');
        setBio(usuario?.bio || '');
        setPassword('');
        setConfirmPassword('');

        if (profileImagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(profileImagePreview);
        }
        if (profileImageURL) {
            URL.revokeObjectURL(profileImageURL);
        }
        if (profileInputRef.current) {
            profileInputRef.current.value = '';
        }

        setProfileImage(null);
        setProfileImageURL('');
        setProfileImagePreview(defaultProfileImage);
        setCroppedAreaPixels(null);
        setIsCropping(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const cropModal = isCropping && profileImageURL ? createPortal(
        <div className="ProfileModalCrop">
            <div className="ProfileCropModalCard">
                <div className="ProfileCropStage">
                    <Cropper
                        image={profileImageURL}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="CropActions">
                    <button type="button" onClick={handleCropConfirm}>Confirmar</button>
                    <button type="button" onClick={handleCropDiscard}>Cancelar</button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="edit-profile">
            <div className="profileImage">
                <div className="profileImageIcon"><img src={profileImagePreview} alt="Foto do usuário" /></div>
                <div className="profileImageInfo">
                    <h3>Foto de Perfil</h3>
                    <span>Faça o Upload de uma nova foto de perfil <br />Recomendado 500px x 500px. Maximo de 2MB</span>
                    <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileFileChange}
                        style={{ display: 'none' }}
                    />
                    <div className='profileImageActions'>
                        <button type="button" onClick={() => profileInputRef.current?.click()}><img src={upload} alt="Upload" /> Alterar Foto</button>
                        <span onClick={handleRemoveProfileImage}>Remover</span>
                    </div>
                </div>
            </div>

            <div className="ProfileEditLine"></div>

            <div className="editProfileSection">
                <h2><img src={person} alt="" />Informações do perfil</h2>
                <div className="editProfileDuo">
                    <div className="editProfileInput">
                    <label htmlFor="editusername">Nome de usuário</label>
                    <input
                        type="text"
                        id="editusername"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Digite seu novo nome de usuário"
                        minLength={3}
                        maxLength={25}
                    />
                </div>
                <div className="editProfileInput">
                    <label htmlFor="editemail">E-mail</label>
                    <input
                        type="email"
                        id="editemail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu novo endereço de e-mail"
                        minLength={5}
                        maxLength={255}
                    />
                </div>
                </div>
                <div className="editProfileBio">
                    <label htmlFor="editbio">Biografia</label>
                    <textarea 
                        id="editbio" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Biografia"
                        maxLength={255}
                    />
                </div>
            </div>

            <div className="editProfileSection">
                <h2><img src={shield} alt="" />Segurança</h2>
                <div className="editProfileDuo">
                    <div className="editProfileInput">
                    <label htmlFor="editpassword">Nova Senha</label>
                    <input type="password" id="editpassword" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua nova senha" minLength={8} maxLength={100} />
                </div>
                <div className="editProfileInput">
                    <label htmlFor="editconfirmpassword">Confirme a Nova Senha</label>
                    <input type="password" id="editconfirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme sua nova senha" minLength={8} maxLength={100} />
                </div>
                </div>
            </div>

                <div className="editProfileActions">
                    <button type="button" className="cancelButton" onClick={handleDiscardChanges}>Descartar Mudanças</button>
                    <button type="button" className="saveButton">Salvar Alterações</button>
                </div>

            {cropModal}
            </div>
    );
}

export default EditProfile;