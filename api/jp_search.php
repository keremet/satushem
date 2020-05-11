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

$skip = 4*((int)$filter['page_number'] - 1);

$flt = (isset($filter['category'])?" AND category_id=?":"")
	  .(isset($_GET['query'])?" AND upper(p.name) like upper(?)":"");

$stmt = $db->prepare(
	"SELECT p.id, p.name, TRIM(p.amount)+0 amount, p.unit_id, unit.name unit_name, p.price, DATE_FORMAT(deadline, '%d.%m.%Y') deadline, p.img, p.description, p.state_id
	 FROM purchase p
		JOIN unit on unit.id = p.unit_id
	 WHERE is_public = 1
	 $flt
	 ORDER BY p.deadline, p.name, p.id DESC LIMIT $skip, 4"
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
				, 'name' => $row['name']
				, 'picture' => ($row['img'] != "") ? "http://satushem.orv.org.ru" . $row['img'] : ""
				, 'description' => $row['description']
				, 'price_per_unit' => (int)($row['price'])
				, 'measurement_unit' => array('_id' => $row['unit_id'], 'name' => $row['unit_name'])
				, 'date' => $row['deadline']
				, 'state' => (int)$row['state_id']
				, 'volume' => $row['amount']
				, 'remaining_volume' => $row['amount']
	);
};

$stmt = $db->prepare(
	"SELECT count(1)
	 FROM purchase p
	 WHERE is_public = 1 $flt"
);
$stmt->execute($exec_param);

echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'FOUND')
		, 'data' => array('purchases' => $purchases, 'total' => $stmt->fetchColumn()))
);
?>
