<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lunaris - Dashboard</title>
    <link rel="stylesheet" href="../css/cab.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="shortcut icon" href="../img/iconfull.png" type="image/x-icon">
</head>
<body>
    <main onclick="fecharpopup()">

        <header>
            <img id="icon" src="../img/icon.png" draggable="false" oncontextmenu="return false;" onclick="inicio()">
    
            <div id="title" onclick="inicio()">Lunaris</div>
    
            <div id="subtitle">Mangás</div>
            <div id="subtitle">Animes</div>
            <div id="subtitle">Manhwas</div>
    
            <input type="checkbox" id="luatosol">
            <label id="iconelua" for="luatosol"><img  src="../img/iconlua.png"></label>
            <label id="iconesol" for="luatosol"><img  src="../img/iconsun.png"></label>
            <img id="iconelupa" src="../img/iconlupa.png">
        </header>
    
        <div id="principal">
            <div id="menulateral">
                <div class="opcoes" id="recolher" onclick="recolher()"><div class="opcoes-img"><img src="../img/arrow-big-right.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Recolher</div></div>
                <div class="opcoes" id="dash" onclick="sidebar(1)"><div class="opcoes-img"><img src="../img/grid.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Visão Geral</div></div>
                <div class="opcoes" id="edit" onclick="sidebar(2)"><div class="opcoes-img"><img src="../img/pen.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Editar Perfil</div></div>
                <div class="opcoes" id="album" onclick="sidebar(3)"><div class="opcoes-img"><img src="../img/album.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Minhas Obras</div></div>
                <div class="opcoes" id="scan" onclick="sidebar(4)"><div class="opcoes-img"><img src="../img/bookpen.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Scan</div></div>
                <div class="opcoes" id="admin" onclick="sidebar(5)"><div class="opcoes-img"><img src="../img/shield.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Admin</div></div>
                <div class="opcoes" id="config" onclick="sidebar(6)"><div class="opcoes-img"><img src="../img/gear.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Configurações</div></div>
                <div class="opcoes" id="logout"><div class="opcoes-img"><img src="../img/log-out.png" draggable="false" oncontextmenu="return false"></div><div class="opcoes-texto">Log-Out</div></div>
            </div>

            <div class="blocos" id="blocodash">
                teste
            </div>

            <div class="blocos" id="blocoperfil">

            </div>

            <div class="blocos" id="blocoobras">

            </div>

            <div class="blocos" id="blocoscan">

            </div>

            <div class="blocos" id="blocoadmin">

            </div>

            <div class="blocos" id="blococonfig">

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
            <a href="../index.php">Pagina Inicial</a>
            <a href="../html/cadastro_scan.php">Quero Postar Minha Obra</a>
            <a href="">Novidades</a>
            <a href="">Termos de Uso</a>
            <a href="">DMCA</a>
            <a onclick="popupsobre()">Sobre</a>
            <a href="">Contato</a>
            </div>
            
            <div id="footer-redesociais">
            <h1>Redes Sociais</h1>
            <div id="footer-redesociais-icones">
            <a href="#"><img src="../img/Discord.png" alt="Entre no nosso Discord"></a>
            <a href="#"><img src="../img/Facebook.png" alt="Entre no nosso Facebook"></a>
            <a href="#"><img src="../img/X.png" alt="Entre no nosso X"></a>
            <a href="#"><img src="../img/Instagram.png" alt="Entre no nosso Instagram"></a>
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

        <script src="../javascript/funcoes.js"></script>
        <script src="../javascript/dashboard.js"></script>
</body>
</html>