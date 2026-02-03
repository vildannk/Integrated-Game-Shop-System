<?php

require_once __DIR__ . '/../config/Config.php';

class Database{

  private static $connection = null;



    public static function connect() {
        if (self::$connection === null) {
            try {
                self::$connection = new PDO(
                    "mysql:host=" . Config::DATABASE_HOST() . ";dbname=" . Config::DATABASE_NAME(),
                    Config::DATABASE_USERNAME(),
                    Config::DATABASE_PASSWORD(),
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );
            } catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}

