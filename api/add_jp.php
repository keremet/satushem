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
$input = json_decode(file_get_contents('php://input'), true); 

$stmt = $db->prepare("INSERT INTO purchase(name, category_id, state_id, payment_method_id, payment_info
						, unit_id, price, amount, min_volume, description
						, issue_place, is_public, is_multi_good, img, deadline, creator_id)
					  SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y%m%d'), t.member_id
					  FROM token t
					  WHERE t.id = ?");
$h = getallheaders();
if( $stmt->execute(array($input['name'], $input['category_id'], $input['state'], $input['payment_type'], $input['payment_info']
					, $input['measurement_unit_id'], $input['price_per_unit'], $input['volume'], $input['min_volume'], $input['description']
					, $input['address'], $input['is_public'], $input['is_multi_good'], $input['picture'], $input['date'], $h['Authorization'])) ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'PURCHASE ADDED')
			, 'data' => array('purchase' => array('_id' => $db->lastInsertId())))
	);
} else {
	$errInfo = $stmt->errorInfo();
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при создании закупки'. implode($errInfo, ','))
			, 'data' => null)
	);
}
?>
