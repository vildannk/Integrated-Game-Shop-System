<?php
require_once __DIR__ . '/../config/Config.php';

function http_get_json($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GameGearImageCache/1.0');
    $response = curl_exec($ch);
    $err = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $err || $code >= 400) {
        return null;
    }

    $data = json_decode($response, true);
    return is_array($data) ? $data : null;
}

function fetch_wikipedia_image($query)
{
    $searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' . urlencode($query) . '&srlimit=5&format=json';
    $search = http_get_json($searchUrl);
    if (!$search || empty($search['query']['search'])) {
        return null;
    }

    foreach ($search['query']['search'] as $result) {
        $title = $result['title'] ?? null;
        if (!$title) {
            continue;
        }
        $imgUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&titles=' . urlencode($title) . '&format=json';
        $img = http_get_json($imgUrl);
        if (!$img || empty($img['query']['pages'])) {
            continue;
        }
        $pages = $img['query']['pages'];
        $page = array_values($pages)[0] ?? null;
        if (!$page || empty($page['original']['source'])) {
            continue;
        }
        $source = $page['original']['source'];
        if (preg_match('/\.svg$/i', $source)) {
            continue;
        }
        return $source;
    }

    return null;
}

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

$items = [
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'PlayStation 5', 'query' => 'PlayStation 5 console'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Xbox Series X', 'query' => 'Xbox Series X console'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Nintendo Switch OLED', 'query' => 'Nintendo Switch OLED'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'RTX 4070 Super', 'query' => 'GeForce RTX 4070 Super'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Gaming Headset Pro', 'query' => 'gaming headset'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Mechanical Keyboard', 'query' => 'mechanical keyboard'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Cyber Adventure', 'query' => 'video game screenshot'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Racing Legends', 'query' => 'racing game screenshot'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Pixel 9', 'query' => 'Google Pixel smartphone'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Galaxy S24 Ultra', 'query' => 'Samsung Galaxy S24 Ultra'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'iPhone 15 Pro', 'query' => 'iPhone 15 Pro'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Nothing Phone (2)', 'query' => 'Nothing Phone 2'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'OnePlus 12', 'query' => 'OnePlus 12'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'PlayStation 5 Slim', 'query' => 'PlayStation 5 Slim'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Xbox Series S', 'query' => 'Xbox Series S'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Nintendo Switch Lite', 'query' => 'Nintendo Switch Lite'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Meta Quest 3', 'query' => 'Meta Quest 3'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Steam Deck LCD', 'query' => 'Steam Deck handheld'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'PSVR2', 'query' => 'PlayStation VR2'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Xbox Elite Controller 2', 'query' => 'Xbox Elite Controller Series 2'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => '27" 1440p 165Hz Monitor', 'query' => 'gaming monitor'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'RGB Gaming Mouse', 'query' => 'gaming mouse'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Mechanical Keyboard Pro', 'query' => 'mechanical keyboard'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Streaming Microphone', 'query' => 'USB microphone'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Gaming Headset Lite', 'query' => 'gaming headset'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Desk Mouse Pad XL', 'query' => 'desk mouse pad'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Gaming Bundle: Mouse + Keyboard', 'query' => 'gaming keyboard and mouse'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Console Starter Pack', 'query' => 'video game console'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'PC Setup Essentials', 'query' => 'gaming setup desk'],
    ['table' => 'products', 'id' => 'ProductID', 'name' => 'Streamer Kit', 'query' => 'streaming kit microphone light'],
    ['table' => 'console_catalog', 'id' => 'ConsoleID', 'name' => 'PlayStation 5', 'query' => 'PlayStation 5 console'],
    ['table' => 'console_catalog', 'id' => 'ConsoleID', 'name' => 'Xbox Series X', 'query' => 'Xbox Series X console'],
    ['table' => 'console_catalog', 'id' => 'ConsoleID', 'name' => 'Nintendo Switch OLED', 'query' => 'Nintendo Switch OLED'],
    ['table' => 'console_catalog', 'id' => 'ConsoleID', 'name' => 'Steam Deck OLED', 'query' => 'Steam Deck handheld'],
];

try {
    $pdo = connect_db();
    foreach ($items as $item) {
        $lookup = $pdo->prepare("SELECT {$item['id']} AS id FROM {$item['table']} WHERE Name = :name LIMIT 1");
        $lookup->execute([':name' => $item['name']]);
        $row = $lookup->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            echo "Skip (not found): {$item['table']} {$item['name']}\n";
            continue;
        }
        $source = fetch_wikipedia_image($item['query']);
        if (!$source) {
            echo "No image found: {$item['name']}\n";
            continue;
        }
        [$filename, $err] = save_image($productsDir, $item['name'], $source);
        if (!$filename) {
            echo "Failed: {$item['name']} -> {$err}\n";
            continue;
        }
        $localUrl = 'backend/public/images/products/' . $filename;
        $update = $pdo->prepare("UPDATE {$item['table']} SET ImageURL = :url WHERE {$item['id']} = :id");
        $update->execute([':url' => $localUrl, ':id' => $row['id']]);
        echo "Updated: {$item['table']} {$item['name']} -> {$localUrl}\n";
    }

    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
