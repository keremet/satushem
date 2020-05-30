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

$stmt = $db->prepare("SELECT r.purchase_id, p.img purchase_picture, p.name purchase_name, TRIM(r.amount)+0 volume, u.name unit
   , TRIM(r.amount*p.price)+0 sum
   , (SELECT TRIM(IFNULL(SUM(pmt.value), 0))+0 FROM payment pmt WHERE pmt.request_id = r.id) paid
   , (SELECT TRIM(IFNULL(SUM(i.amount), 0))+0 FROM issue i WHERE i.request_id = r.id) sent
  FROM token t
    JOIN request r ON r.member_id=t.member_id
    JOIN purchase p ON p.id = r.purchase_id
    JOIN unit u on u.id = p.unit_id
  WHERE t.id = ?");
$h = getallheaders();
if( $stmt->execute(array($h['Authorization'])) ) {
  $order_arr = array();
  while( $row = $stmt->fetch() ) {
  	$order_arr[] = array('purchase_id' => $row['purchase_id']
                       , 'purchase_picture' => ($row['purchase_picture']!="")?ROOT_URL.$row['purchase_picture']:""
                       , 'purchase_name' => $row['purchase_name']
                       , 'volume' => $row['volume']
                       , 'unit' => $row['unit']
                       , 'sum' => $row['sum']
                       , 'paid' => $row['paid']
                       , 'sent' => $row['sent']
                       );
  };
  echo json_encode(
    array('meta' => array('code' => 200, 'success' => true, 'message' => 'Successfully get orders')
      , 'data' => array('orders' => $order_arr))
  );
} else {
  $errInfo = $stmt->errorInfo();
  http_response_code(500);
  echo json_encode(
    array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка чтения заявок'. implode($errInfo, ','))
    , 'data' => null)
  );
}
?>
