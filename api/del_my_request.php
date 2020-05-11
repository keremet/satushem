<?php
/*
 * This file is part of Satushem.
 *
 * Copyright (C) 2019 - Andrey Sokolov
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
$h = getallheaders();
$stmtD = $db->prepare("DELETE FROM request WHERE purchase_id = ? and member_id = (select t.member_id from token t WHERE t.id = ?)");
if( ! $stmtD->execute(array($input['purchase_id'], $h['Authorization']))) {
	$errInfo = $stmt->errorInfo();
	http_response_code(500);
	die( json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при удалении события'. implode($errInfo, ','))
			, 'data' => null)
	));
}

$jp = select_jp($db, $input['purchase_id']);
echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'DETACHED')
		, 'data' => array('purchase' => $jp) )
);
?>
