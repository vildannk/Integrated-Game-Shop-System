<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /products', function () {
    $categoryId = Flight::request()->query['category'] ?? null;
    $onSale = isset(Flight::request()->query['onsale']);
    $query = Flight::request()->query['q'] ?? null;

    if ($query) {
        $data = Flight::productService()->searchProducts($query);
    } elseif ($categoryId) {
        $data = Flight::productService()->getProductsByCategory($categoryId);
    } elseif ($onSale) {
        $data = Flight::productService()->getProductsOnSale();
    } else {
        $data = Flight::productService()->getAllProducts();
    }
    json_response($data);
});

Flight::route('GET /products/@id', function ($id) {
    $product = Flight::productService()->getById($id);
    if (!$product) {
        json_response(null, false, 404, 'Product not found');
        return;
    }
    json_response($product);
});

Flight::route('POST /products', function () {
    require_roles([1]);
    $data = Flight::request()->data->getData();
    $result = Flight::productService()->addProduct($data);
    json_response($result, true, 201, 'Product created');
});

Flight::route('PUT /products/@id', function ($id) {
    require_roles([1]);
    $data = Flight::request()->data->getData();
    $result = Flight::productService()->update($id, $data);
    json_response($result, true, 200, 'Product updated');
});

Flight::route('DELETE /products/@id', function ($id) {
    require_roles([1]);
    $result = Flight::productService()->delete($id);
    json_response($result, true, 200, 'Product deleted');
});
