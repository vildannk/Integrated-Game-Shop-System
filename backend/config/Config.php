<?php

// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

class Config
{
    public static function DATABASE_NAME()
    {
        $fromEnv = getenv('DB_NAME');
        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : 'webprojekat';
    }
    public static function DATABASE_PORT()
    {
        $fromEnv = getenv('DB_PORT');
        if ($fromEnv !== false && $fromEnv !== '') {
            return (int)$fromEnv;
        }
        return 3306;
    }
    public static function DATABASE_USERNAME()
    {
        $fromEnv = getenv('DB_USER');
        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : 'root';
    }
    public static function DATABASE_PASSWORD()
    {
        $fromEnv = getenv('DB_PASS');
        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : '';
    }
    public static function DATABASE_HOST()
    {
        $fromEnv = getenv('DB_HOST');
        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : '127.0.0.1';
    }
    public static function JWT_SECRET()
    {
        $fromEnv = getenv('JWT_SECRET');
        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : 'SEProject2025';
    }

    public static function EMAIL_FROM()
    {
        $fromEnv = getenv('EMAIL_FROM');
        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : 'vildan.kadric@stu.ibu.edu.ba';
    }
}
