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
    scan_responsavel VARCHAR(50),
    scan_discord VARCHAR(32),
    user_cargo VARCHAR(20) NOT NULL DEFAULT 'usuario'
);
INSERT INTO usuario (user_id, user_nome, user_usuario, user_email, user_senha, scan_discord, user_cargo) VALUES (default, 'Gabriexlss', 'Gabriel0Sasuke', 'gabrielsasukeclash@gmail.com', '03082007Ga!', '@Gabriel0Sasuke', 'admin');
SHOW TABLES;
DROP table usuario;
DESC usuario;
DESC scan;

SELECT * FROM usuario;