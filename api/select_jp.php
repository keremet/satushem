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
			"SELECT TRIM(r.amount)+0 amount, r.member_id, r.id
			 ,  (SELECT IFNULL(SUM(p.value), 0) FROM payment p WHERE p.request_id = r.id) paid
       ,  (SELECT TRIM(GREATEST(r.amount*ps.price - IFNULL(SUM(p.value), 0), 0))+0 FROM payment p WHERE p.request_id = r.id) not_paid
			 ,  (SELECT TRIM(IFNULL(SUM(i.amount), 0))+0 FROM issue i WHERE i.request_id = r.id) sent
       ,  (SELECT TRIM(GREATEST(r.amount - IFNULL(SUM(i.amount), 0), 0))+0 FROM issue i WHERE i.request_id = r.id) not_sent
			 FROM request r
         JOIN purchase ps ON ps.id = r.purchase_id
			 WHERE purchase_id = ?
			 ORDER BY d;"
		);
		$stmtP->execute(array($id));
		$requests = array();
		while( $rowP = $stmtP->fetch() ) {
			$requests[] = array('paid' => $rowP['paid']
                      , 'not_paid' => $rowP['not_paid']
                      /*, 'delivered' => false*/
                      , 'sent' => $rowP['sent']
                      , 'not_sent' => $rowP['not_sent']
                      , 'volume' => $rowP['amount']
                      , '_id' => $rowP['id']
                      , 'user' => $rowP['member_id']);
		}

		$stats = array('paid' => 0, 'not_paid' => 0, 'paid_and_sent' => 0, 'paid_and_not_sent' => 0, 'not_paid_and_sent' => 0, 'not_paid_and_not_sent' => 0, 'not_sent' => 0);
		$stmtStat = $db->prepare(
			"SELECT TRIM(ordered)+0 ordered, (SELECT TRIM(p.amount - a.ordered)+0 FROM purchase p WHERE p.id = ?) remaining
				, (SELECT TRIM(IFNULL(sum(i.amount), 0))+0
				   FROM request r
					  JOIN issue i ON r.id = i.request_id
				   WHERE r.purchase_id = ?) sent
			 FROM (
			   SELECT IFNULL(sum(amount), 0) ordered
			   FROM request
			   WHERE purchase_id = ?
			 ) a"
		);
		$stmtStat->execute(array($id, $id, $id));
		if( $rowStat = $stmtStat->fetch() ){
			$stats['ordered'] = $rowStat['ordered'];
			$stats['remaining'] = $rowStat['remaining'];
			$stats['sent'] = $rowStat['sent'];
		}

    $stmtH = $db->prepare(
       "SELECT DATE_FORMAT(a.d, '%d.%m.%Y') d, TRIM(a.amount)+0 amount, m.login, a.parameter, DATE_FORMAT(a.req_date, '%d.%m.%Y') req_date
        FROM (
          SELECT d, amount, member_id, 'requests.joint' parameter, null req_date
          FROM request
          WHERE purchase_id = ?
          UNION ALL
          SELECT p.d, p.value, r.member_id, 'requests.payment' parameter, r.d
          FROM request r
            JOIN payment p ON p.request_id = r.id
          WHERE r.purchase_id = ?
          UNION ALL
          SELECT i.d, i.amount, r.member_id, 'requests.issue' parameter, r.d
          FROM request r
            JOIN issue i ON i.request_id = r.id
          WHERE r.purchase_id = ?
        ) a
          JOIN member m ON m.id = a.member_id
        ORDER BY a.d desc"
    );
		$stmtH->execute(array($id, $id, $id));
    $history = array();
    while( $rowH = $stmtH->fetch() ) {
       $history[] = array('parameter' => $rowH['parameter']
                         , 'login' => $rowH['login']
                         , 'date' => $rowH['d']
                         , 'req_date' => $rowH['req_date']
                         , 'amount' => ("requests.payment" == $rowH['parameter'])?$rowH['amount']:($rowH['amount']." ".$row['unit_name']));
    }
		return array(
			'_id' => $row['id']
			, 'black_list' => array()
			, 'is_public' => (1 == $row['is_public'])
			, 'name' => $row['name']
			, 'picture' => ($row['img'] != "") ? ROOT_URL . $row['img'] : ""
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
			, 'history' => $history
			, 'requests' => $requests
			, '__v' => 0
			, 'volume' => $row['amount']
			, 'min_volume' => $row['min_volume']
			, 'remaining_volume' => $row['amount']
			, 'stats' => $stats
		);
	};

	return null;
}
?>
