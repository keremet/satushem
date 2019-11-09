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

if( 3 == $input['event_id'] ) {
	//TODO Права доступа!
	
	$stmt = $db->prepare("DELETE FROM purchase_event WHERE member_id = ? AND purchase_id = ? AND event_id = 3");
	$stmt->execute(array($input['user_id'], $input['purchase_id']));	
	
	if( is_null($input['date']) ) {		
		$jp = select_jp($db, $input['purchase_id']);
		echo json_encode(
			array('meta' => array('code' => 200, 'success' => true, 'message' => 'UPDATED')
				, 'data' => array('purchase' => $jp) )
		);
		exit;
	} 
	
	$stmt = $db->prepare("INSERT INTO purchase_event(member_id, purchase_id, event_id, d) VALUES (?, ?, 3, STR_TO_DATE(?, '%Y%m%d'))");
	$h = getallheaders();
	if( $stmt->execute(array($input['user_id'], $input['purchase_id'], $input['date'])) ) {
		$jp = select_jp($db, $input['purchase_id']);
		echo json_encode(
			array('meta' => array('code' => 200, 'success' => true, 'message' => 'UPDATED')
				, 'data' => array('purchase' => $jp) )
		);
	} else {
		$errInfo = $stmt->errorInfo();
		http_response_code(500);
		echo json_encode(
			array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при добавлении события'. implode($errInfo, ','))
				, 'data' => null)
		);
	}
	exit;
}

if( 2 == $input['event_id'] ) {
	//TODO Права доступа!
	
	$stmt = $db->prepare("INSERT INTO purchase_event(member_id, purchase_id, event_id, amount) VALUES (?, ?, 2, ?)");
	$h = getallheaders();
	if( $stmt->execute(array($input['member_id'], $input['purchase_id'], $input['volume'])) ) {
		$jp = select_jp($db, $input['purchase_id']);
		echo json_encode(
			array('meta' => array('code' => 200, 'success' => true, 'message' => 'UPDATED')
				, 'data' => array('purchase' => $jp) )
		);
	} else {
		$errInfo = $stmt->errorInfo();
		http_response_code(500);
		echo json_encode(
			array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при добавлении события'. implode($errInfo, ','))
				, 'data' => null)
		);
	}
	exit;
}

$stmt = $db->prepare("INSERT INTO purchase_event(member_id, purchase_id, event_id, amount, comment)
					  SELECT t.member_id, ?, ?, ?, ?
					  FROM token t
					  WHERE t.id = ?");
$h = getallheaders();
if( $stmt->execute(array($input['purchase_id'], $input['event_id'], $input['volume'], isset($input['comment'])?($input['comment']):null, $h['Authorization'])) ) {
	$jp = select_jp($db, $input['purchase_id']);
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'JOINT')
			, 'data' => array('purchase' => $jp) )
	);
} else {
	$errInfo = $stmt->errorInfo();
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'Ошибка при добавлении события'. implode($errInfo, ','))
			, 'data' => null)
	);
}
?>
