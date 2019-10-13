<?php
include('headers.php');
include('connect.php');

parse_str($_GET['filter'], $filter);

$stmt = $db->prepare(
	"SELECT id, name
	 FROM purchase
	 WHERE 1=1 " . (isset($filter['category'])?"AND category_id=?":"")
);
$exec_param = array();
if( isset($filter['category']) )
	$exec_param[] = $filter['category'];
$stmt->execute($exec_param);
$purchases = array();
while( $row = $stmt->fetch() ) {
	$purchases[] = array('_id' => $row['id']
				, 'black_list' => array()
				, 'is_public' => true
				, 'name' => $row['name']
				, 'picture' => ''
				, 'description' => ''
				, 'category' => ''
				, 'creator' => ''
				, 'address' => ''
				, 'volume_dec' => array('$numberDecimal' => '1')
				, 'min_volume_dec' => array('$numberDecimal' => '1')
				, 'price_per_unit' => 1
				, 'measurement_unit' => array('_id' => '1', 'name' => 'л', '__v' => 0)
				, 'date' => '2019-09-23T21:00:00.000Z'
				, 'state' => 0
				, 'payment_type' => 2
				, 'payment_info' => ''
				, 'history' => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
				, 'participants' => array()
				, '__v' => 0
				, 'recent'  => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
				, 'volume' => 1
				, 'min_volume' => 1
				, 'remaining_volume' => 1
	);
};
echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'FOUND')
		, 'data' => array('purchases' => $purchases, 'total' => 10))
);
?>
