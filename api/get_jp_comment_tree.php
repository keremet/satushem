<?php
include('headers.php');
include('connect.php');
$stmt = $db->prepare("SELECT id, name FROM purchase WHERE id = ?");
$stmt->execute(array($_GET['purchase_id']));
if( $row = $stmt->fetch() ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'FETCHED')
			, 'data' => array('comments' => array()))
	);
};
?>
