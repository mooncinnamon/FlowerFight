-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.3.15-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- flowerfight 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `flowerfight` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `flowerfight`;

-- 테이블 flowerfight.gameinfos 구조 내보내기
CREATE TABLE IF NOT EXISTS `gameinfos` (
  `id` bigint(20) NOT NULL,
  `username` varchar(15) NOT NULL,
  `money` bigint(11) NOT NULL DEFAULT 100000000,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `id` (`id`),
  CONSTRAINT `FK_gameinfo_users` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_gameinfo_users_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 flowerfight.gameinfos:~3 rows (대략적) 내보내기
/*!40000 ALTER TABLE `gameinfos` DISABLE KEYS */;
INSERT INTO `gameinfos` (`id`, `username`, `money`, `createdAt`, `updatedAt`) VALUES
	(1, 'mooncinnamon', 100000000, '2019-06-04 07:03:19', '2019-06-04 07:04:05'),
	(2, 'testuser1', 100000000, '2019-06-04 07:03:19', '2019-06-04 07:04:05'),
	(3, 'testuser2', 100000000, '2019-06-04 07:03:19', '2019-06-04 07:04:05'),
	(4, 'testuser3', 100000000, '2019-06-04 07:03:19', '2019-06-04 07:04:05');
/*!40000 ALTER TABLE `gameinfos` ENABLE KEYS */;

-- 테이블 flowerfight.roles 구조 내보내기
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- 테이블 데이터 flowerfight.roles:~2 rows (대략적) 내보내기
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`) VALUES
	(5, 'ROLE_ADMIN'),
	(4, 'ROLE_USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- 테이블 flowerfight.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `username` varchar(15) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- 테이블 데이터 flowerfight.users:~4 rows (대략적) 내보내기
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
	(1, 'mooncinnamon', 'mooncinnamon', 'moon.pinnamon@gmail.com', '$2a$10$CfIe8kJLnzRB0cLrWmPV8uO7O7c/VcATlXfef5GHsD0zByMCfcaVq', '2019-05-28 14:39:22', '2019-05-28 14:39:22'),
	(2, 'Foo Bar', 'testuser1', 'testuser1@gmail.com', '$2a$10$xPnu28eJ7PKhdxi25Ppa5eBeEeJAsHT9mbNPSDcmzkHCKbi4wQsQW', '2019-06-01 07:30:46', '2019-06-01 07:30:46'),
	(3, 'Foo Bar2', 'testuser2', 'testuser2@gmail.com', '$2a$10$pcaPHsT/fzU25whnaOJDXeg5PJ8cfddc3Nw3j/yHkAuUqxAXMItXq', '2019-06-01 09:48:40', '2019-06-01 09:48:40'),
	(4, 'Foo Bar3', 'testuser3', 'testuser3@gmail.com', '$2a$10$jcXocKJbsts9WAm8ddKRX.lL7JwRX3wcpqwlv7AdjyhGzVnhUpsPy', '2019-06-03 21:04:00', '2019-06-03 21:04:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- 테이블 flowerfight.user_roles 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_roles_role_id` (`role_id`),
  CONSTRAINT `fk_user_roles_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_user_roles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 flowerfight.user_roles:~4 rows (대략적) 내보내기
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
	(1, 4),
	(2, 4),
	(3, 4),
	(4, 4);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
