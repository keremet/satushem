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
$stmt = $db->prepare("INSERT INTO member(login, password, visible_name, who_add_id)
					  SELECT ?, ?, ?, member_id
					  FROM token t
					  WHERE t.id = ?");
$h = array_change_key_case(getallheaders());
if( $stmt->execute(array($_GET['login'], $_GET['passwd'], $_GET['visible_name'], $h['authorization'])) ) {
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'Member successfully added')
			, 'data' => array('member' => array('_id' => $db->lastInsertId(), 'login' => $_GET['login'], 'visible_name' => $_GET['visible_name'])))
	);
} else {
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Error during member adding')
			, 'data' => null)
	);
}
?>
