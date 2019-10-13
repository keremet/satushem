<?php
include('headers.php');
include('connect.php');
$input = json_decode(file_get_contents('php://input'), true); 

$stmt = $db->prepare("INSERT INTO unit(name, member_id)
					  SELECT ?, member_id
					  FROM token t
					  WHERE t.id = ?");
$h = getallheaders();
if( $stmt->execute(array($input['name'], $h['Authorization'])) ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'Measurement unit successfully added')
			, 'data' => array('unit' => array('_id' => $db->lastInsertId(), 'name' => $input['name'])))
	);
} else {
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Error during measurement unit adding')
			, 'data' => null)
	);
}
?>
