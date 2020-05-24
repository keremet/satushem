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

$stmt = $db->prepare(
  "UPDATE member
   SET address = ?
   WHERE id in (
     SELECT member_id
     FROM token
     WHERE id = ?
   )"
);
$h = getallheaders();
if( $stmt->execute(array($_GET['newaddress'], $h['Authorization'])) ) {

  echo json_encode(
    array('meta' => array('code' => 200, 'success' => true))
  );
} else {
  $errInfo = $stmt->errorInfo();
  http_response_code(500);
  echo json_encode(
    array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при считывании закупок'. implode($errInfo, ','))
    , 'data' => null)
  );
}
?>
