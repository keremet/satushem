<?php
function select_jp($db, $id) {
	$stmt = $db->prepare(
		"SELECT p.id, p.name, p.category_id, c.name category_name
		 FROM purchase p
			JOIN category c ON c.id = p.category_id
		 WHERE p.id = ?"
		);
	$stmt->execute(array($id));
	if( $row = $stmt->fetch() ) {
		$stmtP = $db->prepare(
			"SELECT amount, member_id, comment, event_id
			 FROM purchase_event
			 WHERE purchase_id = ? AND event_id in (1, 2)
			 ORDER BY d"
		);
		$stmtP->execute(array($id));
		$participants = array();
		while( $rowP = $stmtP->fetch() ) {
			$participants[] = ( 1 == $rowP['event_id'] )?
				array('paid' => null, 'delivered' => false, 'sent' => null, 'volume' => $rowP['amount'], 'user' => $rowP['member_id']):
				array('paid' => null, 'delivered' => false, 'sent' => null, 'volume' => $rowP['amount'], 'fake_user' => array('login' => $rowP['comment']));
		}

		return array(
			'_id' => $row['id']
			, 'black_list' => array()
			, 'is_public' => true
			, 'name' => $row['name']
			, 'picture' => ''
			, 'description' => ''
			, 'category' => array('_id' => $row['category_id'], 'name' => $row['category_name'])
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
			, 'participants' => $participants
			, '__v' => 0
			, 'recent'  => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
			, 'volume' => 1
			, 'min_volume' => 1
			, 'remaining_volume' => 1
			, 'stats' => array('ordered' => 0, 'remaining' => 1, 'paid' => 0, 'not_paid' => 0, 'paid_and_sent' => 0, 'paid_and_not_sent' => 0, 'not_paid_and_sent' => 0, 'not_paid_and_not_sent' => 0, 'sent' => 0, 'not_sent' => 0)
		);
	};

	return null;
}
?>
