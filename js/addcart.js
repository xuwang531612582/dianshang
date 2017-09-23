var token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');;

function addCartFun(obj, goodsId, goods_number) {

	goods_number = goods_number ? goods_number : 1;

	token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');

	if (!token) {
		var str = confirm("您还没有登录！是否现在登录");
		if (str) {
			location.href = "login.html#callback=" + location.href;
			return;
		} else {
			return;
		}

	}
	//console.log(obj.attr("src"))
	fly(obj);
	var gNumber = localStorage.getItem("cart" + goodsId) ? localStorage.getItem("cart" + goodsId) : sessionStorage.getItem("cart" + goodsId);

	gNumber = gNumber ? (parseInt(gNumber) + parseInt(goods_number)) : parseInt(goods_number);

	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + token,
		"type": "post",
		"data": {
			"goods_id": goodsId,
			"number": gNumber

		},
		"success": function(response) {
			console.log(response);
			if (response.code == 0) {
				
				if (localStorage.getItem("token")) {
					localStorage.setItem("cart" + goodsId, gNumber);
				} else if (sessionStorage.getItem("token")) {
					sessionStorage.setItem("cart" + goodsId, gNumber);
				}
				addTopCart();
				
			}
		}
	});

}
//飞	//fly---------
function fly(obj) {



	var scrollTop = 0;
	var offset = $('#end').offset();
	//fly---------
	
	scrollTop = $(window).scrollTop();
	$(window).scroll(function() {
		scrollTop = $(window).scrollTop();
		
	});
	$(window).resize(site);

	function site() {
		
		$(window).scrollTop(0);
		offset = $('#end').offset();
		
	}
	//fly---------

	//fly-----------------------
	//飞入购物车
	var addcar = obj;
	
	//var imgNode = addcar.parent().parent().children()[0].childNodes[1];
	var img = addcar.attr("src");
	var flyerimg = $('<img class="u-flyer" src="' + img + '">');
	flyerimg.css({
		"display": "block",
		"width": 100,
		"height": 100,
		"border-radius": 50,
		/*position: fixed;*/
		"z-index": 9999,
	})

	flyerimg.fly({
		start: {
			left: event.pageX,
			top: event.pageY - scrollTop
		},
		end: {
			left: offset.left + 10,
			top: offset.top - scrollTop,
			width: 0,
			height: 0
		},
		onEnd: function() {

			this.destory();
		}
	});
	//fly-----------------------

}

function addTopCart() {

	//购物车列表添加
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + token,
		"type": "GET",
		"dataType": "json",
		"success": function(response) {

			var obj = response.data;
			var html = '';
			var allPrice = 0;
			for (var i = 0; i < obj.length; i++) {
				html += `<div class="row mini-cart-item ">
						<a class="cart_list_product_img" href="#">
							<img alt="04" src="${obj[i].goods_thumb}" class="attachment-shop_thumbnail">
						</a>
						<div class="mini-cart-info">
							<a class="cart_list_product_title" href="#">${obj[i].goods_name}</a>
							<div class="cart_list_product_quantity">${obj[i].goods_number} x <span class="amount">$${obj[i].goods_price}</span></div>
						</div>
						<a href="#" class="remove" cartid="${obj[i].cart_id}" goodsid="${obj[i].goods_id}" title="Remove this item"><i class="fa fa-trash-o"></i></a>
					</div>`;

				allPrice += obj[i].goods_number * obj[i].goods_price;

			}

			$(".cart-sub .minicart_total_checkout .amount").text("$" + allPrice + ".00");
			$(".cart-sub .all_carts_item").html(html);

			$(".cart-icon .cart-count strong").text(obj.length);

		}

	});
	
	

}

function deletTopCart(){
	$(".cart-sub .all_carts_item").click(function(event) {
		var $remove = $(event.target).parent();
		if (event.target && $remove.attr("class") == "remove") {
			var str = confirm("你确定要删除该商品吗?");
			if (!str) {
				return;
			}

			var goodsId = $remove.attr("goodsid");

			$.ajax({
				"url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + token,
				"type": "POST",
				"data": {
					"goods_id": goodsId,
					"number": 0
				},
				"dataType": "json",
				"success": function(response) {
					
					addTopCart()
					alert("商品已经删除!");
					location.href=location.href;

				}
			});
		}
	});
}
deletTopCart();