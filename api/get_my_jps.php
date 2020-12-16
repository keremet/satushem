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
  "SELECT p.name, p.state_id, DATE_FORMAT(deadline, '%d.%m.%Y') deadline, p.id
   FROM token t
     JOIN purchase p ON p.creator_id = t.member_id
   WHERE t.id = ?
   ORDER BY p.state_id, p.deadline, p.name, p.id DESC"
);
$h = array_change_key_case(getallheaders());
if( $stmt->execute(array($h['authorization'])) ) {
  $purchases = array();
  while( $row = $stmt->fetch() ) {
    $purchases[] = array('_id' => $row['id']
      , 'name' => $row['name']
      , 'date' => $row['deadline']
      , 'state' => (int)$row['state_id']
    );
  };

  echo json_encode(
    array('meta' => array('code' => 200, 'success' => true)
    , 'data' => array('purchases' => $purchases))
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
