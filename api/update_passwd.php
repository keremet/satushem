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

$input = json_decode(file_get_contents('php://input'), true);
$h = array_change_key_case(getallheaders());

$stmtS = $db->prepare(
  "SELECT 1
   FROM member
   WHERE id in (
     SELECT member_id
     FROM token
     WHERE id = ?
   ) AND password = ?"
);

if( $stmtS->execute(array($h['authorization'], $input['old_password'])) ) {
  if( !$stmtS->fetch() ) {
    echo json_encode(
      array('meta' => array('code' => 500, 'success' => false, 'message' => 'Старый пароль задан неверно')
      , 'data' => null)
    );
    exit;
  }
} else {
  $errInfo = $stmtS->errorInfo();
  http_response_code(500);
  echo json_encode(
    array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка обновлении пароля'. implode($errInfo, ','))
    , 'data' => null)
  );
  exit;
}

$stmtU = $db->prepare(
  "UPDATE member
   SET password = ?
   WHERE id in (
     SELECT member_id
     FROM token
     WHERE id = ?
   )"
);
if( $stmtU->execute(array($input['password'], $h['authorization'])) ) {
  echo json_encode(
    array('meta' => array('code' => 200, 'success' => true))
  );
} else {
  $errInfo = $stmtU->errorInfo();
  http_response_code(500);
  echo json_encode(
    array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка обновлении пароля'. implode($errInfo, ','))
    , 'data' => null)
  );
}
?>
