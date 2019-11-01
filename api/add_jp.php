<?php
include('headers.php');
include('connect.php');
$input = json_decode(file_get_contents('php://input'), true); 

$stmt = $db->prepare("INSERT INTO purchase(name, category_id, state_id, payment_method_id, unit_id, price, amount, creator_id)
					  SELECT ?, ?, 1, ?, ?, ?, ?, t.member_id
					  FROM token t
					  WHERE t.id = ?");
$h = getallheaders();
if( $stmt->execute(array($input['name'], $input['category_id'], $input['payment_type'], $input['measurement_unit_id'], $input['price_per_unit'], $input['volume'], $h['Authorization'])) ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'PURCHASE ADDED')
			, 'data' => array('purchase' => array('_id' => $db->lastInsertId())))
	);
} else {
	$errInfo = $stmt->errorInfo();
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при создании закупки'. implode($errInfo, ','))
			, 'data' => null)
	);
}
?>
