<?php
include('headers.php');
include('connect.php');
include('select_jp.php');
$input = json_decode(file_get_contents('php://input'), true); 

$stmt = $db->prepare("INSERT INTO purchase_event(member_id, purchase_id, event_id, amount, comment)
					  SELECT t.member_id, ?, ?, ?, ?
					  FROM token t
					  WHERE t.id = ?");
$h = getallheaders();
if( $stmt->execute(array($input['purchase_id'], $input['event_id'], $input['volume'], isset($input['comment'])?($input['comment']):null, $h['Authorization'])) ) {
	$jp = select_jp($db, $input['purchase_id']);
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'JOINT')
			, 'data' => array('purchase' => $jp) )
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
