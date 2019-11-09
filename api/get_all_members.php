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
$stmt = $db->prepare("SELECT id, login, visible_name FROM member ORDER BY visible_name");
$stmt->execute();
$members = array();
while( $row = $stmt->fetch() ) {
	$members[] = array('_id' => $row['id'], 'login' => $row['login'], 'visible_name' => $row['visible_name']);
};
echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'Successfully get members')
		, 'data' => array('members' => $members))
);
?>
