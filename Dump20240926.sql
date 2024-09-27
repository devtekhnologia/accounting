CREATE DATABASE  IF NOT EXISTS `accounting` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `accounting`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: accounting
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_firms`
--

DROP TABLE IF EXISTS `tbl_firms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_firms` (
  `firm_id` int NOT NULL AUTO_INCREMENT,
  `firm_name` varchar(255) NOT NULL,
  `firm_email` varchar(45) DEFAULT NULL,
  `firm_gstno` varchar(255) NOT NULL,
  `firm_address` varchar(255) NOT NULL,
  `firm_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `firm_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `firm_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`firm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_firms`
--

LOCK TABLES `tbl_firms` WRITE;
/*!40000 ALTER TABLE `tbl_firms` DISABLE KEYS */;
INSERT INTO `tbl_firms` VALUES (138,'Balaji Infrastructure Pvt. Ltd.','balajiinfra@gmail.com','22AAAAA9801A3Z7','Washim','Active','2024-09-26 09:21:24','2024-09-26 09:21:24'),(139,'H2M Movieplex Pvt. Ltd.','h2mmoviep@gmail.com','22AAAAA9802A3Z7','Washim','Active','2024-09-26 09:21:55','2024-09-26 09:21:55'),(140,'Happy Faces The Concept School','happyfaces@gmail.com','22AAAAA9803A3Z7','Washim','Active','2024-09-26 09:22:14','2024-09-26 09:22:14'),(141,'Tekhnologia Innovations India Pvt. Ltd.','tekhnologiaindia@gmail.com','22AAAAA9804A3Z7','Pune','Active','2024-09-26 09:22:44','2024-09-26 09:22:44');
/*!40000 ALTER TABLE `tbl_firms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_general_ledgers`
--

DROP TABLE IF EXISTS `tbl_general_ledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_general_ledgers` (
  `gl_id` int NOT NULL AUTO_INCREMENT,
  `firm_id` int DEFAULT NULL,
  `gl_name` varchar(255) NOT NULL,
  `gl_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `gl_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `gl_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `balance` decimal(10,2) DEFAULT '0.00',
  `gl_type` enum('Cash','Not Cash') NOT NULL DEFAULT 'Not Cash',
  PRIMARY KEY (`gl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_general_ledgers`
--

LOCK TABLES `tbl_general_ledgers` WRITE;
/*!40000 ALTER TABLE `tbl_general_ledgers` DISABLE KEYS */;
INSERT INTO `tbl_general_ledgers` VALUES (299,138,'Dilip','Active','2024-09-26 09:24:11','2024-09-26 09:24:11',0.00,'Not Cash'),(300,138,'Rupesh Khillare','Active','2024-09-26 09:24:35','2024-09-26 09:24:35',0.00,'Not Cash'),(301,139,'Rohit','Active','2024-09-26 09:24:47','2024-09-26 09:24:47',0.00,'Cash'),(302,139,'Rupesh','Active','2024-09-26 09:25:03','2024-09-26 09:25:03',0.00,'Not Cash'),(303,140,'Dilip (School)','Active','2024-09-26 09:25:37','2024-09-26 09:26:19',0.00,'Cash'),(304,141,'Rupesh','Active','2024-09-26 09:25:49','2024-09-26 09:25:49',0.00,'Not Cash'),(305,141,'Aishwarya','Active','2024-09-26 09:26:05','2024-09-26 09:26:05',0.00,'Not Cash');
/*!40000 ALTER TABLE `tbl_general_ledgers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_transactions`
--

DROP TABLE IF EXISTS `tbl_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `from_firm_id` int DEFAULT NULL,
  `to_firm_id` int DEFAULT NULL,
  `from_gl_id` int DEFAULT NULL,
  `to_gl_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=547 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_transactions`
--

LOCK TABLES `tbl_transactions` WRITE;
/*!40000 ALTER TABLE `tbl_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_firm`
--

DROP TABLE IF EXISTS `tbl_user_firm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_firm` (
  `uf_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `firm_id` int DEFAULT NULL,
  `uf_usr_role` enum('Super Admin','firm_user') DEFAULT NULL,
  `uf_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uf_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `added_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`uf_id`)
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_firm`
--

LOCK TABLES `tbl_user_firm` WRITE;
/*!40000 ALTER TABLE `tbl_user_firm` DISABLE KEYS */;
INSERT INTO `tbl_user_firm` VALUES (301,200,138,'Super Admin','2024-09-26 09:21:24','2024-09-26 09:21:24',NULL),(302,200,139,'Super Admin','2024-09-26 09:21:55','2024-09-26 09:21:55',NULL),(303,200,140,'Super Admin','2024-09-26 09:22:14','2024-09-26 09:22:14',NULL),(304,200,141,'Super Admin','2024-09-26 09:22:44','2024-09-26 09:22:44',NULL),(305,201,141,'firm_user','2024-09-26 09:27:18','2024-09-26 09:27:18',200),(306,202,139,'firm_user','2024-09-26 09:28:09','2024-09-26 09:28:09',200);
/*!40000 ALTER TABLE `tbl_user_firm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(255) NOT NULL,
  `usr_email` varchar(255) NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  `usr_contact` varchar(255) NOT NULL,
  `usr_address` varchar(255) NOT NULL,
  `usr_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `usr_role` enum('Super Admin','firm_user') NOT NULL DEFAULT 'Super Admin',
  `usr_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `usr_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `usr_email` (`usr_email`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` VALUES (200,'Dilip Heda','dilip@gmail.com','e590e7ab487fcd24042e080597bb22f9:79519f89733cce23cb73172bc1cdfaaf','6545685266','Washim','Active','Super Admin','2024-09-26 09:20:46','2024-09-26 09:20:46'),(201,'Rupesh Khillare','khillarerupesh@gmail.com','04774f92037a3b3e4a969698c3f09cbd:64b7a5800116fe8d2bff86ce7dfd12fd','9845655235','Pune','Active','firm_user','2024-09-26 09:27:18','2024-09-26 09:27:18'),(202,'Rohit Heda','rohit@gmail.com','753f0577ba38be1ea838e7143fa4d4d2:a7ab031845aa263276942960b7bf55a4','9646866665','Washim','Active','firm_user','2024-09-26 09:28:09','2024-09-26 09:28:09');
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_vouchers`
--

DROP TABLE IF EXISTS `tbl_vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_vouchers` (
  `vhr_id` int NOT NULL AUTO_INCREMENT,
  `vhr_type` varchar(255) NOT NULL,
  `vhr_date` varchar(45) DEFAULT NULL,
  `vhr_amount` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`vhr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_vouchers`
--

LOCK TABLES `tbl_vouchers` WRITE;
/*!40000 ALTER TABLE `tbl_vouchers` DISABLE KEYS */;
INSERT INTO `tbl_vouchers` VALUES (1,'payment',NULL,NULL),(2,'receipt',NULL,NULL),(3,'transfer',NULL,NULL);
/*!40000 ALTER TABLE `tbl_vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'accounting'
--
/*!50003 DROP PROCEDURE IF EXISTS `AddFirm` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddFirm`(IN firmName VARCHAR(255),  firmgstNo VARCHAR(255), firmAddress VARCHAR(255), firmStatus VARCHAR(255))
BEGIN
    INSERT INTO tbl_firms (firm_name, firm_gstno, firm_address, firm_status) VALUES (firmName, firmgstNo, firmAddress, firmStatus);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AssignUserToFirm` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AssignUserToFirm`(IN userID INT, IN firmID INT)
BEGIN
    INSERT INTO tbl_user_firm (user_id, firm_id) VALUES (userID, firmID);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFirmUserDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFirmUserDetails`()
BEGIN
    SELECT f.firm_name, u.usr_name
    FROM tbl_firms f
    JOIN tbl_user_firm uf ON f.firm_id = uf.firm_id
    JOIN tbl_users u ON uf.user_id = u.user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-26 14:59:35
