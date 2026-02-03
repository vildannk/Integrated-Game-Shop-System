<?php
require_once __DIR__ . '/../config/Config.php';

function connect_db()
{
    $dsn = "mysql:host=" . Config::DATABASE_HOST() . ";dbname=" . Config::DATABASE_NAME() . ";charset=utf8mb4";
    return new PDO($dsn, Config::DATABASE_USERNAME(), Config::DATABASE_PASSWORD(), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
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

$imgDir = realpath(__DIR__ . '/../public/images');
if (!$imgDir) {
    $imgDir = __DIR__ . '/../public/images';
}
$productsDir = $imgDir . DIRECTORY_SEPARATOR . 'products';
if (!is_dir($productsDir)) {
    mkdir($productsDir, 0755, true);
}

$items = [
    [
        'table' => 'products',
        'idCol' => 'ProductID',
        'name' => 'Pixel 9',
        'url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Google_Pixel_9_%28Obsidian%29_front.svg/330px-Google_Pixel_9_%28Obsidian%29_front.svg.png',
        'filename' => 'pixel-9'
    ],
    [
        'table' => 'products',
        'idCol' => 'ProductID',
        'name' => 'iPhone 15 Pro',
        'url' => 'https://upload.wikimedia.org/wikipedia/commons/4/43/IPhone_15_Pro.jpg',
        'filename' => 'iphone-15-pro'
    ],
    [
        'table' => 'products',
        'idCol' => 'ProductID',
        'name' => 'Xbox Series S',
        'url' => 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Xbox_Series_S_with_controller_and_box.jpg',
        'filename' => 'xbox-series-s'
    ],
    [
        'table' => 'console_catalog',
        'idCol' => 'ConsoleID',
        'name' => 'Xbox Series X',
        'url' => 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Xbox_series_X_%2850648118708%29.jpg',
        'filename' => 'xbox-series-x'
    ],
];

try {
    $pdo = connect_db();
    foreach ($items as $item) {
        $lookup = $pdo->prepare("SELECT {$item['idCol']} AS id FROM {$item['table']} WHERE Name = :name LIMIT 1");
        $lookup->execute([':name' => $item['name']]);
        $row = $lookup->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            echo "Skip (not found): {$item['table']} {$item['name']}\n";
            continue;
        }
        [$data, $contentType, $err] = download_image($item['url']);
        if (!$data) {
            echo "Failed: {$item['name']} -> {$err}\n";
            continue;
        }
        $ext = guess_ext($item['url'], $contentType);
        $filename = $item['filename'] . '.' . $ext;
        $path = $productsDir . DIRECTORY_SEPARATOR . $filename;
        file_put_contents($path, $data);
        $localUrl = 'backend/public/images/products/' . $filename;
        $update = $pdo->prepare("UPDATE {$item['table']} SET ImageURL = :url WHERE {$item['idCol']} = :id");
        $update->execute([':url' => $localUrl, ':id' => $row['id']]);
        echo "Updated: {$item['table']} {$item['name']} -> {$localUrl}\n";
    }

    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
