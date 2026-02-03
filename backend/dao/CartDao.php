<?php

require_once 'BaseDao.php';

class CartDao extends BaseDao
{

    public function __construct()
    {
        parent::__construct('cart');
    }

    public function getCartByUserID($UserID)
    {
        $sql = 'SELECT CartID FROM cart WHERE UserID = :UserID';

        $statement = $this->connection->prepare($sql);

        $statement->bindValue(':UserID', $UserID);

        $statement->execute();

        return $statement->fetch();
    }

    public function createCartIfMissing($UserID)
    {
        $existing = $this->getCartByUserID($UserID);
        if ($existing && isset($existing['CartID'])) {
            return $existing['CartID'];
        }

        $sql = 'INSERT INTO cart (UserID) VALUES (:UserID)';
        $statement = $this->connection->prepare($sql);
        $statement->bindValue(':UserID', $UserID);
        $statement->execute();
        return $this->connection->lastInsertId();
    }

    public function deleteCartByUserID($UserID)
    {
        $sql = 'DELETE FROM cart WHERE UserID = :UserID';
        $statement = $this->connection->prepare($sql);

        $statement->bindValue(':UserID', $UserID);

        $statement->execute();

        if (!$statement) {
            return ['Success: ' => "False", "Message:" => "Error deleting cart!"];
        }

        return ['Success: ' => "True", "Message:" => "Deleted cart succ3essfully."];
    }

    public function getPriceTotal($UserID)
    {
        $totalPrice = "SELECT price_total FROM cart WHERE UserID = :UserID";
        $statement = $this->connection->prepare($totalPrice);
        $statement->bindValue("UserID", $UserID);
        $statement->execute();

        $total = $statement->fetch();

        $r = $total["price_total"];
        return $r;
    }

    public function getByUserId($userId)
    {
        $sql = "SELECT ci.CartItemID, ci.ProductID, ci.quantity
                FROM cart_items ci
                JOIN cart c ON ci.CartID = c.CartID
                WHERE c.UserID = :userId";
        $statement = $this->connection->prepare($sql);
        $statement->bindValue(':userId', $userId);
        $statement->execute();
        return $statement->fetchAll();
    }

    public function clearCart($userId)
    {
        $sql = "DELETE ci FROM cart_items ci
                JOIN cart c ON ci.CartID = c.CartID
                WHERE c.UserID = :userId";
        $statement = $this->connection->prepare($sql);
        $statement->bindValue(':userId', $userId);
        $statement->execute();

        $reset = $this->connection->prepare("UPDATE cart SET price_total = 0 WHERE UserID = :userId");
        $reset->bindValue(':userId', $userId);
        $reset->execute();
    }
}
