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
}
