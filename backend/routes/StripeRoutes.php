<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /stripe/config', function () {
    $publishableKey = getenv('STRIPE_PUBLISHABLE_KEY') ?: '';
    if ($publishableKey === '') {
        error_log('Stripe publishable key not configured.');
        json_response(null, false, 500, 'Stripe publishable key not configured');
        return;
    }
    json_response(['publishableKey' => $publishableKey], true, 200, 'OK');
});

Flight::route('POST /stripe/payment-intent', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();

    try {
        $secretKey = getenv('STRIPE_SECRET_KEY') ?: '';
        if ($secretKey === '') {
            throw new Exception('Stripe secret key not configured');
        }

        \Stripe\Stripe::setApiKey($secretKey);

        $calc = Flight::orderService()->calculateCartTotal($userId);
        $totalAmount = $calc['totalAmount'];
        $itemCount = $calc['itemCount'];

        $amount = (int)round($totalAmount * 100);
        if ($amount <= 0) {
            throw new Exception('Invalid cart total for payment');
        }

        $intent = \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
            'metadata' => [
                'user_id' => (string)$userId,
                'item_count' => (string)$itemCount
            ]
        ]);

        json_response([
            'clientSecret' => $intent->client_secret,
            'amount' => $amount,
            'currency' => 'usd'
        ], true, 201, 'PaymentIntent created');
    } catch (\Stripe\Exception\ApiErrorException $e) {
        error_log('Stripe API error: ' . $e->getMessage() . ' | userId=' . $userId);
        json_response(null, false, 500, 'Stripe error: ' . $e->getMessage());
    } catch (Exception $e) {
        error_log('Stripe payment-intent error: ' . $e->getMessage() . ' | userId=' . $userId);
        json_response(null, false, 500, $e->getMessage());
    }
});
