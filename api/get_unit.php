<?php
include('headers.php');
include('connect.php');
$stmt = $db->prepare("SELECT id, name FROM unit");
$stmt->execute();
$units = array();
while( $row = $stmt->fetch() ) {
	$units[] = array('_id' => $row['id'], 'name' => $row['name']);
};
echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'Successfully get measurement units')
		, 'data' => array('units' => $units))
);
?>
