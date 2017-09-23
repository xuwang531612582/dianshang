$(function() {

	var goodId = location.search.slice(1).split("=");

	$.ajax({
		"type": "get",
		"url": "http://h6.duchengjiu.top/shop/api_goods.php",
		"data": {
			"goods_id": goodId[1]
		},
		"success": function(response) {
			addDetail(response);
			//放大
			enlarge();
			//fangda();
			//飞入购物车
			addCart(goodId[1]);

		}
	});

});

function addDetail(response) {
	var $li = $(".item-product-list");
	var obj = response.data;
	console.log($li, response);

	$li.find(".product-info2-title").html('<a href="#">' + obj[0].goods_name + '</a>');
	$li.find(".small-box img").attr("src", obj[0].goods_thumb);

	var w = $li.find(".small-box img").width();
	var h = $li.find(".small-box img").height();
	console.log(w, h);
	$li.find(".big-box img").attr("src", obj[0].goods_thumb).css({
		"width": 2 * w
	});
	$li.find(".info-product-price span").text("$"+obj[0].price);
	$li.find(".info-product-price del").text("$"+obj[0].price);

}

function enlarge() {
	//放大镜
	var scrollTop = $(window).scrollTop()
	var rate = $(".small-box img").width() / $(".big-box img").width();
	$(".small-box").mousemove(function(event) {
		var x = event.clientX - $(this).offset().left - $(".float-box").width() / 2;
		var y = event.clientY - $(this).offset().top + $(window).scrollTop() - $(".float-box").height() / 2;
		//console.log(x,y);
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x > $(this).find("img").width() - $(".float-box").width()) x = $(this).find("img").width() - $(".float-box").width();
		if (y > $(this).find("img").height() - $(".float-box").height()) y = $(this).find("img").height() - $(".float-box").height();

		$(".float-box").show().css({
			"left": x,
			"top": y
		});
		$(".big-box").show();
		$(".big-box img").css({
			"left": -x / rate,
			"top": -y / rate
		})
	});

	$(".small-box").mouseout(function() {
		$(".float-box").hide();
		$(".big-box").hide();
	});
}

function addCart(goodId) {
	var good_number = 0;
	$(".addCart").click(function() {
		good_number = $(".numb").val();
		var $img = $(this).parents(".item-product-list").find(".small-box img");
		addCartFun($img, goodId, good_number);
	});
}

function addCartTouch(goodId){
	var good_number = 0;
	$(".addCart").addEventListener("touchstart",function(event){
		event.preventDefault()
		good_number = $(".numb").val();
		var $img = $(this).parents(".item-product-list").find(".small-box img");
		addCartFun($img, goodId, good_number);
	})
}



//放大不成功
function fangda() {
	var Demo = document.getElementsByClassName("item-product-thumb")[0];
	var SmallBox = document.getElementsByClassName("small-box")[0];
	var Mark = document.getElementsByClassName("mark")[0];
	var FloatBox = document.getElementsByClassName("float-box")[0];
	var BigBox = document.getElementsByClassName("big-box")[0];
	var BigBoxImage = document.getElementsByClassName("bigimg")[0];

	SmallBox.onmouseover = function(event) {

		FloatBox.style.display = "block";
		BigBox.style.display = "block";
	}

	SmallBox.onmouseout = function() {
		FloatBox.style.display = "none";
		BigBox.style.display = "none";
	}
	SmallBox.onmousemove = function(e) {
		var _event = e || window.event
		var left = _event.clientX - Demo.offsetLeft - SmallBox.offsetLeft - FloatBox.offsetWidth / 2;
		var top = _event.clientY - Demo.offsetTop - SmallBox.offsetTop - FloatBox.offsetHeight / 2;
		if (left < 0) {
			left = 0;
		} else if (left > Mark.offsetWidth - FloatBox.offsetWidth) {
			left = Mark.offsetWidth - FloatBox.offsetWidth;
		}
		if (top < 0) {
			top = 0;
		} else if (top > Mark.offsetHeight - FloatBox.offsetHeight) {
			top = Mark.offsetHeight - FloatBox.offsetHeight;
		}
		FloatBox.style.left = left + 'px';
		FloatBox.style.top = top + 'px';
		var percentX = left / (Mark.offsetWidth - FloatBox.offsetWidth);
		var percentY = top / (Mark.offsetHeight - FloatBox.offsetHeight);
		BigBoxImage.style.left = -percentX * (BigBoxImage.offsetWidth - BigBox.offsetWidth) + 'px';
		BigBoxImage.style.top = -percentY * (BigBoxImage.offsetHeight - BigBox.offsetHeight) + 'px';
	}
}