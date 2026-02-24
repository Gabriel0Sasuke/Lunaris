import '../assets/styles/perfil.css';

function Perfil(){
    return(
        <main className="perfil-content">
            <div className="profileInfo">
                <div className="profileIcon">
                    <img src="/example/lunaChan.png" alt="Sua foto de perfil" />
                    <div className="profileLevel">LVL 6</div>
                </div>
                <div className="profileName">
                    <h2>Gabriel0Sasuke</h2>
                </div>
                <div className="profileTitle">Mangá Reader</div>
            </div>
        </main>
    )
}
export default Perfil;