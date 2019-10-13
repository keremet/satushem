<?php
include('headers.php');
include('connect.php');
$stmt = $db->prepare("SELECT id, name FROM category WHERE id_hi is null");
$stmt->execute();
$categ_arr = array();
while( $row = $stmt->fetch() ) {
	$categ_arr[] = array('id' => $row['id'], 'name' => $row['name'], 'children' => array());
};
echo json_encode(
	array('meta' => array('status' => 200, 'success' => true)
		, 'data' => array('categories' => $categ_arr))
);
?>
