import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { createPortal } from 'react-dom';
import { notify } from '../../../utils/notify';
import { cropImage } from '../../../utils/cropImage';
import { userAPI } from '../../../api/userApi';
import { useAuth } from '../../../context/AuthContext';

//Icons
import upload from '../../../assets/ui/upload.svg';
import person from '../../../assets/ui/person.svg';
import shield from '../../../assets/ui/shield.svg';
import profileIcon from '../../../assets/icons/profile.svg';
import loading from '../../../assets/ui/loading.svg';

// CSS
import './profileSections.css'

function EditProfile({ usuario }) {
    const { verificarUsuario } = useAuth();
    const profileInputRef = useRef(null);
    const [titles, setTitles] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    //Variaveis de Texto
    const [username, setUsername] = useState(usuario?.username || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [bio, setBio] = useState(usuario?.bio || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [title, setTitle] = useState(String(usuario?.titulo_id ?? ''));

    // Variaveis de Imagem
    const defaultProfileImage = usuario?.foto || profileIcon;
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage);
    const [profileImageURL, setProfileImageURL] = useState('');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isCropping, setIsCropping] = useState(false);
    const [removeProfileImage, setRemoveProfileImage] = useState(false);

    // Validações
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
    const senhaForte = password.length >= 8 && password.length <= 50 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
    const senhasIguais = password === confirmPassword;
    const usernameValido = username.trim().length >= 3 && username.trim().length <= 25;
    const bioValida = bio.length <= 2500;
    const hasPasswordInput = password.length > 0 || confirmPassword.length > 0;
    const senhaValidaParaSalvar = !hasPasswordInput || (senhaForte && senhasIguais);

    const usernameChanged = username.trim() !== (usuario?.username || '').trim();
    const emailChanged = email.trim().toLowerCase() !== (usuario?.email || '').trim().toLowerCase();
    const bioChanged = bio !== (usuario?.bio || '');
    const titleChanged = String(title) !== String(usuario?.titulo_id ?? '');
    const hasProfileImage = Boolean(profileImage);
    const hasAnyChanges = usernameChanged || emailChanged || bioChanged || titleChanged || hasPasswordInput || hasProfileImage || removeProfileImage;

    const usernameComErro = (username.length > 0 && !usernameValido) || (usernameChanged && usernameTaken);
    const emailComErro = (email.length > 0 && !emailValido) || (emailChanged && emailTaken);

    const formularioValido = usernameValido && emailValido && bioValida && senhaValidaParaSalvar && !usernameTaken && !emailTaken;

    useEffect(() => {
        setProfileImagePreview(defaultProfileImage);
        setProfileImage(null);
    }, [defaultProfileImage]);

    useEffect(() => {
        setUsername(usuario?.username || '');
        setEmail(usuario?.email || '');
        setBio(usuario?.bio || '');
        setTitle(String(usuario?.titulo_id ?? ''));
        setPassword('');
        setConfirmPassword('');
        setUsernameTaken(false);
        setEmailTaken(false);
        setRemoveProfileImage(false);
    }, [usuario?.username, usuario?.email, usuario?.bio, usuario?.titulo_id]);

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
        setRemoveProfileImage(false);
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
            setRemoveProfileImage(false);
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
        setProfileImagePreview(profileIcon);
        setRemoveProfileImage(Boolean(usuario?.foto));
        setCroppedAreaPixels(null);
        setIsCropping(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    useEffect(() => {
        if (!usernameChanged || !usernameValido) {
            setUsernameTaken(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setCheckingUsername(true);
                const result = await userAPI.checkUpdateAvailability({ username });
                setUsernameTaken(!result.usernameAvailable);
            } catch (error) {
                setUsernameTaken(false);
            } finally {
                setCheckingUsername(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [username, usernameChanged, usernameValido]);

    useEffect(() => {
        if (!emailChanged || !emailValido) {
            setEmailTaken(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setCheckingEmail(true);
                const result = await userAPI.checkUpdateAvailability({ email });
                setEmailTaken(!result.emailAvailable);
            } catch (error) {
                setEmailTaken(false);
            } finally {
                setCheckingEmail(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [email, emailChanged, emailValido]);

    const handleDiscardChanges = () => {
        setUsername(usuario?.username || '');
        setEmail(usuario?.email || '');
        setBio(usuario?.bio || '');
        setTitle(String(usuario?.titulo_id ?? ''));
        setPassword('');
        setConfirmPassword('');
        setUsernameTaken(false);
        setEmailTaken(false);
        setRemoveProfileImage(false);

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

    const handleSaveChanges = async () => {
        if (!hasAnyChanges) {
            notify.info('Nenhuma mudança detectada para salvar.');
            return;
        }

        if (!formularioValido) {
            if (!usernameValido) notify.error('Nome de usuário inválido.');
            else if (usernameTaken) notify.error('Este nome de usuário já está em uso.');
            else if (!emailValido) notify.error('E-mail inválido.');
            else if (emailTaken) notify.error('Este e-mail já está em uso.');
            else if (!bioValida) notify.error('A biografia deve ter no máximo 2500 caracteres.');
            else if (!senhaValidaParaSalvar) notify.error('Senha inválida ou confirmação não confere.');
            return;
        }

        if (checkingUsername || checkingEmail) {
            notify.info('Aguarde a validação de username/e-mail terminar.');
            return;
        }

        try {
            setLoadingState(true);
            const response = await userAPI.updateProfile({
                usuario,
                username,
                email,
                bio,
                title,
                password,
                profileImage,
                removeProfileImage
            });

            notify.success(response.message || 'Perfil atualizado com sucesso.');
            setPassword('');
            setConfirmPassword('');
            await verificarUsuario();
        } catch (error) {
            notify.error(error.message || 'Erro ao atualizar perfil.');
        } finally {
            setLoadingState(false);
        }
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

    useEffect(() => {
        const getTitles = async () => {
            try {
                const data = await userAPI.getTitles();
                setTitles(data.titles || []);
            } catch (error) {
                notify.error(error.message || 'Não foi possível conectar ao servidor para carregar títulos.');
            }
        };
        getTitles();
    }, []);
    return (
        <div className="edit-profile">
            <div className="profileImage">
                <div className="profileImageIcon"><img src={profileImagePreview} onError={(e) => { e.currentTarget.src = profileIcon; }} alt="Foto do usuário" /></div>
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
                    {!usernameValido && username ? <span className="editProfileTextoInvalido">Nome de usuário precisa ter entre 3 e 25 caracteres</span> : null}
                    {usernameChanged && usernameTaken ? <span className="editProfileTextoInvalido">Esse nome de usuário já está em uso</span> : null}
                    <input
                        className={usernameComErro ? 'editProfileInvalido' : ''}
                        type="text"
                        id="editusername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Digite seu novo nome de usuário"
                        minLength={3}
                        maxLength={25}
                    />
                </div>
                <div className="editProfileInput">
                    <label htmlFor="editemail">E-mail</label>
                    {!emailValido && email ? <span className="editProfileTextoInvalido">Email inválido</span> : null}
                    {emailChanged && emailTaken ? <span className="editProfileTextoInvalido">Esse e-mail já está em uso</span> : null}
                    <input
                        className={emailComErro ? 'editProfileInvalido' : ''}
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
                <div className="editProfileTitles">
                    <label htmlFor="edittitle">Selecione seu título</label>
                    <select
                        id="edittitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    >
                        <option value="">Selecione um título</option>
                        {titles.map((titles) => (
                            <option key={titles.id} value={String(titles.id)}>
                                {titles.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="editProfileBio">
                    <label htmlFor="editbio">Biografia</label>
                    <textarea 
                        id="editbio" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Biografia"
                        maxLength={2500}
                    />
                </div>
            </div>

            <div className="editProfileSection">
                <h2><img src={shield} alt="" />Segurança</h2>
                <div className="editProfileDuo">
                    <div className="editProfileInput">
                    <label htmlFor="editpassword">Nova Senha</label>
                    {!senhaForte && password ? <span className="editProfileTextoInvalido">A senha precisa ter maiúscula, minúscula, número e símbolo</span> : null}
                    <input className={!senhaForte && password ? 'editProfileInvalido' : ''} type="password" id="editpassword" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua nova senha" minLength={8} maxLength={50} />
                </div>
                <div className="editProfileInput">
                    <label htmlFor="editconfirmpassword">Confirme a Nova Senha</label>
                    {!senhasIguais && confirmPassword ? <span className="editProfileTextoInvalido">As senhas não coincidem</span> : null}
                    <input className={!senhasIguais && confirmPassword ? 'editProfileInvalido' : ''} type="password" id="editconfirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme sua nova senha" minLength={8} maxLength={50} />
                </div>
                </div>
            </div>

                <div className="editProfileActions">
                    <button type="button" className="cancelButton" onClick={handleDiscardChanges} disabled={loadingState}>Descartar Mudanças</button>
                    <button type="button" className="saveButton" onClick={handleSaveChanges} disabled={loadingState || !hasAnyChanges || !formularioValido || checkingUsername || checkingEmail}>{loadingState ? <img src={loading} alt="Carregando" /> : 'Salvar Alterações'}</button>
                </div>

            {cropModal}
            </div>
    );
}

export default EditProfile;