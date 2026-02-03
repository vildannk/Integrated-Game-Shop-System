<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /categories', function () {
    $data = Flight::categoryService()->getAll();
    json_response($data);
});

Flight::route('GET /categories/@id', function ($id) {
    $category = Flight::categoryService()->getById($id);
    if (!$category) {
        json_response(null, false, 404, 'Category not found');
        return;
    }
    json_response($category);
});

Flight::route('POST /categories', function () {
    require_roles([1]);
    $data = Flight::request()->data->getData();
    $result = Flight::categoryService()->createCategory($data);
    json_response($result, true, 201, 'Category created');
});

Flight::route('PUT /categories/@id', function ($id) {
    require_roles([1]);
    $data = Flight::request()->data->getData();
    $result = Flight::categoryService()->update($id, $data);
    json_response($result, true, 200, 'Category updated');
});

Flight::route('DELETE /categories/@id', function ($id) {
    require_roles([1]);
    $result = Flight::categoryService()->delete($id);
    json_response($result, true, 200, 'Category deleted');
});
