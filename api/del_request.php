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
$input = json_decode(file_get_contents('php://input'), true); 

$stmt = $db->prepare("SELECT purchase_id FROM request WHERE id = ?");
$stmt->execute(array($input['id']));
$purchase_id = $stmt->fetchColumn();
if( !$purchase_id )
{
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'NOT JOINT')
			, 'data' => null)
	);
	die();
}

$stmt = $db->prepare("DELETE FROM request WHERE id = ?");
if( $stmt->execute(array($input['id'])) ) {
	$jp = select_jp($db, $purchase_id);
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true)
			, 'data' => array('purchase' => $jp) )
	);
} else {
	$errInfo = $stmt->errorInfo();
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при удалении заявки'. implode($errInfo, ','))
			, 'data' => null)
	);
}
?>
