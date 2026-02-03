<?php
// Serve static OpenAPI spec instead of scanning annotations.
ini_set('display_errors', 0);
error_reporting(E_ERROR);

$specPath = __DIR__ . '/../../../openapi.json';
if (!file_exists($specPath)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'OpenAPI spec not found']);
    exit;
}

header('Content-Type: application/json');
echo file_get_contents($specPath);
exit;
