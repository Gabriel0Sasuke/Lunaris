<?php session_start(); ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lunaris - Usuarios</title>
    <link rel="stylesheet" href="../css/cab.css">
    <link rel="stylesheet" href="../css/lista.css">
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
            <input type="checkbox" id="menu">
            <label id="abrirmenu" for="menu"><img id="iconemenu" src="../img/iconmenu.png"></label>
    
            <input type="checkbox" id="larguramenubar">
            <div id="menubar">
                <div id="subdiv">
                    <div id="profilephoto"><img src="../img/noprofile.png"></div>
                    <div id="profileinfo">Bem Vindo, <?php if(!isset($_SESSION['usuario'])){ echo 'Guest'; } else { echo $_SESSION['nome']; } ?></div>

                <div id="options"><a href="cadastro.php">Cadastrar Usuario</a></div>
                <div id="options"><a href="cadastro_scan.php">Cadastrar Scan</a></div>
                <div id="options"><a href="lista_usuario.php">Tabela Usuario</a></div>
                <div id="options"><a href="lista_scan.php">Tabela Scan</a></div>

                <div id="options"><a href="dashboard.php">Dashboard</a></div>

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
                echo '<form id="desconnect" action="../index.php" method="post">
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
        
        <div id="principal">
            <h1>Lista de Usuários</h1>
            <?php
            include "../php/connection.php";
            $dados = $sql->query("SELECT user_id, user_nome, user_usuario, user_email, user_senha FROM usuario WHERE user_cargo = 'usuario'");
            if ($dados->num_rows > 0) {
            ?>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Senha</th>
                    <th colspan="2">Ações</th>
                </tr>
                <?php while ($row = $dados->fetch_assoc()) { ?>
                <tr>
                    <td><?php echo $row['user_id']; ?></td>
                    <td><?php echo $row['user_nome']; ?></td>
                    <td><?php echo $row['user_usuario']; ?></td>
                    <td><?php echo $row['user_email']; ?></td>
                    <td><?php echo $row['user_senha']; ?></td>
                    <td><button id="editar" onclick="window.location.href='../php/editar_usuario.php?id=<?php echo $row['user_id']; ?>'">Editar</button></td>
                <td><button id="excluir" onclick="window.location.href='../php/excluir_usuario.php?id=<?php echo $row['user_id']; ?>'">Excluir</button></td>
                </tr>
                <?php } ?>
            </table>
            <?php
            } else {
                echo "<div id='aviso'>Nenhum usuário encontrado.</div>";
            } ?>
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
</body>
</html>