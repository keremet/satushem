<?php
include('headers.php');
include('connect.php');
include('select_jp.php');
$jp = select_jp($db, $_GET['id']);
if( $jp )
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'PURCHASE FOUND')
			, 'data' => array('purchase' => $jp))
	);
?>
