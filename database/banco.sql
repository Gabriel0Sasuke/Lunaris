CREATE DATABASE lunaris;
USE lunaris;

CREATE TABLE usuario(
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_nome VARCHAR(200) NOT NULL,
    user_usuario VARCHAR(50) NOT NULL UNIQUE,
    user_email VARCHAR(320) NOT NULL UNIQUE,
    user_senha VARCHAR(50) NOT NULL,
    scan_descricao VARCHAR(500),
    scan_generos VARCHAR(20),
    scan_site VARCHAR(200),
    scan_discord VARCHAR(32),
    user_cargo VARCHAR(20) NOT NULL DEFAULT 'usuario'
);
INSERT INTO usuario (user_id, user_nome, user_usuario, user_email, user_senha, scan_discord, user_cargo) VALUES (default, 'Gabriexlss', 'Gabriel0Sasuke', 'gabrielsasukeclash@gmail.com', '03082007Ga!', '@Gabriel0Sasuke', 'admin');
SHOW TABLES;
DROP table usuario;
DESC usuario;
DESC scan;

SELECT * FROM usuario;


SELECT COUNT(*) FROM usuario;

-- 20 usuários normais
INSERT INTO usuario
(user_id, user_nome, user_usuario, user_email, user_senha,
 scan_descricao, scan_generos, scan_site, scan_discord, user_cargo)
VALUES
(default, 'João Silva', 'joaosilva1', 'joao.silva1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Maria Oliveira', 'mariaoliveira1', 'maria.oliveira1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Pedro Souza', 'pedrosouza1', 'pedro.souza1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Ana Costa', 'anacosta1', 'ana.costa1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Lucas Pereira', 'lucaspereira1', 'lucas.pereira1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Carla Santos', 'carlasantos1', 'carla.santos1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Marcos Lima', 'marcoslima1', 'marcos.lima1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Beatriz Rocha', 'beatrizrocha1', 'beatriz.rocha1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Gabriel Almeida', 'gabrielalmeida1', 'gabriel.almeida1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Fernanda Ribeiro', 'fernandaribeiro1', 'fernanda.ribeiro1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Ricardo Martins', 'ricardomartins1', 'ricardo.martins1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Juliana Carvalho', 'julianacarvalho1', 'juliana.carvalho1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'André Fernandes', 'andrefernandes1', 'andre.fernandes1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Paula Azevedo', 'paulaazevedo1', 'paula.azevedo1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Thiago Melo', 'thiagomelo1', 'thiago.melo1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Camila Duarte', 'camiladuarte1', 'camila.duarte1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Rodrigo Barros', 'rodrigobarros1', 'rodrigo.barros1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Larissa Teixeira', 'larissateixeira1', 'larissa.teixeira1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Felipe Nunes', 'felipenunes1', 'felipe.nunes1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario'),
(default, 'Isabela Freitas', 'isabelafreitas1', 'isabela.freitas1@example.com', 'senha123', NULL, NULL, NULL, NULL, 'usuario');

-- 20 scans
INSERT INTO usuario
(user_id, user_nome, user_usuario, user_email, user_senha,
 scan_descricao, scan_generos, scan_site, scan_discord, user_cargo)
VALUES
(default, 'Scan Alpha', 'scanalpha', 'scan.alpha@example.com', 'scan123', 'Traduções rápidas de mangás', 'Ação', 'https://scanalpha.com', 'scanalpha#1001', 'scan'),
(default, 'Scan Beta', 'scanbeta', 'scan.beta@example.com', 'scan123', 'Grupo focado em romance', 'Romance', 'https://scanbeta.com', 'scanbeta#1002', 'scan'),
(default, 'Scan Gamma', 'scangamma', 'scan.gamma@example.com', 'scan123', 'Traduções noturnas de manhwa', 'Drama', 'https://scangamma.com', 'scangamma#1003', 'scan'),
(default, 'Scan Delta', 'scandelta', 'scan.delta@example.com', 'scan123', 'Equipe especializada em isekai', 'Isekai', 'https://scandelta.com', 'scandelta#1004', 'scan'),
(default, 'Scan Omega', 'scanomega', 'scan.omega@example.com', 'scan123', 'Mangás clássicos revisados', 'Clássico', 'https://scanomega.com', 'scanomega#1005', 'scan'),
(default, 'Scan Zeta', 'scanzeta', 'scan.zeta@example.com', 'scan123', 'Equipe com foco em comédia', 'Comédia', 'https://scanzeta.com', 'scanzeta#1006', 'scan'),
(default, 'Scan Sigma', 'scansigma', 'scan.sigma@example.com', 'scan123', 'Traduções com qualidade premium', 'Shounen', 'https://scansigma.com', 'scansigma#1007', 'scan'),
(default, 'Scan Theta', 'scantheta', 'scan.theta@example.com', 'scan123', 'Time especializado em fantasia', 'Fantasia', 'https://scantheta.com', 'scantheta#1008', 'scan'),
(default, 'Scan Epsilon', 'scanepsilon', 'scan.epsilon@example.com', 'scan123', 'Traduções semanais de ecchi', 'Ecchi', 'https://scanepsilon.com', 'scanepsilon#1009', 'scan'),
(default, 'Scan Kappa', 'scankappa', 'scan.kappa@example.com', 'scan123', 'Grupo pequeno de doujinshi', 'Adulto', 'https://scankappa.com', 'scankappa#1010', 'scan'),
(default, 'Scan Lambda', 'scanlambda', 'scan.lambda@example.com', 'scan123', 'Equipe dedicada a josei', 'Josei', 'https://scanlambda.com', 'scanlambda#1011', 'scan'),
(default, 'Scan Mu', 'scanmu', 'scan.mu@example.com', 'scan123', 'Time com foco em shoujo', 'Shoujo', 'https://scanmu.com', 'scanmu#1012', 'scan'),
(default, 'Scan Nu', 'scannu', 'scan.nu@example.com', 'scan123', 'Traduções emergenciais', 'Aventura', 'https://scannu.com', 'scannu#1013', 'scan'),
(default, 'Scan Xi', 'scanxi', 'scan.xi@example.com', 'scan123', 'Equipe jovem e criativa', 'Slice of Life', 'https://scanxi.com', 'scanxi#1014', 'scan'),
(default, 'Scan Omicron', 'scanomicron', 'scan.omicron@example.com', 'scan123', 'Foco em mangás pouco conhecidos', 'Indie', 'https://scanomicron.com', 'scanomicron#1015', 'scan'),
(default, 'Scan Pi', 'scanpi', 'scan.pi@example.com', 'scan123', 'Grupo de one-shots variados', 'One-shot', 'https://scanpi.com', 'scanpi#1016', 'scan'),
(default, 'Scan Rho', 'scanrho', 'scan.rho@example.com', 'scan123', 'Equipe focada em mistério', 'Mistério', 'https://scanrho.com', 'scanrho#1017', 'scan'),
(default, 'Scan Tau', 'scantau', 'scan.tau@example.com', 'scan123', 'Traduções rápidas e diretas', 'Curto', 'https://scantau.com', 'scantau#1018', 'scan'),
(default, 'Scan Upsilon', 'scanupsilon', 'scan.upsilon@example.com', 'scan123', 'Equipe com foco em seinen', 'Seinen', 'https://scanupsilon.com', 'scanupsilon#1019', 'scan'),
(default, 'Scan Phi', 'scanphi', 'scan.phi@example.com', 'scan123', 'Grupo com padrão profissional', 'Seinen', 'https://scanphi.com', 'scanphi#1020', 'scan');
