<?php
require_once __DIR__ . '/../config/Config.php';
$dsn = "mysql:host=" . Config::DATABASE_HOST() . ";dbname=" . Config::DATABASE_NAME() . ";charset=utf8mb4";
$pdo = new PDO($dsn, Config::DATABASE_USERNAME(), Config::DATABASE_PASSWORD(), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$tables = [
  ['name' => 'products', 'id' => 'ProductID', 'label' => 'Name'],
  ['name' => 'console_catalog', 'id' => 'ConsoleID', 'label' => 'Name'],
];
foreach ($tables as $t) {
  $stmt = $pdo->query("SELECT {$t['id']} AS id, {$t['label']} AS name, ImageURL FROM {$t['name']} ORDER BY {$t['id']}");
  echo "== {$t['name']} ==\n";
  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $url = $row['ImageURL'] ?? '';
    $type = preg_match('/^https?:\/\//i', $url) ? 'http' : 'local';
    echo "{$row['id']} | {$row['name']} | {$type} | {$url}\n";
  }
}
