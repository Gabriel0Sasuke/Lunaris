// CSS
import './perfil.css';
// React
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// Icons
import profile from '../../assets/ui/person.svg';
import edit from '../../assets/ui/edit.svg';

// Sections
import ViewProfile from './sections/profile';
import EditProfile from './sections/editProfile';
function Perfil(){
    const [profileMode, setProfileMode] = useState('overview');
    const { usuario } = useAuth();

    
    return(
        <main className="perfil-content">
            <div className="profileSwitch">
                <button className={profileMode === 'overview' ? 'selected' : ''} onClick={() => setProfileMode('overview')}><img src={profile} alt="Perfil" />Perfil</button>
                <button className={profileMode === 'edit' ? 'selected' : ''} onClick={() => setProfileMode('edit')}><img src={edit} alt="Editar" />Editar</button>
            </div>
            {profileMode === 'overview' ? <ViewProfile usuario={usuario} /> : <EditProfile usuario={usuario} />}
            
        </main>
    )
}
export default Perfil;
