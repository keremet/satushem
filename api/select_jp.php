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
function select_jp($db, $id) {
	$stmt = $db->prepare(
		"SELECT p.id, p.name, p.category_id, c.name category_name, p.price, TRIM(p.amount)+0 amount, TRIM(p.min_volume)+0 min_volume, DATE_FORMAT(deadline, '%d.%m.%Y') deadline
			, p.creator_id, cr.login creator_login
			, p.unit_id, unit.name unit_name
			, p.description, p.issue_place, p.payment_method_id, p.state_id, p.is_public, p.payment_info, p.img
		 FROM purchase p
			JOIN category c ON c.id = p.category_id
			JOIN member cr ON cr.id = p.creator_id
			JOIN unit on unit.id = p.unit_id
		 WHERE p.id = ?"
		);
	$stmt->execute(array($id));
	if( $row = $stmt->fetch() ) {
		$stmtP = $db->prepare(
			"SELECT TRIM(amount)+0 amount, member_id, comment, event_id
				,  (SELECT DATE_FORMAT(max(d), '%d.%m.%Y')
					FROM purchase_event e2 
					WHERE e2.purchase_id = e1.purchase_id AND e2.member_id = e1.member_id AND e2.event_id = 3) paid
			 FROM purchase_event e1
			 WHERE purchase_id = ? AND event_id in (1, 2)
			 ORDER BY d"
		);
		$stmtP->execute(array($id));
		$participants = array();
		while( $rowP = $stmtP->fetch() ) {
			$participants[] = array('paid' => $rowP['paid'], 'delivered' => false, 'sent' => null, 'volume' => $rowP['amount'], '_id' => $rowP['member_id'], 'user' => $rowP['member_id']);
		}

		$stats = array('paid' => 0, 'not_paid' => 0, 'paid_and_sent' => 0, 'paid_and_not_sent' => 0, 'not_paid_and_sent' => 0, 'not_paid_and_not_sent' => 0, 'sent' => 0, 'not_sent' => 0);
		$stmtStat = $db->prepare(
			"SELECT TRIM(ordered)+0 ordered, (SELECT TRIM(p.amount - a.ordered)+0 FROM purchase p WHERE p.id = ?) remaining
			 FROM (
			   SELECT IFNULL(sum(amount), 0) ordered
			   FROM purchase_event
			   WHERE purchase_id = ? AND event_id in (1, 2)
			 ) a"
		);
		$stmtStat->execute(array($id, $id));
		if( $rowStat = $stmtStat->fetch() ){
			$stats['ordered'] = $rowStat['ordered'];
			$stats['remaining'] = $rowStat['remaining'];
		}

		return array(
			'_id' => $row['id']
			, 'black_list' => array()
			, 'is_public' => (1 == $row['is_public'])
			, 'name' => $row['name']
			, 'picture' => ($row['img'] != "") ? "http://satushem.orv.org.ru" . $row['img'] : ""
			, 'description' => $row['description']
			, 'category' => array('_id' => $row['category_id'], 'name' => $row['category_name'])
			, 'creator' => array('id' => $row['creator_id'], 'login' => $row['creator_login'])
			, 'address' => $row['issue_place']
			, 'volume_dec' => array('$numberDecimal' => '1')
			, 'min_volume_dec' => array('$numberDecimal' => '1')
			, 'price_per_unit' => $row['price']
			, 'measurement_unit' => array('_id' => $row['unit_id'], 'name' => $row['unit_name'])
			, 'date' => $row['deadline']
			, 'state' => (int)$row['state_id']
			, 'payment_type' => (int)$row['payment_method_id']
			, 'payment_info' => $row['payment_info']
			, 'history' => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
			, 'participants' => $participants
			, '__v' => 0
			, 'recent'  => array(array('_id' => 1, 'parameter' => 'state', 'value' => 0, 'date' => '2019-09-24T20:09:49.723Z'))
			, 'volume' => $row['amount']
			, 'min_volume' => $row['min_volume']
			, 'remaining_volume' => $row['amount']
			, 'stats' => $stats
		);
	};

	return null;
}
?>
