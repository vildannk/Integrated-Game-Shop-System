<?php

// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

class Config
{
    public static function DATABASE_NAME()
    {
        return 'webprojekat';
    }
    public static function DATABASE_PORT()
    {
        return 3306;
    }
    public static function DATABASE_USERNAME()
    {
        return 'root';
    }
    public static function DATABASE_PASSWORD()
    {
        return '';
    }
    public static function DATABASE_HOST()
    {
        return '127.0.0.1';
    }
    public static function JWT_SECRET()
    {
        return 'SEProject2025';
    }

    public static function EMAIL_FROM()
    {
        return 'no-reply@gamegear.local';
    }
}
