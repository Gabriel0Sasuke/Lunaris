<?php
session_start();
$sql = new mysqli("localhost", "root", "", "lunaris");

if ($sql->connect_error) {
	die("Erro de conexão: " . $sql->connect_error);
}

$dados = $sql->query("SELECT user_id, user_nome, user_usuario, user_email, user_senha, user_cargo, scan_descricao, scan_generos, scan_site, scan_discord FROM usuario WHERE user_cargo = 'scan'");
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Tabela Scan</title>
	<link rel="stylesheet" href="../css/tabela_usuario.css">
	<link rel="stylesheet" href="../css/cab.css">
	<style>
		#tabela_usuario th, #tabela_usuario td { font-size: 1rem; }
	</style>
</head>
<body>
	<header>
		<img id="icon" src="../img/icon.png" draggable="false" oncontextmenu="return false;">

		<div id="title" onclick="window.location='../index.php'">Lunaris</div>

		<div id="subtitle">Mangás</div>
		<div id="subtitle">Animes</div>
		<div id="subtitle">Manhwas</div>

		<input type="checkbox" id="luatosol">
		<label id="iconelua" for="luatosol"><img  src="../img/iconlua.png"></label>
		<label id="iconesol" for="luatosol"><img  src="../img/iconsun.png"></label>
		<a href="#"><img id="iconelupa" src="../img/iconlupa.png"></a>
		<input type="checkbox" id="menu">
		<label id="abrirmenu" for="menu"><img id="iconemenu" src="../img/iconmenu.png"></label>

		<input type="checkbox" id="larguramenubar">
		<div id="menubar">

			<div id="subdiv">
				<div id="profilephoto"><img src="../img/noprofile.png"></div>
				<div id="profileinfo">Bem Vindo, 
					<?php if(!isset($_SESSION['usuario'])){
					echo 'Guest';
				} else {
					echo $_SESSION['nome'];
				}; ?></div>
                
			<div id="options"><a href="cadastro.php">Cadastrar Usuario</a></div>
			<div id="options"><a href="cadastro_scan.php">Cadastrar Scan</a></div>
			<div id="options"><a href="tabela_usuario.php">Tabela Usuario</a></div>
			<div id="options"><a href="tabela_scan.php">Tabela Scan</a></div>


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
	<?php
	if(!$dados || $dados->num_rows == 0){
		echo "<div id='nenhum-usuario'>Nenhuma scan cadastrada</div>";
	}else{ ?>
	<main id="div-tabela">
		<table id="tabela_usuario">
			<tr>
				<th>ID</th>
				<th>Nome</th>
				<th>Responsavel</th>
				<th>Email</th>
				<th>Senha</th>
				<th>Cargo</th>
				<th>Descrição</th>
				<th>Gêneros</th>
				<th>Site</th>
				<th>Discord</th>
			</tr>

			<?php  while($row = $dados->fetch_assoc()){ ?>
			<tr>
				<td><?php echo $row['user_id']; ?></td>
				<td><?php echo $row['user_nome']; ?></td>
				<td><?php echo $row['user_usuario']; ?></td>
				<td><?php echo $row['user_email']; ?></td>
				<td><?php echo $row['user_senha']; ?></td>
				<td><?php echo $row['user_cargo']; ?></td>
				<td><?php echo $row['scan_descricao']; ?></td>
				<td><?php echo $row['scan_generos']; ?></td>
				<td><?php echo $row['scan_site']; ?></td>
				<td><?php echo $row['scan_discord']; ?></td>
			</tr>
			<?php } ?>
		</table>
	</main>
	<?php } ?>
</body>
</html>
