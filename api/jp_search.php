<?php
/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2019 - Andrey Sokolov
 * Copyright (C) 2019 - Michail Kudryavtsev
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

parse_str($_GET['filter'], $filter);

$stmt = $db->prepare(
	"SELECT p.id, p.name, TRIM(p.amount)+0 amount, p.unit_id, unit.name unit_name, p.price, DATE_FORMAT(deadline, '%d.%m.%Y') deadline
	 FROM purchase p
		JOIN unit on unit.id = p.unit_id
	 WHERE is_public = 1" 
	     . (isset($filter['category'])?" AND category_id=?":"")
	     . (isset($_GET['query'])?" AND upper(p.name) like upper(?)":"")
);
$exec_param = array();
if( isset($filter['category']) )
	$exec_param[] = $filter['category'];
if( isset($_GET['query']) )
	$exec_param[] = '%'.$_GET['query'].'%';
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
				, 'price_per_unit' => (int)($row['price'])
				, 'measurement_unit' => array('_id' => $row['unit_id'], 'name' => $row['unit_name'])
				, 'date' => $row['deadline']
				, 'state' => 0
				, 'payment_type' => 2
				, 'payment_info' => ''
				, 'history' => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
				, 'participants' => array()
				, '__v' => 0
				, 'recent'  => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
				, 'volume' => $row['amount']
				, 'min_volume' => 1
				, 'remaining_volume' => $row['amount']
	);
};
echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'FOUND')
		, 'data' => array('purchases' => $purchases, 'total' => 10))
);
?>
