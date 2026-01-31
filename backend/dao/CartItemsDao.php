<?php

require_once 'BaseDao.php';

class CartItemsDao extends BaseDao
{

    public function __construct()
    {
        parent::__construct('cart_items');
    }

    public function getCartItems($cart_ID)
    {
        $sql = "SELECT * FROM cart_items ci 
                JOIN cart c ON ci.CartID = c.CartID 
                WHERE ci.CartID = :cart_ID";

        $statement = $this->connection->prepare($sql);

        $statement->bindValue("cart_ID", $cart_ID);

        $statement->execute();

        return $statement->fetchAll();
    }

    public function addCartItem($cart_ID, $product_ID, $quantity)
    {
        if (!$cart_ID || !$product_ID || !$quantity) {
            return ['Success' => false, 'Message' => "Missing either cart_ID, product_ID, quantity."];
        }

        // If item exists, increment quantity instead of duplicating rows
        $existing = $this->connection->prepare("SELECT CartItemID, quantity FROM cart_items WHERE CartID = :cart_ID AND ProductID = :product_ID");
        $existing->bindValue(":cart_ID", $cart_ID);
        $existing->bindValue(":product_ID", $product_ID);
        $existing->execute();
        $row = $existing->fetch();

        if ($row) {
            $update = $this->connection->prepare("UPDATE cart_items SET quantity = quantity + :quantity WHERE CartItemID = :cart_item_id");
            $update->bindValue(":quantity", $quantity);
            $update->bindValue(":cart_item_id", $row['CartItemID']);
            $update->execute();
            return ['Success' => true, 'Message' => 'Updated cart quantity.', 'Cart_ID' => $cart_ID, 'Product_ID' => $product_ID, 'Quantity' => $row['quantity'] + $quantity];
        }

        $sql = "INSERT INTO cart_items (CartID, ProductID, quantity) VALUES (:cart_ID, :product_ID, :quantity)";
        $statement = $this->connection->prepare($sql);
        $statement->bindValue(":cart_ID", $cart_ID);
        $statement->bindValue(":product_ID", $product_ID);
        $statement->bindValue(":quantity", $quantity);
        $statement->execute();

        return ['Success' => true, 'Message' => 'Added items to cart successfully!', 'Cart_ID' => $cart_ID, 'Product_ID' => $product_ID, 'Quantity' => $quantity];
    }

    public function deleteCartItem($cart_item_ID, $user_ID)
    {
        $sql = "SELECT * FROM cart_items ci JOIN cart c ON ci.CartID = c.CartID WHERE CartItemID = :cart_item_ID AND c.UserID = :user_ID";



        $statement = $this->connection->prepare($sql);

        $statement->bindValue(":cart_item_ID", $cart_item_ID);
        $statement->bindValue(":user_ID", $user_ID);

        $statement->execute();

        $res = $statement->fetch();

        if (!$res) {
            return ["Success:" => "False", "Message" => "User not affiliated with that cart"];
        }

        if ($user_ID != Flight::authMiddleware()->getUserId()) {
            return ["Success:" => "False", "Message" => "User ID does NOT match JWT."];
        };

        $sql = 'DELETE FROM cart_items ci WHERE CartItemID = :cart_item_ID';

        $statement = $this->connection->prepare($sql);
        $statement->bindValue('cart_item_ID', $cart_item_ID);

        $statement->execute();

        return ["Success: " => "True", "Message" => "Successfully deleted item from cart!"];
    }
}
