<?php
/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2019
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
include('headers.php');
include('connect.php');
$stmt = $db->prepare(
	"SELECT p.id, p.name, p.category_id, c.name category_name
	 FROM purchase p
		JOIN category c ON c.id = p.category_id
	 WHERE p.id = ?"
	);
$stmt->execute(array($_GET['id']));
if( $row = $stmt->fetch() ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'PURCHASE FOUND')
			, 'data' => array('purchase' => 
			array('_id' => $row['id']
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
				, 'participants' => array()
				, '__v' => 0
				, 'recent'  => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
				, 'volume' => 1
				, 'min_volume' => 1
				, 'remaining_volume' => 1
				, 'stats' => array('ordered' => 0, 'remaining' => 1, 'paid' => 0, 'not_paid' => 0, 'paid_and_sent' => 0, 'paid_and_not_sent' => 0, 'not_paid_and_sent' => 0, 'not_paid_and_not_sent' => 0, 'sent' => 0, 'not_sent' => 0)
	)))
	);
};
?>
