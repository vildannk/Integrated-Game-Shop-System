-- Fresh schema + seed data for the Game Shop + Console Rental platform
-- Safe for local dev: drops existing tables and recreates with consistent structure

CREATE DATABASE IF NOT EXISTS webprojekat;
USE webprojekat;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS console_rentals;
DROP TABLE IF EXISTS console_catalog;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
  RoleID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL,
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (RoleID),
  UNIQUE KEY (Name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE users (
  UserID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Address TEXT NULL,
  RoleID INT NOT NULL DEFAULT 2,
  role INT GENERATED ALWAYS AS (RoleID) STORED,
  is_admin TINYINT(1) GENERATED ALWAYS AS (CASE WHEN RoleID = 1 THEN 1 ELSE 0 END) STORED,
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (UserID),
  UNIQUE KEY (Email),
  KEY (RoleID),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (RoleID) REFERENCES roles (RoleID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE categories (
  CategoryID INT NOT NULL AUTO_INCREMENT,
  CategoryName VARCHAR(100) NOT NULL,
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (CategoryID),
  UNIQUE KEY (CategoryName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE products (
  ProductID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(255) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  OriginalPrice DECIMAL(10,2) NULL,
  Stock INT NOT NULL DEFAULT 0,
  OnSale TINYINT(1) DEFAULT 0,
  CategoryID INT NOT NULL,
  Description TEXT,
  ImageURL VARCHAR(255) DEFAULT NULL,
  features TEXT,
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ProductID),
  KEY (CategoryID),
  CONSTRAINT products_ibfk_1 FOREIGN KEY (CategoryID) REFERENCES categories (CategoryID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE cart (
  CartID INT NOT NULL AUTO_INCREMENT,
  UserID INT NOT NULL,
  price_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('active','ordered') NOT NULL DEFAULT 'active',
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (CartID),
  UNIQUE KEY (UserID),
  CONSTRAINT cart_ibfk_1 FOREIGN KEY (UserID) REFERENCES users (UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE cart_items (
  CartItemID INT NOT NULL AUTO_INCREMENT,
  CartID INT NOT NULL,
  ProductID INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (CartItemID),
  UNIQUE KEY unique_cart_item (CartID, ProductID),
  KEY (ProductID),
  CONSTRAINT cart_items_ibfk_1 FOREIGN KEY (CartID) REFERENCES cart (CartID) ON DELETE CASCADE,
  CONSTRAINT cart_items_ibfk_2 FOREIGN KEY (ProductID) REFERENCES products (ProductID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE orders (
  OrderID INT NOT NULL AUTO_INCREMENT,
  UserID INT NOT NULL,
  TotalAmount DECIMAL(10,2) NOT NULL,
  Status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  OrderDate TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  ShippingAddress TEXT NOT NULL,
  ShippingCity VARCHAR(120) NULL,
  ShippingPostalCode VARCHAR(20) NULL,
  ShippingStreetNumber VARCHAR(30) NULL,
  CardName VARCHAR(120) NULL,
  CardLast4 VARCHAR(4) NULL,
  CardExpMonth VARCHAR(2) NULL,
  CardExpYear VARCHAR(4) NULL,
  PRIMARY KEY (OrderID),
  KEY (UserID),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY (UserID) REFERENCES users (UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE order_items (
  OrderItemID INT NOT NULL AUTO_INCREMENT,
  OrderID INT NOT NULL,
  ProductID INT NOT NULL,
  Quantity INT NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  OriginalPrice DECIMAL(10,2) NULL,
  PRIMARY KEY (OrderItemID),
  KEY (OrderID),
  KEY (ProductID),
  CONSTRAINT order_items_ibfk_1 FOREIGN KEY (OrderID) REFERENCES orders (OrderID),
  CONSTRAINT order_items_ibfk_2 FOREIGN KEY (ProductID) REFERENCES products (ProductID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE notifications (
  NotificationID INT NOT NULL AUTO_INCREMENT,
  UserID INT NULL,
  IsAdmin TINYINT(1) NOT NULL DEFAULT 0,
  Type VARCHAR(50) NOT NULL,
  Title VARCHAR(255) NOT NULL,
  Message TEXT NOT NULL,
  ReferenceType VARCHAR(50) NULL,
  ReferenceId INT NULL,
  StatusLabel VARCHAR(20) NULL,
  IsRead TINYINT(1) NOT NULL DEFAULT 0,
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (NotificationID),
  KEY (UserID),
  KEY (IsAdmin),
  KEY (IsRead),
  CONSTRAINT notifications_ibfk_1 FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE console_rentals (
  RentalID INT NOT NULL AUTO_INCREMENT,
  UserID INT NOT NULL,
  ConsoleName VARCHAR(100) NOT NULL,
  Plan VARCHAR(50) NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE NOT NULL,
  RentalDays INT NOT NULL,
  DailyRate DECIMAL(10,2) NOT NULL,
  TotalPrice DECIMAL(10,2) NOT NULL,
  OriginalPrice DECIMAL(10,2) NULL,
  DeliveryOption VARCHAR(50) NOT NULL,
  Notes TEXT NULL,
  Status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  CreatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (RentalID),
  KEY (UserID),
  CONSTRAINT console_rentals_ibfk_1 FOREIGN KEY (UserID) REFERENCES users (UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Seed data
INSERT INTO roles (RoleID, Name) VALUES
  (1, 'Admin'),
  (2, 'User');

-- Password for both users below is: "password"
INSERT INTO users (UserID, Name, Email, Password, Address, RoleID) VALUES
  (1, 'Admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9/3BzW4mJRyXQf4aXlA4e.', 'Admin HQ', 1),
  (2, 'Customer', 'user@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9/3BzW4mJRyXQf4aXlA4e.', 'Customer Address', 2);

INSERT INTO categories (CategoryID, CategoryName) VALUES
  (1, 'Gaming Consoles'),
  (2, 'PC Components'),
  (3, 'Accessories'),
  (4, 'Games'),
  (5, 'Phones'),
  (6, 'Consoles'),
  (7, 'PC Gadgets'),
  (8, 'Deals & Offers');

INSERT INTO products (ProductID, Name, Price, OriginalPrice, Stock, OnSale, CategoryID, Description, ImageURL, features) VALUES
  (1, 'PlayStation 5', 499.95, 599.95, 25, 1, 1, 'Next-gen console with ultra-fast SSD and 4K gaming.', 'backend/public/images/products/ps5.jpg',
   'Ultra-fast SSD\n4K gaming support\nDualSense controller'),
  (2, 'Xbox Series X', 520.00, NULL, 18, 0, 1, 'Powerful Xbox console with 4K performance.', 'backend/public/images/products/xbox-series-x.jpg',
   '4K gaming\nQuick Resume\n120 FPS support'),
  (3, 'Nintendo Switch OLED', 349.95, 419.95, 30, 1, 1, 'Hybrid console with vibrant OLED display.', 'backend/public/images/products/switch-oled.jpg',
   '7-inch OLED screen\nDocked & handheld\nEnhanced audio'),
  (4, 'RTX 4070 Super', 599.95, NULL, 12, 0, 2, 'High-performance GPU for 1440p and 4K gaming.', 'backend/public/images/products/rtx-4070.jpg',
   'DLSS 3 support\nRay tracing\nHigh efficiency'),
  (5, 'Gaming Headset Pro', 89.95, 109.95, 40, 1, 3, 'Surround sound headset with noise-cancelling mic.', 'backend/public/images/products/gaming-headset.jpg',
   '7.1 surround\nNoise-cancelling mic\nComfort fit'),
  (6, 'Mechanical Keyboard', 119.95, NULL, 35, 0, 3, 'RGB mechanical keyboard with hot-swappable switches.', 'backend/public/images/products/mechanical-keyboard.jpg',
   'RGB lighting\nHot-swappable\nAluminum frame'),
  (7, 'Cyber Adventure', 59.95, 69.95, 50, 1, 4, 'Open-world action RPG with dynamic combat.', 'backend/public/images/products/game-cyber-adventure.png',
   'Open-world\nDynamic combat\nStory-rich'),
  (8, 'Racing Legends', 49.95, NULL, 28, 0, 4, 'Realistic racing sim with online multiplayer.', 'backend/public/images/products/game-racing-legends.jpg',
   'Realistic physics\nOnline multiplayer\n100+ cars');


INSERT INTO products (Name, Price, OriginalPrice, Stock, OnSale, CategoryID, Description, ImageURL, features) VALUES
  ('Pixel 9', 1200.00, 1300.00, 20, 1, 5, 'Google flagship with AI camera features.', 'backend/public/images/products/phone-pixel-9.jpg', 'Tensor chipset\n50MP camera\n120Hz display'),
  ('Galaxy S24 Ultra', 2300.00, 2400.00, 15, 1, 5, 'Premium Android with S Pen and top-tier cameras.', 'backend/public/images/products/phone-galaxy-s24-ultra.jpg', 'S Pen\n200MP camera\nAMOLED 120Hz'),
  ('iPhone 15 Pro', 2200.00, NULL, 18, 0, 5, 'Titanium design with powerful A17 Pro chip.', 'backend/public/images/products/phone-iphone-15-pro.jpg', 'A17 Pro\nPro cameras\nUSB-C'),
  ('Nothing Phone (2)', 1100.00, NULL, 25, 0, 5, 'Unique design with Glyph interface.', 'backend/public/images/products/phone-nothing-2.jpg', 'Glyph interface\nOLED 120Hz\nSnapdragon'),
  ('OnePlus 12', 1500.00, NULL, 22, 0, 5, 'Fast flagship performance with Hasselblad tuning.', 'backend/public/images/products/phone-oneplus-12.jpg', 'Fast charge\nHasselblad\n120Hz'),
  ('PlayStation 5 Slim', 1000.00, NULL, 14, 0, 6, 'Slim model with same performance.', 'backend/public/images/products/console-ps5-slim.jpg', 'Slim design\n4K gaming\nDualSense'),
  ('Xbox Series S', 700.00, NULL, 16, 0, 6, 'Compact console with next-gen performance.', 'backend/public/images/products/console-xbox-series-s.jpg', '1440p gaming\nGame Pass\nQuick Resume'),
  ('Nintendo Switch Lite', 450.00, NULL, 20, 0, 6, 'Portable-only Switch for on-the-go gaming.', 'backend/public/images/products/console-switch-lite.jpg', 'Handheld only\nLightweight\nGreat battery'),
  ('Meta Quest 3', 1100.00, 1200.00, 12, 1, 6, 'Next-gen standalone VR headset.', 'backend/public/images/products/console-quest-3.jpg', 'Mixed reality\nHigh-res\nStandalone'),
  ('Steam Deck LCD', 900.00, NULL, 10, 0, 6, 'Handheld PC gaming console.', 'backend/public/images/products/console-steam-deck.jpg', 'PC library\nHandheld\nDockable'),
  ('PSVR2', 1300.00, 1400.00, 8, 1, 6, 'High-fidelity VR for PS5.', 'backend/public/images/products/console-psvr2.jpg', '4K HDR\nEye tracking\nHaptics'),
  ('Xbox Elite Controller 2', 450.00, NULL, 25, 0, 6, 'Pro-grade controller for competitive play.', 'backend/public/images/products/console-elite-controller.jpg', 'Adjustable sticks\nPaddles\nCustom profiles'),
  ('27" 1440p 165Hz Monitor', 700.00, NULL, 18, 0, 7, 'Smooth gaming monitor with low latency.', 'backend/public/images/products/pc-monitor-27-165.jpg', '165Hz\n1ms\nQHD'),
  ('RGB Gaming Mouse', 90.00, 100.00, 40, 1, 7, 'Lightweight mouse with programmable buttons.', 'backend/public/images/products/pc-mouse-rgb.jpg', 'Lightweight\nDPI switch\nRGB'),
  ('Mechanical Keyboard Pro', 220.00, NULL, 30, 0, 7, 'Hot-swappable keyboard with premium switches.', 'backend/public/images/products/pc-keyboard-pro.jpg', 'Hot-swappable\nAluminum\nRGB'),
  ('Streaming Microphone', 160.00, NULL, 25, 0, 7, 'Studio-quality USB microphone.', 'backend/public/images/products/pc-mic-usb.jpg', 'Cardioid\nUSB\nShock mount'),
  ('Gaming Headset Lite', 80.00, NULL, 35, 0, 7, 'Comfortable headset with clear mic.', 'backend/public/images/products/pc-headset-lite.jpg', 'Comfort fit\nClear mic\nStereo'),
  ('Desk Mouse Pad XL', 40.00, NULL, 60, 0, 7, 'Full desk mat for keyboard and mouse.', 'backend/public/images/products/pc-mousepad-xl.jpg', 'XL size\nAnti-slip\nStitched edges'),
  ('Gaming Bundle: Mouse + Keyboard', 250.00, 300.00, 12, 1, 8, 'Bundle deal with mechanical keyboard and RGB mouse.', 'backend/public/images/products/deal-mouse-keyboard.jpg', 'Bundle\nSave 15%\nRGB'),
  ('Console Starter Pack', 1200.00, 1400.00, 8, 1, 8, 'Console + extra controller + 1 game.', 'backend/public/images/products/deal-console-pack.jpg', 'Extra controller\n1 game\nSavings'),
  ('PC Setup Essentials', 550.00, 650.00, 10, 1, 8, 'Monitor + headset + mouse pad.', 'backend/public/images/products/deal-pc-essentials.jpg', 'Bundle\nSave 100 BAM\nEssentials'),
  ('Streamer Kit', 400.00, 500.00, 6, 1, 8, 'Microphone + lighting + stand.', 'backend/public/images/products/deal-streamer-kit.jpg', 'Streaming\nLighting\nUSB mic');
-- Optional starter cart for the seeded customer
INSERT INTO cart (CartID, UserID, price_total, status) VALUES
  (1, 2, 0.00, 'active');

INSERT INTO cart_items (CartID, ProductID, quantity) VALUES
  (1, 1, 1),
  (1, 5, 2);






INSERT INTO console_catalog (ConsoleID, Name, Description, DailyRate, ImageURL, Active) VALUES
  (1, 'PlayStation 5', 'DualSense + 4K ready', 25.00, 'backend/public/images/products/ps5.jpg', 1),
  (2, 'Xbox Series X', 'Game Pass ready', 22.00, 'backend/public/images/products/xbox-series-x.jpg', 1),
  (3, 'Nintendo Switch OLED', 'Portable or docked', 18.00, 'backend/public/images/products/switch-oled.jpg', 1),
  (4, 'Steam Deck OLED', 'PC library on the go', 20.00, 'backend/public/images/products/steam-deck.jpg', 1);






