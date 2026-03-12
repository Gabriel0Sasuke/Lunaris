-- --------------------------------------------------------
-- Servidor:                     lunaris-gabrielsasukeclash-eb41.l.aivencloud.com
-- Versão do servidor:           8.0.45 - Source distribution
-- OS do Servidor:               Linux
-- HeidiSQL Versão:              12.15.0.7171
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura para tabela defaultdb.manga
CREATE TABLE IF NOT EXISTS `manga` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `sinopse` text NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `demografia` varchar(20) NOT NULL,
  `releasedate` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT '',
  `autor` varchar(100) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `banner` varchar(255) NOT NULL,
  `views` int NOT NULL DEFAULT (0),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `artista` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela defaultdb.manga: ~7 rows (aproximadamente)
INSERT INTO `manga` (`id`, `titulo`, `sinopse`, `tipo`, `demografia`, `releasedate`, `status`, `autor`, `foto`, `banner`, `views`, `created_at`, `artista`) VALUES
	(2, 'Mushoku Tensei', 'Mushoku Tensei: Jobless Reincarnation acompanha a história de um homem de 34 anos que, após viver uma vida marcada por fracassos e isolamento, morre de forma repentina e acaba reencarnando em um mundo de fantasia como Rudeus Greyrat. Mantendo as memórias de sua vida passada, ele decide aproveitar essa segunda chance para viver sem arrependimentos e se tornar alguém melhor. Dotado de grande talento para a magia desde a infância, Rudeus começa uma nova jornada cheia de aventuras, aprendizados e desafios enquanto explora um mundo repleto de criaturas, culturas diferentes e perigos inesperados. Ao longo de sua vida, ele forma laços importantes, enfrenta consequências de suas próprias escolhas e tenta construir um futuro digno dessa nova oportunidade que recebeu.', 'manga', 'seinen', '2014-06-01', 'ongoing', 'Rifujin no Magonote', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/mushoku-tensei-fc08c9c6-f43b-4e00-bf22-d4fb4dc6c3b8.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/mushoku-tensei-9888262b-7039-42c1-8ee2-0f8866d397d2.jpeg', 0, '2026-03-06 03:55:40', 'Yuki Fukiwaka'),
	(3, 'One Punch Man', 'One Punch Man segue Saitama, um herói entediado por ser forte demais, capaz de derrotar qualquer inimigo com um único soco. Após três anos de treinamento intenso que o deixaram careca, ele busca adversários à altura, enfrentando monstros e vilões enquanto se registra na Associação de Heróis para ganhar reconhecimento.', 'manga', 'shounen', '2012-06-14', 'ongoing', 'ONE', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/one-punch-man-a1d6e8f8-3b26-4821-ac52-d26b77508299.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/one-punch-man-638002fc-2843-4903-92c4-838f8bea4036.jpeg', 0, '2026-03-08 17:38:14', 'Yusuke Murata'),
	(4, '【OSHI NO KO】', 'A história acompanha Ai Hoshino, uma idol carismática admirada por milhões de fãs. Após um evento trágico, dois admiradores renascem como seus filhos gêmeos, Aqua e Ruby Hoshino, carregando memórias de suas vidas passadas. A trama explora os bastidores sombrios da indústria do entretenimento japonesa, misturando drama psicológico, mistério e crítica social, enquanto os protagonistas buscam vingança, sucesso e identidade em meio ao brilho e às sombras do mundo idol.', 'manga', 'seinen', '2020-04-23', 'completed', 'Aka Akasaka', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/oshi-no-ko-4bfd2f70-4d34-4d86-a4cd-6138806735a8.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/oshi-no-ko-433bc9ce-0c30-4da0-89d6-f8652f72438c.jpeg', 0, '2026-03-08 19:31:08', 'Mengo Yokoyari'),
	(5, 'Tensei Shitara Slime Datta Ken', 'Satoru Mikami, um homem de 37 anos, morre após ser esfaqueado em um assalto. Ao despertar, descobre que foi reencarnado em um mundo de fantasia na forma de um slime. Com novas habilidades únicas, ele assume o nome Rimuru Tempest e começa a reunir aliados de diferentes raças, fundando a Federação Jura Tempest. A obra mistura ação, política, humor e construção de mundo, explorando como Rimuru transforma sua nação em um poder central no universo isekai.', 'manga', 'shounen', '2015-03-26', 'ongoing', 'Fuse', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/tensei-shitara-slime-datta-ken-488d2ace-6163-49dc-a722-ee47560e2082.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/tensei-shitara-slime-datta-ken-81f18ef0-fb2f-449d-aea7-eb78501aedf1.jpeg', 0, '2026-03-08 20:05:31', 'Taiki Kawakami'),
	(6, 'Made in Abyss', 'A história se passa em torno do Abyss, um gigantesco abismo cheio de criaturas misteriosas e relíquias de civilizações antigas. Riko, uma jovem órfã que sonha em se tornar exploradora como sua mãe, encontra Reg, um garoto robô vindo das profundezas. Juntos, eles decidem descer ao abismo em busca de respostas, enfrentando perigos mortais, segredos sombrios e os efeitos devastadores da “Maldição do Abismo”.', 'manga', 'seinen', '2012-10-20', 'ongoing', 'Akihito Tsukushi', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/made-in-abyss-d5b62581-fb1e-40d7-874b-0f140e0e2886.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/made-in-abyss-3f3ac530-a5be-470b-84be-66b0436a503a.jpeg', 0, '2026-03-08 20:07:41', 'Akihito Tsukushi'),
	(7, 'Dragon Ball Super', 'Após a derrota de Majin Buu, a paz retorna à Terra. No entanto, novos desafios surgem quando Goku e seus amigos enfrentam inimigos ainda mais poderosos, como Bills, o Deus da Destruição, e posteriormente participam de batalhas interdimensionais. A obra expande o universo de Dragon Ball com novos personagens, transformações e sagas épicas, incluindo o Torneio do Poder e o arco de Moro.', 'manga', 'shounen', '2015-06-20', 'ongoing', 'Akira Toriyama', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/dragon-ball-super-705f15a6-41d2-4681-a70b-03008080b7f0.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/dragon-ball-super-feebcd41-ca8f-4188-b7da-1d2beddae2d4.jpeg', 0, '2026-03-08 20:10:17', 'Toyotarou'),
	(8, 'Sentenced to Be a Hero: The Prison Records of Penal Hero Unit 9004', 'Em um mundo onde ser herói é a punição máxima, criminosos condenados são enviados à linha de frente contra o exército demoníaco. Esses “Heróis Penais” lutam sem esperança de redenção, sendo constantemente ressuscitados para batalhar até a morte. O protagonista Xylo Forbartz, outrora cavaleiro respeitado, é acusado de homicídio e condenado a servir como herói penal. Para provar sua inocência, ele precisa sobreviver ao campo de batalha e enfrentar conspirações políticas e militares.', 'manga', 'shounen', '2022-03-01', 'ongoing', 'Rocket Shōkai', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/sentenced-to-be-a-hero-the-prison-records-of-penal-hero-unit-9004-584a5435-8fcb-4213-82fb-478cb4ae953a.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/sentenced-to-be-a-hero-the-prison-records-of-penal-hero-unit-9004-04552464-5b0e-4ca6-b8b4-a8f35898189f.jpeg', 0, '2026-03-08 20:13:06', 'Natsumi Inoue'),
	(9, 'Doctor Stone', 'Em um mundo de pedra Senku precisa reviver a humanidade por meio da ciência', 'manga', 'shounen', '2017-03-06', 'completed', 'Boichi', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/covers/doctor-stone-1f6c9276-0ccc-41cd-b451-6eda0fcdacf6.jpeg', 'https://pub-5fd1559f7e0746c3b7f6280d48b36221.r2.dev/banners/doctor-stone-4b79f11e-c12c-4b74-94df-dbd365f46b54.jpeg', 0, '2026-03-09 13:10:18', 'Boichi');

-- Copiando estrutura para tabela defaultdb.manga_tags
CREATE TABLE IF NOT EXISTS `manga_tags` (
  `manga_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`manga_id`,`tag_id`),
  KEY `tag` (`tag_id`),
  CONSTRAINT `manga` FOREIGN KEY (`manga_id`) REFERENCES `manga` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela defaultdb.manga_tags: ~64 rows (aproximadamente)
INSERT INTO `manga_tags` (`manga_id`, `tag_id`) VALUES
	(2, 4),
	(2, 5),
	(2, 6),
	(2, 7),
	(2, 8),
	(2, 9),
	(2, 10),
	(2, 15),
	(2, 17),
	(2, 20),
	(2, 25),
	(3, 4),
	(3, 5),
	(3, 6),
	(3, 8),
	(3, 21),
	(3, 22),
	(3, 36),
	(3, 40),
	(4, 6),
	(4, 7),
	(4, 9),
	(4, 10),
	(4, 13),
	(4, 17),
	(4, 19),
	(4, 25),
	(4, 38),
	(4, 43),
	(5, 4),
	(5, 5),
	(5, 6),
	(5, 8),
	(5, 10),
	(5, 15),
	(5, 20),
	(5, 21),
	(5, 24),
	(5, 35),
	(5, 37),
	(5, 40),
	(6, 4),
	(6, 5),
	(6, 7),
	(6, 8),
	(6, 14),
	(6, 19),
	(6, 28),
	(6, 36),
	(6, 46),
	(7, 4),
	(7, 6),
	(7, 8),
	(7, 22),
	(7, 40),
	(8, 4),
	(8, 5),
	(8, 7),
	(8, 8),
	(8, 20),
	(8, 28),
	(8, 40),
	(9, 4),
	(9, 5),
	(9, 6),
	(9, 29),
	(9, 32);

-- Copiando estrutura para tabela defaultdb.scan
CREATE TABLE IF NOT EXISTS `scan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela defaultdb.scan: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela defaultdb.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `slug` varchar(15) NOT NULL,
  `icon` text NOT NULL,
  `prioridade` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela defaultdb.tags: ~39 rows (aproximadamente)
INSERT INTO `tags` (`id`, `name`, `slug`, `icon`, `prioridade`) VALUES
	(4, 'Ação', 'acao', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>', 1),
	(5, 'Aventura', 'aventura', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>', 1),
	(6, 'Comédia', 'comedia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', 1),
	(7, 'Drama', 'drama', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0-10-10c0 5.523 4.477 10 10 10Z"/><path d="M8 14s1.5-2 4-2 4 2 4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', 1),
	(8, 'Fantasia', 'fantasia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5 4 4"/><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 8 8 8-4 4-8-8Z"/><path d="m2 22 6-6"/></svg>', 1),
	(9, 'Romance', 'romance', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', 1),
	(10, 'Slice of Life', 'slice-of-life', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', 1),
	(12, 'Sci-Fi', 'sci-fi', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>', 0),
	(13, 'Mistério', 'misterio', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', 0),
	(14, 'Terror', 'terror', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>', 0),
	(15, 'Isekai', 'isekai', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>', 1),
	(16, 'Mecha', 'mecha', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>', 0),
	(17, 'Escolar', 'escolar', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/></svg>', 0),
	(18, 'Esportes', 'esportes', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>', 0),
	(19, 'Psicológico', 'psicologico', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>', 0),
	(20, 'Magia', 'magia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6"/><path d="M12 2v4"/><path d="M10 6h4"/><path d="M10 6c0 1.5-2 3-2 6v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6c0-3-2-4.5-2-6"/></svg>', 0),
	(21, 'Sobrenatural', 'sobrenatural', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>', 1),
	(22, 'Artes Marciais', 'artes-marciais', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a5 5 0 0 0 0 10 5 5 0 0 1 0 10"/><circle cx="12" cy="7" r="1"/><circle cx="12" cy="17" r="1"/></svg>', 0),
	(23, 'Histórico', 'historico', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>', 0),
	(24, 'Sistema', 'sistema', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', 1),
	(25, 'Reencarnação', 'reencarnacao', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>', 1),
	(26, 'Cultivação', 'cultivacao', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4-4 8-6 8-12a8 8 0 0 0-16 0c0 6 4 8 8 12z"/><path d="M12 22V10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>', 0),
	(27, 'Jogos', 'jogos', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4"/><path d="M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/></svg>', 0),
	(28, 'Dark Fantasy', 'dark-fantasy', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>', 0),
	(29, 'Sobrevivência', 'sobrevivencia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22h20L12 2Z"/><path d="M12 15v7"/><path d="M9 22c0-1.66 1.34-3 3-3s3 1.34 3 3"/></svg>', 0),
	(30, 'Vingança', 'vinganca', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22l-3-3V9l3-4 3 4v10l-3 3z"/><line x1="9" y1="14" x2="15" y2="14"/></svg>', 0),
	(31, 'Viagem no Tempo', 'viagem-no-tempo', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22V15l-5-5 5-5V2"/><path d="M7 22V15l5-5-5-5V2"/></svg>', 0),
	(32, 'Apocalipse', 'apocalipse', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M9 13v4h6v-4"/><line x1="8" y1="20" x2="16" y2="20"/></svg>', 0),
	(33, 'Murim', 'murim', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h20v14H2z"/><path d="M6 5v14"/><path d="M18 5v14"/></svg>', 0),
	(34, 'Cyberpunk', 'cyberpunk', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>', 0),
	(35, 'Harém', 'harem', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', 0),
	(36, 'Monstros', 'monstros', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="4" x2="4" y2="20"/><line x1="14" y1="4" x2="10" y2="20"/><line x1="22" y1="4" x2="16" y2="20"/></svg>', 0),
	(37, 'Vampiros', 'vampiros', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>', 0),
	(38, 'Idol', 'idol', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>', 0),
	(39, 'Caçadores', 'cacadores', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', 0),
	(40, 'Superpoderes', 'superpoderes', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/></svg>', 1),
	(41, 'Mitologia', 'mitologia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M4 4h16"/><path d="M6 4v16"/><path d="M10 4v16"/><path d="M14 4v16"/><path d="M18 4v16"/></svg>', 0),
	(42, 'Crime', 'crime', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/><path d="M7 9v-2a2 2 0 0 1 4 0v2"/><path d="M17 9v-2a2 2 0 0 0-4 0v2"/></svg>', 0),
	(43, 'Musical', 'musical', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>', 0),
	(44, 'Zumbis', 'zumbis', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="M12.5 17l-.5-1-.5 1h1z"/><path d="M12 2a7 7 0 0 0-7 7v4.5c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5V9a7 7 0 0 0-7-7z"/></svg>', 0),
	(45, 'Steampunk', 'steampunk', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', 0),
	(46, 'Tragédia', 'tragedia', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>', 0),
	(47, 'Magical Girls', 'magical-girls', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z"/><line x1="5" y1="19" x2="9" y2="15"/></svg>', 0),
	(48, 'Espaço', 'espaco', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M22 12c0 2-4.5 4-10 4S2 14 2 12s4.5-4 10-4 10 2 10 4z"/></svg>', 0);

-- Copiando estrutura para tabela defaultdb.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Login com Google',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `foto` varchar(255) DEFAULT NULL,
  `titulo` varchar(50) NOT NULL DEFAULT 'Mangá Beginner',
  `account_type` varchar(10) NOT NULL DEFAULT 'user' COMMENT 'Admin, Scan ou user',
  `xp` int NOT NULL DEFAULT '0' COMMENT 'Quantidade de XP atual que o usuario possui',
  `last_seen` timestamp NULL DEFAULT NULL,
  `discord_id` varchar(255) DEFAULT NULL COMMENT 'Login com Discord',
  `scan_afiliada` int DEFAULT NULL COMMENT 'em qual Scan Pertence',
  `ativa` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'true' COMMENT 'True ou False',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `discord_id` (`discord_id`),
  KEY `FazParteDe` (`scan_afiliada`),
  CONSTRAINT `FazParteDe` FOREIGN KEY (`scan_afiliada`) REFERENCES `scan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela defaultdb.usuario: ~4 rows (aproximadamente)
INSERT INTO `usuario` (`id`, `username`, `email`, `password`, `google_id`, `created_at`, `foto`, `titulo`, `account_type`, `xp`, `last_seen`, `discord_id`, `scan_afiliada`, `ativa`) VALUES
	(1, 'gabriexlss', 'gabrielsasukeclash@gmail.com', '$2b$10$guI07TiyvZJv2cseLocj7uvwtpQf5NWQTJApEsxX/jKTbZsKOdR7O', '104217408760985485805', '2026-02-03 17:05:41', NULL, 'Mangá Beginner', 'admin', 255, '2026-03-11 22:45:00', NULL, NULL, 'true'),
	(7, 'GABRIEL GAY', 'viniciuscapela6014@gmail.com', '$2b$10$Ft/sSKqkfxGpxUX5bNELf.IiKk.rhsZO93AbYt3zNTR7h9bKwrjdG', NULL, '2026-02-08 02:41:10', NULL, 'Mangá Beginner', 'user', 0, NULL, NULL, NULL, 'true'),
	(8, 'gulosao', 'saudinqwidnweioudnwenfernfiuenfui@GMAIUL.COM', '$2b$10$ntbmSoC.wGA2NRgfTK8Wp.DWag2HRVz3s8CI/VcNveEe2rQM9XVPG', NULL, '2026-02-09 11:49:14', NULL, 'Mangá Beginner', 'user', 0, NULL, NULL, NULL, 'true'),
	(9, 'Kduraaa_', 'giuseppecadura6969@gmail.com', '$2b$10$MQoqpRun8KjeU549GFQQHeaBXSEb7UdbpDi2I5EwYEU0CnJ2NAEqG', NULL, '2026-03-02 14:04:52', NULL, 'Mangá Beginner', 'user', 0, '2026-03-02 14:07:22', NULL, NULL, 'true'),
	(11, 'NoideaBr', 'vitonesolegado2@gmail.com', '$2b$10$HZmCoY1BdMkM2hxvYbTVDuOvZnPqzlYbzTuwHy2foiwCNFZzak3sG', NULL, '2026-03-09 12:39:43', NULL, 'Mangá Beginner', 'user', 0, NULL, NULL, NULL, 'true');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
