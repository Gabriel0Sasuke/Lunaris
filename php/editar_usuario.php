<?php
include "connection.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $nome = $_POST['nome'];
    $usuario = $_POST['usuario'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $confirmesenha = $_POST['confirmesenha'];

    if ($senha !== $confirmesenha) {
        echo "<script>alert('As senhas não coincidem.');</script>";
    } else {
        $sql->query("UPDATE usuario SET user_nome = '$nome', user_usuario = '$usuario', user_email = '$email', user_senha = '$senha' WHERE user_id = $id");
        header("Location: ../html/lista_usuario.php");
        exit();
    }
}

if (!isset($id)) {
    $id = $_GET['id'];
    $dados = $sql->query("SELECT user_nome, user_usuario, user_email, user_senha FROM usuario WHERE user_id = $id");
    $row = $dados->fetch_assoc();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lunaris - Cadastro</title>
    <link rel="stylesheet" href="../css/cab.css">
    <link rel="stylesheet" href="../css/cadastro.css">
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
            <input type="checkbox" id="menu">
            <label id="abrirmenu" for="menu"><img id="iconemenu" src="../img/iconmenu.png"></label>
    
            <input type="checkbox" id="larguramenubar">
            <div id="menubar">
                <div id="subdiv">
                    <div id="profilephoto"><img src="../img/noprofile.png"></div>
                    <div id="profileinfo">Bem Vindo, Guest</div>
                <div id="options"><a href="login.php">Entrar</a></div>
                <div id="options"><a href="#">Cadastrar</a></div>
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
            <img src="../img/pixelartbackground.gif" draggable="false" contextmenu="false">

            <form action="editar_usuario.php" method="post">
                <h1>Editar</h1>
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($id); ?>">
                <div id="campo">
                    <label for="nome">*Nome</label>
                    <br>
                    <input type="text" name="nome" id="nome" placeholder="Digite seu Nome" maxlength="200" required tabindex="1" value="<?php echo htmlspecialchars($row['user_nome']); ?>">
                </div>

                <div id="campo">
                    <label for="usuario">Usuário</label>
                    <br>
                    <input type="text" name="usuario" id="usuario" placeholder="Digite um Apelido legal aqui" max="50" tabindex="2" value="<?php echo htmlspecialchars($row['user_usuario']); ?>">
                </div>

                <div id="campo">
                    <label for="email">*E-mail</label>
                    <br>
                    <input type="email" name="email" id="email" placeholder="example@domain.com" maxlength="200" required tabindex="3" value="<?php echo htmlspecialchars($row['user_email']); ?>">
                </div>

                <div id="campo">
                    <label for="senha">*Senha</label>
                    <br>
                    <input type="password" name="senha" id="senha" placeholder="Digite aqui a sua melhor senha" required
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$" 
                    title="A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um caractere especial." maxlength="50" tabindex="4" value="<?php echo htmlspecialchars($row['user_senha']); ?>">
                </div>

                <div id="campo">
                    <label for="confirmesenha">*Confirme sua Senha</label>
                    <br>
                    <input type="password" name="confirmesenha" id="confirmesenha" placeholder="Confirme sua senha" required tabindex="5" value="<?php echo htmlspecialchars($row['user_senha']); ?>">
                </div>

                <div id="campo">
                    <input type="checkbox" required name="termos" id="termos" checked>
                    <label id="termostexto" for="termos">Eu concordo com os <a href="#" target="_blank">Termos de Serviço</a> e a <a href="#" target="_blank">Política de Privacidade</a>.</label>
                </div>

                <button type="submit" tabindex="6">Editar</button>
            </form>
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
</body>
</html>