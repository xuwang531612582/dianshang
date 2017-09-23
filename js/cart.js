$(function() {

	var token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
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
	//购物车列表添加
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + token,
		"type": "GET",
		"dataType": "json",
		"success": function(response) {
			var obj = response.data;
			var html = '';
			for (var i = 0; i < obj.length; i++) {

				html += `<tr class="cart_item">
						<td><input type="checkbox" class="checkOne" value="" /></td>
						<td class="item-img">
							<a href="#"><img src="${obj[i].goods_thumb}" alt=""> </a>
						</td>
						<td class="item-title">
							<a href="#">${obj[i].goods_name} </a>
						</td>
						<td class="item-price">$${obj[i].goods_price}</td>
						<td class="item-qty">
							<input type="number" value="${obj[i].goods_number}" min="1">
						</td>
						<td class="total-price">$${obj[i].goods_number*obj[i].goods_price}.00</td>
						<td class="remove">
							<a href="#" goodsid="${obj[i].goods_id}">X</a>
						</td>
					</tr>`;
			}
			$(".cart-area .shop_table tbody ").prepend(function(n) {
				return html;
			});

		}

	});

	$(".cart-area .shop_table").click(function(event) {

		var $oneCheck = $(this).find(".checkOne");
		if (event.target.id == "all_check") {
			var $allCheck = $(event.target);

			if ($allCheck.prop("checked")) {
				$allCheck.parents(".shop_table").find(".checkOne").prop("checked", true);
			} else {
				$allCheck.parents(".shop_table").find(".checkOne").prop("checked", false);
			}

		}

		if ($(event.target).text() == "X") {
			var goodsId = $(event.target).attr("goodsid");
			$.ajax({
				"url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + token,
				"type": "POST",
				"data": {
					"goods_id": goodsId,
					"number": 0
				},
				"dataType": "json",
				"success": function(response) {
					$(event.target).parents(".cart_item").remove();
					addTopCart();
				}
			});

		}

		if ($(event.target).prop("type") == "number") {
			var unitPrice = $(event.target).parents(".cart_item").children(".item-price").text();
			var total = $(event.target).parents(".cart_item").children(".total-price").text();
			var num = parseInt($(event.target).val());
			unitPrice = parseInt(unitPrice.slice(1));
			total = unitPrice * num;

			$(event.target).parents(".cart_item").children(".total-price").text("$" + total + ".00");

		}

		if (event.target.id == "all_check" || event.target.className == "checkOne" || $(event.target).text() == "X" || $(event.target).prop("type") == "number") {
			$(".cgt-des").eq(0).text("$" + sum($oneCheck) + ".00");
			$(".cgt-des").eq(2).text("$" + sum($oneCheck) + ".00");

		}

	});

	function sum(obj) {
		var sumP = 0;
		obj.each(function(i) {

			if ($(this).prop("checked")) {
				var str = $(this).parents("tr").children(".total-price").text()

				sumP += parseInt(str.slice(1));
			}
		})
		return sumP;
	}

	function tP() {
		var totalP = $(".total").text();

		$(".place-order").click(function() {

			//location.href="payment.html?total=";
		})
	}

})