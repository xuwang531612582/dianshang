var token=localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');;
$(function() {
	if (!token) {
		var str = confirm("您还没有登录！是否现在登录");

		if (str) {
			location.href = "login.html#callback=" + location.href;
			return;
		} else {
			return;
		}

	}
	
	addTopCart();
	
	
	var message = [];
	$("#pay").click(function() {
		$("form").each(function() {
			//表单序列化，字体转换
			if ($(this).serialize() != "") {
				message.push(decodeURI($(this).serialize()));
			}

		});

		
		$.ajax({
			"type": "post",
			"url": "api/myfirst.php",
			"data": message[0],

			"success": function(response) {
				
			}
		});
	});
	
	
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_order.php?token=" + token,
		"type": "GET",
		"dataType":"json",
		"success": function(response) {
			
			var obj=response.data;
			
			
			
		}

	});
	
	

})