var token=localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');;


$(function(){
	
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
})
