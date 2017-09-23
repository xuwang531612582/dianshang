$(function() {

	var token;
	if (localStorage.getItem("token")) {
		token = localStorage.token;
	} else if (sessionStorage.getItem("token")) {
		token = sessionStorage.token;
	}
	//订单详情
	var sum = 0;
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + token,
		"type": "GET",
		"dataType": "json",
		"success": function(response) {
			
			var obj = response.data;
			for (var i = 0; i < obj.length; i++) {
				sum += parseInt(obj[i].goods_number) * parseInt(obj[i].goods_price);
			}
			$(".total_payment .Money").html("$" + sum + ".00");
		}

	});

	

	//

	$(".title span.blue").removeClass("blue").siblings().addClass("blue");

	//查询地址
	addrAjax();

	function addrAjax() {

		$.ajax({
			"type": "GET",
			"url": "http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + token,
			"dataType": "json",
			"success": function(response) {
				
				var obj = response.data;
				if (obj.length > 0) {
					$(".addr_box .addr_list .addr_list_item").remove();
					var html = '';
					for (var i = 0; i < obj.length; i++) {
						html += `<div class="addr_list_item col-lg-3 col-md-4 col-sm-6 col-xs-12">
									<div class="item_info">
										<div class="row">
											<div class="col-xs-12">
												<div class="name_phone clearfix">
													<div class="l floatleft text-left">${obj[i].address_name}</div>
													<div class="r floatright text-right">${obj[i].mobile}</div>
												</div>
											</div>
											<div class="col-xs-12">
												<div class="citys">
													${obj[i].province}-${obj[i].citys}-${obj[i].district}
												</div>
											</div>
											<div class="col-xs-12">
												<div class="addr">
													${obj[i].address}
												</div>
											</div>
											<div class="col-xs-12">
												<div class="operate">
													<div class="btn set" title="设为默认">设为默认</div>
													<div class="btn delete r floatright" title="删除" addressid="${obj[i].address_id}">删除</div>
													<div class="btn change r floatright" title="编辑">编辑</div>
													</divp>
												</div>
											</div>

										</div>
									</div>

								</div>
						`;

					}
					$(".addr_box .addr_list").children(".row").html(html);

					$(".addr_box .addr_list .addr_list_item").eq(0).addClass("first").find(".operate").show().children(".set").html("默认地址");
					$(".addr_box").show();
					$(".add_new_addr").show();
					$("form").eq(1).hide();
					//					for (var i=0;i<obj.length;i++) {
					//						if($(".addr_box .addr_list .addr_list_item").prop("class")!="first"){
					//							setShowHide($(".addr_box .addr_list .addr_list_item").eq(i));
					//						}
					//						
					//					}
					var phon = $(".addr_box .addr_list .first").find(".name_phone .r").text();

					var oPhon = phon.replace(phon.substr(3, 4), "****");
					$(".addr_total_payment .addr").html("寄送至：" + $(".addr_box .addr_list .first").children(".addr").text() + " 收货人:" + $(".addr_box .addr_list .addr_list_item.first").find(".name_phone .l").text() + " " + oPhon);
					$(".addr_total_payment .addr").attr("address_id", $(".addr_box .addr_list .first").attr("address_id"))

					$(".addr_box .addr_list .addr_list_item").each(function() {
						$(this).click(function() {
							phon = $(this).find(".name_phone .r").text();
							$(this).css("border-color", "#7292FA").siblings().css("border-color", "#ccc")
							oPhon = phon.replace(phon.substr(3, 4), "****");
							$(".addr_total_payment .addr").attr("address_id", $(this).attr("address_id"))
							$(".addr_total_payment .addr").html("寄送至：" + $(this).children(".addr").text() + " 收货人：" + $(this).find(".name_phone .l").text() + " " + oPhon);
						})
					});
					//placeOrder();

				} else {
					//alert("请填写收货地址");
					$(".addr_box").hide();
					$(".add_new_addr").hide();
					$("form").eq(1).show();
					$(".addr_total_payment .addr").html("");

				}

			}
		});
	}
	//添加地址

	$(".save_addr a").click(function() {
		var data = $("form").eq(1).serialize();
		if ($("#phone").val() == "" || $("#pay_name").val() == "" || $("#detail_addr").val() == "" || $("#province").val() == "所在省份" || $("#city").val() == "所在城市" || $("#area").val() == "所在区县") {
			//console.log(decodeURI(data));
			alert("请确保信息填写完整")
			return;
		}

		$.ajax({
			"type": "POST",
			"url": "http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + token + "&status=add",
			"dataType": "json",
			"data": data,
			"success": function(response) {
				//console.log(response);
				if (response.code === 0) {
					addrAjax();
				}
			}
		});
	});

	$(".addr_box .addr_list").click(function(event) {
		//删除地址http://h6.duchengjiu.top/shop/api_useraddress.php?status=delete&address_id=19

		

		if ($(event.target).hasClass("delete")) {
			var $ele = $(event.target).parents(".addr_list_item")
			if ($ele.hasClass("first")) {
				alert("不能删除默认地址");
				return;
			}

			var str = confirm("你确定要删除该地址吗?");

			if (str) {
				var addressId = $(event.target).attr("addressid");
				console.log(addressId);
				$.ajax({
					"type": "GET",
					"url": "http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + token + "&status=delete&address_id=" + addressId,
					"dataType": "json",

					"success": function(response) {
						//console.log(response);
						if (response.code === 0) {
							addrAjax();
						} else {
							alert("删除失败");
						}
					}
				});

			}
		}

		//设置默认地址

		if ($(event.target).hasClass("set")) {

			var oLi = $(event.target).parents(".addr_list_item")[0];

			var index = $(event.target).index();
			//console.log(index);
			$(event.target).html("默认地址").parents(".addr_list_item").addClass("first").siblings(".first").removeClass("first").find(".set").html("设为默认");

			var oUl = $(".addr_box .addr_list").children(".row")[0];
			console.log($(".addr_box .addr_list"));
			console.log(oUl);
			oUl.insertBefore(oLi, oUl.childNodes[0])

		}

	});
	//添加地址框出现隐藏
	$("#add_new_addr").click(function() {
		if ($("#add_new_addr").prop("checked")) {
			$("form").eq(1).show();
		} else {
			$("form").eq(1).hide();
		}
	});

	//设为默认
	function setShowHide(obj) {
		obj.mouseover(function() {
			$(this).children(".operate").show();
		})
		obj.mouseleave(function() {
			$(this).children(".operate").hide();
		})
	}

	//支付方式
	$(".way input").each(function(i) {
		$(this).click(function() {
			$(this).parent().addClass("cur").siblings(".cur").removeClass("cur")
		})
	});

	function placeOrder() {
		$(".placeOrder a").click(function() {
			var address_id = parseInt($(".addr_total_payment .addr").attr("address_id"))
			console.log(address_id)
			if ($(".addr_total_payment .addr").html() != "") {
				$.ajax({
					"url": "http://h6.duchengjiu.top/shop/api_order.php?token=" + token + "&status=add",
					"type": "POST",
					"data": {
						"address_id": address_id,
						"total_prices": sum[1],
						"cart_id": 3114
					},
					"success": function(response) {
						console.log(response);
						location.href = "order.html";
					}

				});

			} else {
				alert("请选择收货地址");
			}
		})
	}

})