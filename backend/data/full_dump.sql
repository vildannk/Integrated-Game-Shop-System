-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: webprojekat
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `webprojekat`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `webprojekat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `webprojekat`;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `CartID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `price_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','ordered') NOT NULL DEFAULT 'active',
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`CartID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,2,0.00,'active','2026-02-01 18:25:31','2026-02-01 18:25:31'),(2,3,0.00,'active','2026-02-01 21:46:00','2026-02-01 21:46:00'),(3,4,0.00,'active','2026-02-03 07:32:57','2026-02-03 07:32:57');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart_items` (
  `CartItemID` int(11) NOT NULL AUTO_INCREMENT,
  `CartID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`CartItemID`),
  UNIQUE KEY `unique_cart_item` (`CartID`,`ProductID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`CartID`) REFERENCES `cart` (`CartID`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1,1,1,'2026-02-01 18:25:31'),(2,1,5,2,'2026-02-01 18:25:31'),(27,2,2,2,'2026-02-03 10:58:02'),(28,2,4,1,'2026-02-03 10:58:03'),(29,2,3,1,'2026-02-03 10:58:04'),(30,2,1,1,'2026-02-03 10:58:05');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `CategoryName` (`CategoryName`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Gaming Consoles','2026-02-01 18:25:31'),(2,'PC Components','2026-02-01 18:25:31'),(3,'Accessories','2026-02-01 18:25:31'),(4,'Games','2026-02-01 18:25:31'),(5,'Phones','2026-02-01 20:24:15'),(6,'Consoles','2026-02-01 20:24:15'),(7,'PC Gadgets','2026-02-01 20:24:15'),(8,'Deals & Offers','2026-02-01 20:24:15');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `console_catalog`
--

DROP TABLE IF EXISTS `console_catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `console_catalog` (
  `ConsoleID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `DailyRate` decimal(10,2) NOT NULL,
  `ImageURL` varchar(255) NOT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ConsoleID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `console_catalog`
--

LOCK TABLES `console_catalog` WRITE;
/*!40000 ALTER TABLE `console_catalog` DISABLE KEYS */;
INSERT INTO `console_catalog` VALUES (1,'PlayStation 5','DualSense + 4K ready',25.00,'backend/public/images/products/playstation-5.png',1,'2026-02-01 20:26:03'),(2,'Xbox Series X','Game Pass ready',22.00,'backend/public/images/products/xbox-series-x.jpg',1,'2026-02-01 20:26:03'),(3,'Nintendo Switch OLED','Portable or docked',18.00,'backend/public/images/products/nintendo-switch-oled.png',1,'2026-02-01 20:26:03'),(4,'Steam Deck OLED','PC library on the go',20.00,'backend/public/images/products/steam-deck-oled.png',1,'2026-02-01 20:26:03');
/*!40000 ALTER TABLE `console_catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `console_rentals`
--

DROP TABLE IF EXISTS `console_rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `console_rentals` (
  `RentalID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `ConsoleName` varchar(100) NOT NULL,
  `Plan` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `RentalDays` int(11) NOT NULL,
  `DailyRate` decimal(10,2) NOT NULL,
  `TotalPrice` decimal(10,2) NOT NULL,
  `DeliveryOption` varchar(50) NOT NULL,
  `Notes` text DEFAULT NULL,
  `Status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`RentalID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `console_rentals_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `console_rentals`
--

LOCK TABLES `console_rentals` WRITE;
/*!40000 ALTER TABLE `console_rentals` DISABLE KEYS */;
INSERT INTO `console_rentals` VALUES (1,3,'Nintendo Switch OLED','weekend','2026-02-01','2026-02-04',4,18.00,72.00,'pickup','','confirmed','2026-02-01 21:01:10'),(2,3,'PlayStation 5','weekend','2026-02-02','2026-02-05',4,25.00,100.00,'pickup','','pending','2026-02-02 09:08:20'),(3,3,'Steam Deck OLED','weekend','2026-02-02','2026-02-05',4,20.00,80.00,'pickup','','pending','2026-02-02 09:24:31'),(4,3,'Nintendo Switch OLED','weekend','2026-02-02','2026-02-05',4,18.00,72.00,'pickup','','cancelled','2026-02-02 20:41:30'),(5,4,'Xbox Series X','weekend','2026-02-03','2026-02-06',4,22.00,88.00,'pickup','just prepare the console','cancelled','2026-02-03 07:34:11'),(6,4,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','confirmed','2026-02-03 08:09:37'),(7,3,'Nintendo Switch OLED','weekend','2026-02-03','2026-02-06',4,18.00,72.00,'pickup','','cancelled','2026-02-03 08:32:39'),(8,3,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','confirmed','2026-02-03 08:32:43'),(9,3,'Steam Deck OLED','weekend','2026-02-03','2026-02-06',4,20.00,80.00,'pickup','','cancelled','2026-02-03 08:34:55'),(10,3,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','cancelled','2026-02-03 08:39:39'),(11,3,'Nintendo Switch OLED','weekend','2026-02-03','2026-02-06',4,18.00,72.00,'pickup','','cancelled','2026-02-03 08:43:09'),(12,3,'Nintendo Switch OLED','weekend','2026-02-03','2026-02-06',4,18.00,72.00,'pickup','','cancelled','2026-02-03 08:51:14'),(13,3,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','confirmed','2026-02-03 08:51:32'),(14,3,'Nintendo Switch OLED','weekend','2026-02-03','2026-02-06',4,18.00,72.00,'pickup','','cancelled','2026-02-03 08:59:57'),(15,4,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','confirmed','2026-02-03 09:01:01'),(16,3,'Nintendo Switch OLED','weekend','2026-02-03','2026-02-06',4,18.00,72.00,'pickup','','confirmed','2026-02-03 10:57:03'),(17,3,'Steam Deck OLED','weekend','2026-02-03','2026-02-06',4,20.00,80.00,'pickup','','cancelled','2026-02-03 10:57:08'),(18,3,'Steam Deck OLED','weekend','2026-02-03','2026-02-06',4,20.00,80.00,'pickup','','cancelled','2026-02-03 13:22:28'),(19,3,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','cancelled','2026-02-03 13:22:34'),(20,4,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','confirmed','2026-02-03 13:35:39'),(21,4,'PlayStation 5','weekend','2026-02-03','2026-02-06',4,25.00,100.00,'pickup','','cancelled','2026-02-03 13:35:40'),(22,4,'Steam Deck OLED','weekend','2026-02-03','2026-02-06',4,20.00,80.00,'pickup','','cancelled','2026-02-03 13:35:43');
/*!40000 ALTER TABLE `console_rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `NotificationID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) DEFAULT NULL,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `Type` varchar(50) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `IsRead` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  `ReferenceType` varchar(50) DEFAULT NULL,
  `ReferenceId` int(11) DEFAULT NULL,
  `StatusLabel` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`NotificationID`),
  KEY `UserID` (`UserID`),
  KEY `IsAdmin` (`IsAdmin`),
  KEY `IsRead` (`IsRead`),
  KEY `idx_notifications_admin_unread` (`IsAdmin`,`IsRead`,`CreatedAt`),
  KEY `idx_notifications_user_unread` (`UserID`,`IsRead`,`CreatedAt`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,NULL,1,'order','New order placed','User #3 placed an order. Total: 550 BAM',1,'2026-02-02 20:39:52',NULL,NULL,NULL),(2,NULL,1,'rental','New console rental submitted','User #3 submitted a rental for Nintendo Switch OLED (2026-02-02 to 2026-02-05).',1,'2026-02-02 20:41:30','console_rental',4,NULL),(3,NULL,1,'order','New order placed','VildanUser placed an order. Total: 350 BAM',0,'2026-02-03 07:33:33',NULL,NULL,NULL),(4,NULL,1,'rental','New console rental submitted','VildanUser submitted a rental for Xbox Series X (2026-02-03 to 2026-02-06).',1,'2026-02-03 07:34:11','console_rental',5,NULL),(5,NULL,1,'order','New order placed','Vildan placed an order. Total: 600 BAM',1,'2026-02-03 07:38:49',NULL,NULL,NULL),(6,NULL,1,'order','New order placed','Vildan placed an order. Total: 520 BAM',1,'2026-02-03 07:49:23',NULL,NULL,NULL),(7,4,0,'rental_status','Rental status update','Your rental for Xbox Series X was accepted.',1,'2026-02-03 07:57:13',NULL,NULL,NULL),(8,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 07:57:15',NULL,NULL,NULL),(9,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 08:01:30',NULL,NULL,NULL),(10,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 08:01:33',NULL,NULL,NULL),(11,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 08:01:34',NULL,NULL,NULL),(12,NULL,1,'rental','New console rental submitted','VildanUser submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:09:37','console_rental',6,NULL),(13,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',1,'2026-02-03 08:09:58',NULL,NULL,NULL),(14,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was declined.',1,'2026-02-03 08:09:59',NULL,NULL,NULL),(15,4,0,'rental_status','Rental status update','Your rental for Xbox Series X was declined.',1,'2026-02-03 08:10:07',NULL,NULL,NULL),(16,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',1,'2026-02-03 08:17:08',NULL,NULL,NULL),(17,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',1,'2026-02-03 08:17:21',NULL,NULL,NULL),(18,4,0,'rental_status','Rental status update','Your rental for Xbox Series X was declined.',1,'2026-02-03 08:17:24',NULL,NULL,NULL),(19,NULL,1,'order','New order placed','Vildan placed an order. Total: 520 BAM',0,'2026-02-03 08:32:01',NULL,NULL,NULL),(20,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Nintendo Switch OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:32:39','console_rental',7,NULL),(21,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:32:43','console_rental',8,NULL),(22,3,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',0,'2026-02-03 08:32:48',NULL,NULL,NULL),(23,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 08:32:50',NULL,NULL,NULL),(24,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Steam Deck OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:34:55','console_rental',9,NULL),(25,3,0,'rental_status','Rental status update','Your rental for Steam Deck OLED was declined.',0,'2026-02-03 08:35:02',NULL,NULL,NULL),(26,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:39:39','console_rental',10,NULL),(27,3,0,'rental_status','Rental status update','Your rental for PlayStation 5 was declined.',0,'2026-02-03 08:39:46',NULL,NULL,NULL),(28,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Nintendo Switch OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:43:09','console_rental',11,NULL),(29,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 08:43:13',NULL,NULL,NULL),(30,NULL,1,'contact','New contact message','Name: Vildan\nEmail: Kadric\nSubject: product\nMessage: Please inform me when you get iPhone 17 Pro Max 1TB.',0,'2026-02-03 08:50:58',NULL,NULL,NULL),(31,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Nintendo Switch OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:51:14','console_rental',12,'Declined'),(32,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 08:51:21',NULL,NULL,NULL),(33,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:51:32','console_rental',13,'Accepted'),(34,3,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',0,'2026-02-03 08:51:36',NULL,NULL,NULL),(35,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Nintendo Switch OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 08:59:57','console_rental',14,'Declined'),(36,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was declined.',0,'2026-02-03 09:00:12',NULL,NULL,NULL),(37,NULL,1,'order','New order placed','VildanUser placed an order. Total: 520 BAM',1,'2026-02-03 09:00:52',NULL,NULL,NULL),(38,NULL,1,'rental','New console rental submitted','VildanUser submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 09:01:01','console_rental',15,'Accepted'),(39,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',0,'2026-02-03 09:01:19',NULL,NULL,NULL),(40,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Nintendo Switch OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 10:57:03','console_rental',16,'Accepted'),(41,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Steam Deck OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 10:57:08','console_rental',17,'Declined'),(42,3,0,'rental_status','Rental status update','Your rental for Steam Deck OLED was declined.',0,'2026-02-03 10:59:24',NULL,NULL,NULL),(43,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for Steam Deck OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 13:22:28','console_rental',18,'Declined'),(44,NULL,1,'rental','New console rental submitted','Vildan submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 13:22:34','console_rental',19,'Declined'),(45,3,0,'rental_status','Rental status update','Your rental for PlayStation 5 was declined.',0,'2026-02-03 13:23:19',NULL,NULL,NULL),(46,3,0,'rental_status','Rental status update','Your rental for Steam Deck OLED was declined.',0,'2026-02-03 13:23:20',NULL,NULL,NULL),(47,3,0,'rental_status','Rental status update','Your rental for Nintendo Switch OLED was accepted.',0,'2026-02-03 13:23:22',NULL,NULL,NULL),(48,NULL,1,'rental','New console rental submitted','VildanUser submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 13:35:39','console_rental',20,'Accepted'),(49,NULL,1,'rental','New console rental submitted','VildanUser submitted a rental for PlayStation 5 (2026-02-03 to 2026-02-06).',1,'2026-02-03 13:35:40','console_rental',21,'Declined'),(50,NULL,1,'rental','New console rental submitted','VildanUser submitted a rental for Steam Deck OLED (2026-02-03 to 2026-02-06).',1,'2026-02-03 13:35:43','console_rental',22,'Declined'),(51,4,0,'rental_status','Rental status update','Your rental for Steam Deck OLED was declined.',0,'2026-02-03 13:35:53','console_rental',22,'Declined'),(52,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was declined.',0,'2026-02-03 13:35:54','console_rental',21,'Declined'),(53,4,0,'rental_status','Rental status update','Your rental for PlayStation 5 was accepted.',0,'2026-02-03 13:35:55','console_rental',20,'Accepted');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `OrderItemID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`OrderItemID`),
  KEY `OrderID` (`OrderID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,4,1,600.00),(2,1,11,1,2200.00),(3,1,1,1,550.00),(4,1,1,1,550.00),(5,1,1,1,550.00),(6,1,3,1,350.00),(7,1,4,1,600.00),(8,1,2,1,520.00),(9,1,2,1,520.00),(10,1,2,1,520.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `Status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `OrderDate` timestamp NULL DEFAULT current_timestamp(),
  `ShippingAddress` text NOT NULL,
  `ShippingCity` varchar(120) DEFAULT NULL,
  `ShippingPostalCode` varchar(20) DEFAULT NULL,
  `ShippingStreetNumber` varchar(30) DEFAULT NULL,
  `CardName` varchar(120) DEFAULT NULL,
  `CardLast4` varchar(4) DEFAULT NULL,
  `CardExpMonth` varchar(2) DEFAULT NULL,
  `CardExpYear` varchar(4) DEFAULT NULL,
  `PaymentProvider` varchar(30) DEFAULT NULL,
  `PaymentStatus` varchar(30) DEFAULT NULL,
  `StripePaymentIntentId` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,2800.00,'pending','2026-02-02 19:57:17','N/A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,3,550.00,'pending','2026-02-02 20:18:33','Franca Lehara','Sarajevo','71000','3','Vildan Kadric','4567','03','2030',NULL,NULL,NULL),(3,3,550.00,'pending','2026-02-02 20:37:02','Franca Lehara','Sarajevo','71000','3','Vildan Kadric','4567','03','2030',NULL,NULL,NULL),(4,3,550.00,'pending','2026-02-02 20:39:52','Franca Lehara','Sarajevo','71000','3','Vildan Kadric','7654','03','2030',NULL,NULL,NULL),(5,4,350.00,'pending','2026-02-03 07:33:33','Franca Lehara','Sarajevo','71000','4','Vildan Kadric','7654','12','2030',NULL,NULL,NULL),(6,3,600.00,'pending','2026-02-03 07:38:49','Franca Lehara','Sarajevo','71000','3','Vildan Kadric','3212','12','2030',NULL,NULL,NULL),(7,3,520.00,'pending','2026-02-03 07:49:23','Franca Lehara','Sarajevo','71000','7','Vildan Kadric','5432','12','2030',NULL,NULL,NULL),(8,3,520.00,'pending','2026-02-03 08:32:01','Franca Lehara','Sarajevo','71000','4','Vildan Kadric','4321','12','2027',NULL,NULL,NULL),(9,4,520.00,'pending','2026-02-03 09:00:52','Francuske revolucije bb','Ilidža','71210','3','Vildan Kadric','6543','12','2030',NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentMethod` enum('credit_card','paypal','bank_transfer') NOT NULL,
  `PaymentDate` timestamp NULL DEFAULT current_timestamp(),
  `TransactionID` varchar(100) DEFAULT NULL,
  `Status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  PRIMARY KEY (`PaymentID`),
  KEY `OrderID` (`OrderID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `OriginalPrice` decimal(10,2) DEFAULT NULL,
  `Stock` int(11) NOT NULL DEFAULT 0,
  `OnSale` tinyint(1) DEFAULT 0,
  `CategoryID` int(11) NOT NULL,
  `Description` text DEFAULT NULL,
  `ImageURL` varchar(255) DEFAULT NULL,
  `features` text DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ProductID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'PlayStation 5',550.00,600.00,22,1,1,'Next-gen console with ultra-fast SSD and 4K gaming.','backend/public/images/uploads/google-1770023976.jpg','Ultra-fast SSD\n4K gaming support\nDualSense controller','2026-02-01 18:25:31'),(2,'Xbox Series X',520.00,NULL,15,0,1,'Powerful Xbox console with 4K performance.','backend/public/images/products/xbox-series-x.png','4K gaming\nQuick Resume\n120 FPS support','2026-02-01 18:25:31'),(3,'Nintendo Switch OLED',350.00,420.00,29,1,1,'Hybrid console with vibrant OLED display.','backend/public/images/products/nintendo-switch-oled.png','7-inch OLED screen\nDocked & handheld\nEnhanced audio','2026-02-01 18:25:31'),(4,'RTX 4070 Super',600.00,NULL,10,0,2,'High-performance GPU for 1440p and 4K gaming.','backend/public/images/products/rtx-4070-super.jpg','DLSS 3 support\nRay tracing\nHigh efficiency','2026-02-01 18:25:31'),(5,'Gaming Headset Pro',90.00,108.00,40,1,3,'Surround sound headset with noise-cancelling mic.','backend/public/images/products/gaming-headset-pro.png','7.1 surround\nNoise-cancelling mic\nComfort fit','2026-02-01 18:25:31'),(6,'Mechanical Keyboard',120.00,NULL,35,0,3,'RGB mechanical keyboard with hot-swappable switches.','backend/public/images/products/mechanical-keyboard.jpg','RGB lighting\nHot-swappable\nAluminum frame','2026-02-01 18:25:31'),(7,'Cyber Adventure',60.00,72.00,50,1,4,'Open-world action RPG with dynamic combat.','backend/public/images/products/cyber-adventure.png','Open-world\nDynamic combat\nStory-rich','2026-02-01 18:25:31'),(8,'Racing Legends',50.00,NULL,28,0,4,'Realistic racing sim with online multiplayer.','backend/public/images/products/racing-legends.png','Realistic physics\nOnline multiplayer\n100+ cars','2026-02-01 18:25:31'),(9,'Pixel 9',1200.00,1300.00,20,1,5,'Google flagship with AI camera features.','backend/public/images/products/pixel-9.png','Tensor chipset\n50MP camera\n120Hz display','2026-02-01 20:24:15'),(10,'Galaxy S24 Ultra',2300.00,2400.00,15,1,5,'Premium Android with S Pen and top-tier cameras.','backend/public/images/products/galaxy-s24-ultra.jpg','S Pen\n200MP camera\nAMOLED 120Hz','2026-02-01 20:24:15'),(11,'iPhone 15 Pro',2200.00,0.00,17,0,5,'Titanium design with powerful A17 Pro chip.','backend/public/images/products/iphone-15-pro.jpg','A17 Pro\nPro cameras\nUSB-C','2026-02-01 20:24:15'),(12,'Nothing Phone (2)',1100.00,0.00,25,0,5,'Unique design with Glyph interface.','backend/public/images/products/nothing-phone-2.png','Glyph interface\nOLED 120Hz\nSnapdragon','2026-02-01 20:24:15'),(13,'OnePlus 12',1500.00,0.00,22,0,5,'Fast flagship performance with Hasselblad tuning.','backend/public/images/products/oneplus-12.png','Fast charge\nHasselblad\n120Hz','2026-02-01 20:24:15'),(14,'PlayStation 5 Slim',1000.00,0.00,14,0,6,'Slim model with same performance.','backend/public/images/products/playstation-5-slim.png','Slim design\n4K gaming\nDualSense','2026-02-01 20:24:15'),(15,'Xbox Series S',700.00,0.00,16,0,6,'Compact console with next-gen performance.','backend/public/images/products/xbox-series-s.jpg','1440p gaming\nGame Pass\nQuick Resume','2026-02-01 20:24:15'),(16,'Nintendo Switch Lite',450.00,0.00,20,0,6,'Portable-only Switch for on-the-go gaming.','backend/public/images/products/nintendo-switch-lite.jpg','Handheld only\nLightweight\nGreat battery','2026-02-01 20:24:15'),(17,'Meta Quest 3',1100.00,1200.00,12,1,6,'Next-gen standalone VR headset.','backend/public/images/products/meta-quest-3.jpg','Mixed reality\nHigh-res\nStandalone','2026-02-01 20:24:15'),(18,'Steam Deck LCD',900.00,0.00,10,0,6,'Handheld PC gaming console.','backend/public/images/products/steam-deck-lcd.png','PC library\nHandheld\nDockable','2026-02-01 20:24:15'),(19,'PSVR2',1300.00,1400.00,8,1,6,'High-fidelity VR for PS5.','backend/public/images/products/psvr2.png','4K HDR\nEye tracking\nHaptics','2026-02-01 20:24:15'),(20,'Xbox Elite Controller 2',450.00,0.00,25,0,6,'Pro-grade controller for competitive play.','backend/public/images/products/xbox-elite-controller-2.jpg','Adjustable sticks\nPaddles\nCustom profiles','2026-02-01 20:24:15'),(21,'27\" 1440p 165Hz Monitor',700.00,0.00,18,0,7,'Smooth gaming monitor with low latency.','backend/public/images/products/27-1440p-165hz-monitor.png','165Hz\n1ms\nQHD','2026-02-01 20:24:15'),(22,'RGB Gaming Mouse',90.00,100.00,40,1,7,'Lightweight mouse with programmable buttons.','backend/public/images/products/rgb-gaming-mouse.jpg','Lightweight\nDPI switch\nRGB','2026-02-01 20:24:15'),(23,'Mechanical Keyboard Pro',220.00,0.00,30,0,7,'Hot-swappable keyboard with premium switches.','backend/public/images/products/mechanical-keyboard-pro.jpg','Hot-swappable\nAluminum\nRGB','2026-02-01 20:24:15'),(24,'Streaming Microphone',160.00,0.00,25,0,7,'Studio-quality USB microphone.','backend/public/images/products/streaming-microphone.jpg','Cardioid\nUSB\nShock mount','2026-02-01 20:24:15'),(25,'Gaming Headset Lite',80.00,0.00,35,0,7,'Comfortable headset with clear mic.','backend/public/images/products/gaming-headset-lite.png','Comfort fit\nClear mic\nStereo','2026-02-01 20:24:15'),(26,'Desk Mouse Pad XL',40.00,0.00,60,0,7,'Full desk mat for keyboard and mouse.','backend/public/images/products/desk-mouse-pad-xl.jpg','XL size\nAnti-slip\nStitched edges','2026-02-01 20:24:15'),(27,'Gaming Bundle: Mouse + Keyboard',250.00,300.00,12,1,8,'Bundle deal with mechanical keyboard and RGB mouse.','backend/public/images/products/gaming-bundle-mouse-keyboard.jpg','Bundle\nSave 15%\nRGB','2026-02-01 20:24:15'),(28,'Console Starter Pack',1200.00,1400.00,8,1,8,'Console + extra controller + 1 game.','backend/public/images/products/console-starter-pack.jpg','Extra controller\n1 game\nSavings','2026-02-01 20:24:15'),(29,'PC Setup Essentials',550.00,650.00,10,1,8,'Monitor + headset + mouse pad.','backend/public/images/products/pc-setup-essentials.jpg','Bundle\nSave 100 BAM\nEssentials','2026-02-01 20:24:15'),(30,'Streamer Kit',400.00,500.00,6,1,8,'Microphone + lighting + stand.','backend/public/images/products/streamer-kit.jpg','Streaming\nLighting\nUSB mic','2026-02-01 20:24:15');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `RoleID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','2026-02-01 18:25:31'),(2,'User','2026-02-01 18:25:31');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Address` text DEFAULT NULL,
  `RoleID` int(11) NOT NULL DEFAULT 2,
  `role` int(11) GENERATED ALWAYS AS (`RoleID`) STORED,
  `is_admin` tinyint(1) GENERATED ALWAYS AS (case when `RoleID` = 1 then 1 else 0 end) STORED,
  `CreatedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@example.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9/3BzW4mJRyXQf4aXlA4e.','Admin HQ',1,1,1,'2026-02-01 18:25:31'),(2,'Customer','user@example.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9/3BzW4mJRyXQf4aXlA4e.','Customer Address',2,2,0,'2026-02-01 18:25:31'),(3,'Vildan','vildan.kadric@stu.ibu.edu.ba','$2y$10$Cwayf9yV1kfc6YMOz/kp2eoe8hPDSNinC3RHkPC/WbPZGVDY1sx6.',NULL,1,1,1,'2026-02-01 21:00:09'),(4,'VildanUser','vildan@gmail.com','$2y$10$c9VY/2NtQYeg8/2LPNAaSeZZmDaXO1ciJpQEF49Un.YKPCth2ekxK',NULL,2,2,0,'2026-02-03 07:30:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wishlist` (
  `WishlistID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `AddedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`WishlistID`),
  UNIQUE KEY `unique_wishlist_item` (`UserID`,`ProductID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 16:30:52
