<?php
//输出数据的数组
$output = array();
//获取传递参数
$a = @$_GET['a'] ? $_GET['a'] : '';
$uid = @$_GET['uid'] ? $_GET['uid'] : 0;
//判断是否为空
if (empty($a)) {
	$output = array('data' => NULL, 'info' => '坑爹啊!', 'code' => -201);
	//退出并输出数组
	exit(json_encode($output));
}

//走接口
if ($a == 'get_users') {
	//检查用户
	if ($uid == 0) {
		$output = array('data' => NULL, 'info' => 'The uid is null!', 'code' => -401);
		exit(json_encode($output));
	}

//	//连接数据库获取数据
//	$conn = mysql_connect("localhost", "root", "root");
//	mysql_select_db("mydb", $conn);
//	//设置字符集
//	mysql_query("SET NAMES UTF8");
//
//	$result = mysql_query("SELECT * FROM test");
//
//	//print_r(mysql_fetch_array($result));
//
//	while ($row = mysql_fetch_array($result)) {
//		print_r($row);
//		echo "<br />";
//	}
//	mysql_close($conn);

	//假设 $mysql 是数据库
	$mysql = array(10001 => array('uid' => 10001, 'vip' => 5, 'nickname' => 'Shine X', 'email' => '979137@qq.com', 'qq' => 979137, 'gold' => 1500, 'powerplay' => array('2xp' => 12, 'gem' => 12, 'bingo' => 5, 'keys' => 5, 'chest' => 8), 'gems' => array('red' => 13, 'green' => 3, 'blue' => 8, 'yellow' => 17), 'ctime' => 1376523234, 'lastLogin' => 1377123144, 'level' => 19, 'exp' => 16758, ), 10002 => array('uid' => 10002, 'vip' => 50, 'nickname' => 'elva', 'email' => 'elva@ezhi.net', 'qq' => NULL, 'gold' => 14320, 'powerplay' => array('2xp' => 1, 'gem' => 120, 'bingo' => 51, 'keys' => 5, 'chest' => 8), 'gems' => array('red' => 13, 'green' => 3, 'blue' => 8, 'yellow' => 17), 'ctime' => 1376523234, 'lastLogin' => 1377123144, 'level' => 112, 'exp' => 167588, ), 10003 => array('uid' => 10003, 'vip' => 5, 'nickname' => 'Lily', 'email' => 'Lily@ezhi.net', 'qq' => NULL, 'gold' => 1541, 'powerplay' => array('2xp' => 2, 'gem' => 112, 'bingo' => 4, 'keys' => 7, 'chest' => 8), 'gems' => array('red' => 13, 'green' => 3, 'blue' => 9, 'yellow' => 7), 'ctime' => 1376523234, 'lastLogin' => 1377123144, 'level' => 10, 'exp' => 1758, ), );

	$uidArr = array(10001, 10002, 10003);
	if (in_array($uid, $uidArr, true)) {
		$output = array('data' => NULL, 'info' => 'The user does not exist!', 'code' => -402);
		exit(json_encode($output));
	}
	//查询数据库
	$userInfo = $mysql[$uid];

	//输出数据
	$output = array('data' => array('userInfo' => $userInfo, 'isLogin' => true, //是否首次登陆
	'unread' => 4, //未读消息数量
	'untask' => 3, //未完成任务
	), 'info' => 'Here is the message which, commonly used in popup window', //消息提示，客户端常会用此作为给弹窗信息。
	'code' => 200, //成功与失败的代码，一般都是正数或者负数
	);
	exit(json_encode($output));
} else if ($a == 'get_games_result') {
	//...
	die('您正在调 get_games_result 接口!');
} elseif ($a == 'upload_avatars') {
	//....
	die('您正在调 upload_avatars 接口!');
}
