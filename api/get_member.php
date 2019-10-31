<?php
include('headers.php');
include('connect.php');
$stmt = $db->prepare("SELECT m.id, m.login, m.contacts 
					  FROM member m
					  WHERE m.id = ?");
$stmt->execute(array($_GET['id']));
if( $row = $stmt->fetch() ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'User successfully founded')
			, 'data' => array('user' => array('isSeller' => false, 'id' => $row['id'], 'login' => $row['login'], 'email' => $row['contacts'], 'phone' => '', 'card' => array(), 'picture' => 'https://gravatar.com/avatar/a52798efc2f6daae3ff94f007f574f2c?s200&d=retro')))
	);
} else {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => false, 'message' => 'No users with such name')
			, 'data' => null)
	);
}
?>
