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
$stmt = $db->prepare("SELECT id FROM member WHERE login = ? and password = ?");
$input = json_decode(file_get_contents('php://input'), true); 
$stmt->execute(array($input['login'], $input['password']));
if( $row = $stmt->fetch() ) {
    $arr = array('a','b','c','d','e','f',
				'g','h','i','j','k','l',
				'm','n','o','p','r','s',
				't','u','v','x','y','z',
				'A','B','C','D','E','F',
				'G','H','I','J','K','L',
				'M','N','O','P','R','S',
				'T','U','V','X','Y','Z',
				'1','2','3','4','5','6',
				'7','8','9','0','.',',',
				'(',')','[',']','!','?',
				'&','^','%','@','*','$',
				'<','>','/','|','+','-',
				'{','}','`','~');
	$token = "";
	for($i = 0; $i < 64; $i++)
	{
		$index = rand(0, count($arr) - 1);
		$token .= $arr[$index];
	}

	$stmtD = $db->prepare("DELETE FROM token WHERE member_id = ?");
	$stmtD->execute(array($row['id']));

	$stmtI = $db->prepare("INSERT INTO token(id, member_id) VALUES (?, ?)"); //TODO: предусмотреть, что токен может повториться!!
	$stmtI->execute(array($token, $row['id']));
	
	echo json_encode(
		array('meta' => array('code' => 200, 'success' => true, 'message' => 'LOGGED IN')
			, 'data' => array('token' => $token))
	);
} else {
	http_response_code(500);
	echo json_encode(
		array('meta' => array('code' => 500, 'success' => false, 'message' => 'NO SUCH USER')
			, 'data' => null)
	);
}
?>
