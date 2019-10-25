<?php
/*
 * add_jp.php
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
$stmt = $db->prepare("SELECT id, name FROM category WHERE id_hi is null");
$stmt->execute();
$categ_arr = array();
while( $row = $stmt->fetch() ) {
	$categ_arr[] = array('_id' => $row['id'], 'name' => $row['name']);
};
echo json_encode(
	array('meta' => array('code' => 200, 'success' => true, 'message' => 'Successfully get categories')
		, 'data' => array('categories' => $categ_arr))
);
?>
