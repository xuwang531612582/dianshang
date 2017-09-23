<meta charset="utf-8" />
<?php
//输出数据的数组
$output = array();
$mdpass='';
//获取传递参数

$status= @$_POST['status'] ? $_POST['status'] : '';
$uname = @$_POST['username'] ? $_POST['username'] : '';
$password = @$_POST['password'] ? $_POST['password'] : '';
//判断是否为空
if (empty($status)) {
	$output = array('data' => [], 'message' => '请求数据错误!', 'code' => 10001);
	//退出并输出数组
	exit(json_encode($output));
}

//走接口

if($status=="register"){
	//注册
	if(empty($uname)){
		$output = array('data' => [], 'message' => '用户名不能为空!', 'code' => 10002);
		//退出并输出数组
		exit(json_encode($output));
	}
	if(empty($password)||!preg_match("/^[0-9a-zA-Z]{6,20}$/", $password)){
		$output = array('data' => [], 'message' => '密码格式不对!', 'code' => 10003);
		//退出并输出数组
		exit(json_encode($output));
	}
	
	$mdpass=md5($password);
	//连接数据库获取数据
	$conn = mysql_connect("localhost", "root", "root");
	mysql_select_db("mydb", $conn);
	//设置字符集
	mysql_query("SET NAMES UTF8");
	
	$result = mysql_query("SELECT * FROM user");
	$count=0;
	
	
	while ($row = mysql_fetch_array($result)) {
		
		if($uname==$row["user_name"]){
			$count=1;
			break;
		}
		
	}
	
	if($count==0){
		$mysql="'{$uname}','{$mdpass}'";
	
		$result = mysql_query("INSERT INTO user (user_name,user_pass) VALUES ({$mysql})");
	
		
		
		if ($result==1) {
			$output = array('data' => [], 'message' => '注册成功!', 'code' => 0);
			print_r($output) ;
		}
		
	}else{
		$output = array('data' => [], 'message' => '用户名已存在存在!', 'code' => 10004);
		
		
	}
	//退出并输出数组
	exit(json_encode($output));
	mysql_close($conn);
	
	
	
	
	
}else if($status=="login"){
	
	//登录
	if(empty($uname)){
		$output = array('data' => [], 'message' => '用户名不能为空!', 'code' => 10002);
		//退出并输出数组
		exit(json_encode($output));
	}
	if(empty($password)){
		$output = array('data' => [], 'message' => '密码格式不对!', 'code' => 10003);
		//退出并输出数组
		exit(json_encode($output));
	}
	$mdpass=md5($password);
	//连接数据库获取数据
	$conn = mysql_connect("localhost", "root", "root");
	mysql_select_db("mydb", $conn);
	//设置字符集
	mysql_query("SET NAMES UTF8");
	
	$result = mysql_query("SELECT * FROM user");

	$input=array();
	$count=0;
	while ($row = mysql_fetch_array($result)) {
		array_push($input,$row["user_name"]);

		if($uname==$row["user_name"]){
			$count=1;

			if($mdpass!=$row["user_pass"]){
				$output = array('data' => [], 'message' => '密码错误!', 'code' => 20002);	
				//退出并输出数组
				exit(json_encode($output));	
			}else{
				$output = array('data' => array('username' => $row["user_name"],'avatar'=>'','user_id'=>$row["user_id"],'token'=>md5($mdpass)), 'message' => '登陆成功!', 'code' => 0);	
				//退出并输出数组
				exit(json_encode($output));
			}
		}
			
	}
	if($count==0){
		$output = array('data' => [], 'message' => '用户名不存在!', 'code' => 20001);
		//退出并输出数组
		exit(json_encode($output));
	}
	

	mysql_close($conn);
	
	
	
	
}























?>