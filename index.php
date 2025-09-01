<?php
session_start();
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lunaris</title>
   
    <link rel="shortcut icon" href="img/iconfull.png" type="image/x-icon">
    <link rel="stylesheet" href="css/cab.css">
    <link rel="stylesheet" href="css/index.css">
</head>
<body>
<main onclick="fecharpopup()">
    <header>
        <img id="icon" src="img/icon.png" draggable="false" oncontextmenu="return false;">

        <div id="title">Lunaris</div>

        <div id="subtitle">Mangás</div>
        <div id="subtitle">Animes</div>
        <div id="subtitle">Manhwas</div>

        <input type="checkbox" id="luatosol">
        <label id="iconelua" for="luatosol"><img  src="img/iconlua.png"></label>
        <label id="iconesol" for="luatosol"><img  src="img/iconsun.png"></label>
        <a href="#"><img id="iconelupa" src="img/iconlupa.png"></a>
        <input type="checkbox" id="menu">
        <label id="abrirmenu" for="menu"><img id="iconemenu" src="img/iconmenu.png"></label>

        <input type="checkbox" id="larguramenubar">
        <div id="menubar">

            <div id="subdiv">
                <div id="profilephoto"><img src="img/noprofile.png"></div>
                <div id="profileinfo">Bem Vindo, 
                    <?php if(!isset($_SESSION['usuario'])){
                    echo 'Guest';
                } else {
                    echo $_SESSION['nome'];
                }; ?></div>
                
                <?php if(!isset($_SESSION['usuario'])){
            echo '<div id="options"><a href="html/login.php">Entrar</a></div>';
            echo '<div id="options"><a href="html/cadastro.php">Cadastrar</a></div>';
                }; ?>

                <?php if(isset($_SESSION['usuario'])){
            echo '<div id="options"><a href="html/dashboard.php">Dashboard</a></div>';
                }; ?>

            <label id="generos" for="generosbotao">Gêneros</label>
            <input type="checkbox" id="generosbotao">
                 <div id="generoslista">
                    <div id="optionsgenero"><a href="#">Ação</a></div>
                    <div id="optionsgenero"><a href="#">Romance</a></div>
                    <div id="optionsgenero"><a href="#">Comédia</a></div>
                    <div id="optionsgenero"><a href="#">Suspense</a></div>
                    <div id="optionsgenero"><a href="#">Fantasia</a></div>
                    <div id="optionsgenero"><a href="#">Isekai</a></div>
                    <div id="optionsgenero"><a href="#">Drama</a></div>
                    <div id="optionsgenero"><a href="#">Horror</a></div>
                 </div>
            <div id="options"><a href="#">Calendario de Animes</a></div>
            <div id="options"><a href="https://discord.gg/Yy7UHtVUH2">Discord</a></div>
            <div id="options"><a href="#">Contato</div></a>

            <div id="option2"> 
            <input type="checkbox" id="nsfw">
            <label for="nsfw" id="switch"><div id="botaonsfw"></div></label>
            <div>NSFW</div>
            </div>

            <?php if(isset($_SESSION['usuario'])){
            echo '<form id="desconnect" action="index.php" method="post">
            <button id="options" id="desconnect" type="submit" name="sair" id="options">Desconectar Conta</button>
            </form>';
                }; ?>
            </div>
        </div>
    </header>

    <input type="checkbox" id="avisotroll">
    <div id="aviso">
        <div id="avisotitle">Ativar o Modo NSFW?</div>
        <div id="avisotexto">O Modo "NSFW" é destinado a maiores de 18 anos. Ao continuar, você reconhece que está ciente de que este site pode conter material sensível ou inadequado para menores de idade, incluindo conteúdo NSFW (Not Safe For Work). Ao prosseguir, você confirma que tem a idade mínima necessária para acessar este conteúdo e que assume total responsabilidade pelo acesso a ele.</div>

        <div id="avisobotoes">
        <label id="avisobotaonao" for="nsfw">Tenho -18 Anos</label>
        <label id="avisobotaosim" for="avisotroll">Tenho +18 Anos</label>
        </div>
    </div>

    <div id="destaquetexto">Mangás em Destaque</div>

    <div id="destaques">

        <div class="destaque">

            <div id="flutuante">
                <div id="flututitle">The Beginning After End</div>
                Aventura, Fantasia, Artes Marciais, Reencarnação, Sobrenatural, Gore, Monstros
                <div id="chap">• 203 Capitulos</div>
            </div>

            <img id="destacado" src="conteudo/destaques/thebeginningafter.jpg" draggable="false" oncontextmenu="return false;">
        </div>

        <div class="destaque">

            <div id="flutuante">
                <div id="flututitle">Mushoku Tensei Jobless Reincarnation</div>
                Aventura, Fantasia, Reencarnação, Sobrenatural, Gore, Monstros, Harém, Isekai, Romance
                <div id="chap">• 104 Capitulos</div>
            </div>

            <img id="destacado" src="conteudo/destaques/mushokutensei.jpg" draggable="false" oncontextmenu="return false;">
        </div>

        <div class="destaque">

            <div id="flutuante">
                <div id="flututitle">Boruto: Two Blue Vortex</div>
                Aventura, Artes Marciais, Ação, Drama, Ninja
                <div id="chap">• 16 Capitulos</div>
            </div>

            <img id="destacado" src="conteudo/destaques/borutotwoblue.jpeg" draggable="false" oncontextmenu="return false;">
        </div>
    </div>

    <div id="tendenciastexto">Tendências <img src="gif/fogogif.gif" draggable="false" oncontextmenu="return false;"></div>
    <div id="tendencias">
        <div id="tendenciasnavegar">
            <button id="tendenciasesquerda"><img src="img/setaesquerda.png" draggable="false" oncontextmenu="return false;"></button>
            <button id="tendenciasdireita"><img src="img/setadireita.png" draggable="false" oncontextmenu="return false;"></button>
        </div>

        <div id="tendenciasquadro">
            <div id="quadrocaps">287 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/blackclover.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Black Clover</div>
                <div id="quadrotags">Ação, Morte, Violencia, Gore, Tesão, Sangue</div>
            </div>
        </div>
      
        <div id="tendenciasquadro">
            <div id="quadrocaps">133 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/jujutsu.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Jujutsu Kaisen</div>
                <div id="quadrotags">Ação, Sobrenatural, Exorcismo, Maldições, Lutas</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">203 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/onepiece.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">One Piece</div>
                <div id="quadrotags">Aventura, Piratas, Mistério, Lutas, Fantasia</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">94 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/sololeveling.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Solo Leveling</div>
                <div id="quadrotags">Ação, RPG, Caçadores, Fantasia, Poderes</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">215 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/chainsawman.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Chainsaw Man</div>
                <div id="quadrotags">Ação, Gore, Sobrenatural, Comédia, Drama</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">73 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/tokyorevengers.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Tokyo Revengers</div>
                <div id="quadrotags">Drama, Viagem no Tempo, Gangues, Romance</div>
            </div>
        </div>

        <div id="tendenciasquadro">
            <div id="quadrocaps">175 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/attackontitan.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Attack on Titan</div>
                <div id="quadrotags">Ação, Drama, Mistério, Terror, Lutas</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">120 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/demonslayer.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Demon Slayer</div>
                <div id="quadrotags">Ação, Sobrenatural, Lutas, Fantasia, Emoção</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">89 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/blueexorcist.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Blue Exorcist</div>
                <div id="quadrotags">Ação, Exorcismo, Sobrenatural, Escola, Família</div>
            </div>
        </div>

        <div id="tendenciasquadro">
            <div id="quadrocaps">340 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/naruto.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Naruto</div>
                <div id="quadrotags">Ação, Aventura, Ninjas, Lutas, Superação</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">57 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/fairytail.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Fairy Tail</div>
                <div id="quadrotags">Aventura, Magia, Amizade, Fantasia, Lutas</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">100 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/bokunohero.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Boku no Hero Academia</div>
                <div id="quadrotags">Ação, Superpoderes, Escola, Heróis, Lutas</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">150 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/bleach.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Bleach</div>
                <div id="quadrotags">Ação, Sobrenatural, Espadas, Fantasia, Lutas</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">95 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/hellsing.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Hellsing</div>
                <div id="quadrotags">Ação, Vampiros, Violência, Mistério, Gore</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">210 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/spyxfamily.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Spy x Family</div>
                <div id="quadrotags">Comédia, Ação, Espionagem, Família, Aventura</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">180 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/swordartonline.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Sword Art Online</div>
                <div id="quadrotags">Isekai, RPG, Ação, Aventura, Realidade Virtual</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">330 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/deathnote.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Death Note</div>
                <div id="quadrotags">Mistério, Psicológico, Suspense, Inteligência, Crime</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">44 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/promissed.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">The Promised Neverland</div>
                <div id="quadrotags">Mistério, Terror, Suspense, Drama, Sobrevivência</div>
            </div>
        </div>
        
        <div id="tendenciasquadro">
            <div id="quadrocaps">260 CAP</div>
            <div id="quadroimg"><img src="conteudo/tendencias/konosuba.jpg" draggable="false" oncontextmenu="return false;"></div>
            <div id="quadroinfo">
                <div id="quadrotitle">Konosuba</div>
                <div id="quadrotags">Comédia, Isekai, Aventura, Fantasia, Magia</div>
            </div>
        </div>
        



    </div>
</main>    

<footer>
<div id="footer-sobre">
<h1>Lunaris</h1>
Somos uma plataforma dedicada à leitura gratuita de mangás, manhwas, manhuas, novels e animes. Nosso objetivo é tornar essas obras acessíveis para todos os fãs, reunindo histórias incríveis em um só lugar. Descubra novos títulos e mergulhe em mundos fantásticos com apenas alguns cliques!
</div>

<div id="footer-linksuteis">
<h1>Links Úteis</h1>
<a href="#">Pagina Inicial</a>
<a href="html/cadastro_scan.php">Quero Postar Minha Obra</a>
<a href="">Novidades</a>
<a href="">Termos de Uso</a>
<a href="">DMCA</a>
<a onclick="popupsobre()">Sobre</a>
<a href="">Contato</a>
</div>

<div id="footer-redesociais">
<h1>Redes Sociais</h1>
<div id="footer-redesociais-icones">
<a href="#"><img src="img/Discord.png" alt="Entre no nosso Discord"></a>
<a href="#"><img src="img/Facebook.png" alt="Entre no nosso Facebook"></a>
<a href="#"><img src="img/X.png" alt="Entre no nosso X"></a>
<a href="#"><img src="img/Instagram.png" alt="Entre no nosso Instagram"></a>
</div>
</div>
</footer>
<div id="footer-linha"><div></div></div>
<div id="footer-copyright">
<p>&copy; 2025 Lunaris. Todos os direitos reservados.</p>
</div>

<div id="popup-sobre">
    <h1>Sobre Este Site</h1>
    <p>Olá! Me chamo Gabriel Portes, tenho 17 anos e atualmente estudo na ETEC, no curso de Desenvolvimento de Sistemas. Sempre tive curiosidade por tecnologia, e foi assim que acabei gostando muito de programação.</p>
    <p>Este site foi desenvolvido por mim como parte dos meus estudos, com o objetivo de reunir em um só lugar tudo que eu e muitos outros fãs adoramos: animes, mangás, manhwas, manhuas e novels. Tudo de forma gratuita, simples e acessível.</p>
    <p>Espero que você aproveite o conteúdo e que esse espaço ajude mais pessoas a se conectarem com histórias incríveis, assim como eu me conectei.</p>
</div>

<script src="javascript/destaques.js"></script>
<script src="javascript/aviso.js"></script>
<script src="javascript/tendencias.js"></script>
<script src="javascript/funcoes.js"></script>
</body>
</html>