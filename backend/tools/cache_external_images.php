<?php
require_once __DIR__ . '/../config/Config.php';

function connect_db()
{
    $dsn = "mysql:host=" . Config::DATABASE_HOST() . ";dbname=" . Config::DATABASE_NAME() . ";charset=utf8mb4";
    return new PDO($dsn, Config::DATABASE_USERNAME(), Config::DATABASE_PASSWORD(), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
}

function slugify($text)
{
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/i', '-', $text);
    $text = trim($text, '-');
    return $text ?: 'image';
}

function guess_ext($url, $contentType)
{
    $path = parse_url($url, PHP_URL_PATH) ?: '';
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if ($ext && in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
        return $ext === 'jpeg' ? 'jpg' : $ext;
    }
    if (stripos($contentType, 'image/png') !== false) return 'png';
    if (stripos($contentType, 'image/webp') !== false) return 'webp';
    return 'jpg';
}

function download_image($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GameGearImageCache/1.0');
    $data = curl_exec($ch);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: '';
    $err = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($data === false || $err || $code >= 400) {
        return [null, null, "HTTP $code $err"];
    }

    return [$data, $contentType, null];
}

function save_image($dir, $name, $url)
{
    [$data, $contentType, $error] = download_image($url);
    if (!$data) {
        return [null, $error ?: 'Download failed'];
    }
    $ext = guess_ext($url, $contentType);
    $base = slugify($name);
    $filename = $base . '.' . $ext;
    $path = $dir . DIRECTORY_SEPARATOR . $filename;
    $i = 1;
    while (file_exists($path)) {
        $filename = $base . '-' . $i . '.' . $ext;
        $path = $dir . DIRECTORY_SEPARATOR . $filename;
        $i++;
    }
    file_put_contents($path, $data);
    return [$filename, null];
}

$imgDir = realpath(__DIR__ . '/../public/images');
if (!$imgDir) {
    $imgDir = __DIR__ . '/../public/images';
}
$productsDir = $imgDir . DIRECTORY_SEPARATOR . 'products';
if (!is_dir($productsDir)) {
    mkdir($productsDir, 0755, true);
}

try {
    $pdo = connect_db();
    $tables = [
        ['name' => 'products', 'id' => 'ProductID', 'label' => 'Name'],
        ['name' => 'console_catalog', 'id' => 'ConsoleID', 'label' => 'Name'],
    ];

    foreach ($tables as $t) {
        $stmt = $pdo->query("SELECT {$t['id']} AS id, {$t['label']} AS name, ImageURL FROM {$t['name']}");
        $update = $pdo->prepare("UPDATE {$t['name']} SET ImageURL = :url WHERE {$t['id']} = :id");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $url = $row['ImageURL'] ?? '';
            if (!$url || !preg_match('/^https?:\/\//i', $url)) {
                continue;
            }
            [$filename, $err] = save_image($productsDir, $row['name'], $url);
            if (!$filename) {
                echo "Failed: {$t['name']} {$row['id']} {$row['name']} -> {$err}\n";
                continue;
            }
            $localUrl = 'backend/public/images/products/' . $filename;
            $update->execute([':url' => $localUrl, ':id' => $row['id']]);
            echo "Saved: {$t['name']} {$row['id']} {$row['name']} -> {$localUrl}\n";
        }
    }

    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
