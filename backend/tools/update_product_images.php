<?php
require_once __DIR__ . '/../config/Config.php';

function http_get_json($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GameGearImageBot/1.0');
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($response === false || $err) {
        return null;
    }

    $data = json_decode($response, true);
    return is_array($data) ? $data : null;
}

function fetch_wikipedia_image($query, &$used)
{
    $searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' . urlencode($query) . '&srlimit=5&format=json';
    $search = http_get_json($searchUrl);
    if (!$search || empty($search['query']['search'])) {
        return null;
    }

    foreach ($search['query']['search'] as $result) {
        if (empty($result['title'])) {
            continue;
        }
        $title = $result['title'];
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
        if (in_array($source, $used, true)) {
            continue;
        }

        $used[] = $source;
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

$products = [
    ['name' => 'PlayStation 5', 'query' => 'PlayStation 5 console'],
    ['name' => 'Xbox Series X', 'query' => 'Xbox Series X console'],
    ['name' => 'Nintendo Switch OLED', 'query' => 'Nintendo Switch OLED'],
    ['name' => 'RTX 4070 Super', 'query' => 'GeForce RTX 4070 Super'],
    ['name' => 'Gaming Headset Pro', 'query' => 'gaming headset'],
    ['name' => 'Mechanical Keyboard', 'query' => 'mechanical keyboard'],
    ['name' => 'Cyber Adventure', 'query' => 'video game screenshot'],
    ['name' => 'Racing Legends', 'query' => 'racing game screenshot'],
    ['name' => 'Pixel 9', 'query' => 'Google Pixel smartphone'],
    ['name' => 'Galaxy S24 Ultra', 'query' => 'Samsung Galaxy S24 Ultra'],
    ['name' => 'iPhone 15 Pro', 'query' => 'iPhone 15 Pro'],
    ['name' => 'Nothing Phone (2)', 'query' => 'Nothing Phone 2'],
    ['name' => 'OnePlus 12', 'query' => 'OnePlus 12'],
    ['name' => 'PlayStation 5 Slim', 'query' => 'PlayStation 5 Slim'],
    ['name' => 'Xbox Series S', 'query' => 'Xbox Series S'],
    ['name' => 'Nintendo Switch Lite', 'query' => 'Nintendo Switch Lite'],
    ['name' => 'Meta Quest 3', 'query' => 'Meta Quest 3'],
    ['name' => 'Steam Deck LCD', 'query' => 'Steam Deck'],
    ['name' => 'PSVR2', 'query' => 'PlayStation VR2'],
    ['name' => 'Xbox Elite Controller 2', 'query' => 'Xbox Elite Controller Series 2'],
    ['name' => '27" 1440p 165Hz Monitor', 'query' => 'gaming monitor'],
    ['name' => 'RGB Gaming Mouse', 'query' => 'gaming mouse'],
    ['name' => 'Mechanical Keyboard Pro', 'query' => 'mechanical keyboard'],
    ['name' => 'Streaming Microphone', 'query' => 'USB microphone'],
    ['name' => 'Gaming Headset Lite', 'query' => 'gaming headset'],
    ['name' => 'Desk Mouse Pad XL', 'query' => 'desk mouse pad'],
    ['name' => 'Gaming Bundle: Mouse + Keyboard', 'query' => 'gaming keyboard and mouse'],
    ['name' => 'Console Starter Pack', 'query' => 'video game console'],
    ['name' => 'PC Setup Essentials', 'query' => 'gaming setup desk'],
    ['name' => 'Streamer Kit', 'query' => 'streaming kit microphone light'],
];

try {
    $pdo = connect_db();
    $update = $pdo->prepare('UPDATE products SET ImageURL = :url WHERE Name = :name');
    $used = [];

    foreach ($products as $product) {
        $url = fetch_wikipedia_image($product['query'], $used);
        if (!$url) {
            echo "No image found for: {$product['name']}\n";
            continue;
        }
        $update->execute([
            ':url' => $url,
            ':name' => $product['name']
        ]);
        echo "Updated: {$product['name']} -> {$url}\n";
    }

    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
