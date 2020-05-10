<?php
/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2020 - Andrey Sokolov
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
include('select_jp.php');

$fld = "";
switch ($_GET['prop']) {
	case 'min_volume': $fld = "min_volume"; break;
	case 'name': $fld = "name"; break;
	case 'price_per_unit': $fld = "price"; break;
	case 'volume': $fld = "amount"; break;
	case 'category': $fld = "category_id"; break;
	case 'description': $fld = "description"; break;
	case 'address': $fld = "issue_place"; break;
	case 'payment_type': $fld = "payment_method_id"; break;
	case 'date': $fld = "deadline"; break;
	case 'state': $fld = "state_id"; break;
	case 'is_public': $fld = "is_public"; break;
	default: die("Неизвестное свойство закупки");
}

$stmt = $db->prepare(($fld == "deadline")
                     ?
                     "UPDATE purchase 
                      SET deadline = STR_TO_DATE(?, '%Y%m%d')
                      WHERE id = ?"
                     :
                     "UPDATE purchase 
                      SET $fld = ?
                      WHERE id = ?");

if( $stmt->execute(array($_GET['value'], $_GET['id'])) ) {
	$jp = select_jp($db, $_GET['id']);
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'PURCHASE UPDATED')
			, 'data' => array('purchase' => $jp))
	);
} else {
	$errInfo = $stmt->errorInfo();
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при обновлении закупки'. implode($errInfo, ','))
			, 'data' => null)
	);
}
?>
