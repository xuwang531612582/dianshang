var token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
$(function() {
	addTopCart();
	//获取广告
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_ad.php",
		"type": "GET",
		"data": {
			"position_id": 1
		},
		"success": function(response) {

			adInsert($("[role=listbox]"), response, $(".carousel-indicators"));
		}
	});
	//商品分类
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_cat.php",
		"type": "GET",
		"success": function(response) {

			adInsertNav($(".special .sp_nav ul"), response)
		}
	});
	//获取商品列表
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_goods.php",
		"type": "GET",
		"data": {
			"page": 2,
			"pagesize": 8
		},
		"success": function(response) {

			adInsertList($(".special .content .row"), response);
			$('[data-toggle="popover"]').popover();

			$(".addCart").click(function() {

				goodsId = $(this).attr("goodid");

				

				addCartFun($(this).parents(".sp_img").find("img"),goodsId);
			});
		}
	});

});

function adInsert(element, response, spot) {
	var obj = response.data;
	var html = '';
	for (var i = 1; i < obj.length; i++) {
		html += `<div class="item">
			<a href="${obj[i].thumb}">
				<img src="${obj[i].url}" alt="...">
			</a>
					
			<div class="carousel-caption">
				
			</div>
		</div>`;
		if (spot) {
			spot.append(' <li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>')
		}

	}

	element.append(html);
}

function adInsertNav(element, response) {
	var obj = response.data;
	var html = '';
	for (var i = 0; i < obj.length; i++) {
		html += `<li><a href="shoplist.html?cartId=${obj[i].cat_id}" cartId="${obj[i].cat_name}">${obj[i].cat_name}</a></li>`;

	}

	element.append(html);
}

function adInsertList(element, response) {
	var obj = response.data;
	var html = '';
	for (var i = 0; i < obj.length; i++) {
		html += `<div class="col col-lg-3 col-md-4 col-sm-6">
						<div class="sp_img">
							<a href="details.html?goodId=${obj[i].goods_id}">
								<img src="${obj[i].goods_thumb}"/>
							</a>
							
							<div class="sp_btn">
								<span class="collection btn" goodId=${obj[i].goods_id} data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="收藏">
									<i class="glyphicon glyphicon-heart"></i>
								</span>
								<span class="addCart btn" goodId=${obj[i].goods_id} data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="添加到购物车">
									<i class="glyphicon glyphicon-shopping-cart"></i>
								</span>
								<span class="qSearch btn" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="快速浏览">
									<i class="glyphicon glyphicon-search"></i>
								</span>
							</div>
						</div>
						<div class="sp_info">
							<a href="details.html?goodId=${obj[i].goods_id}">
								<p class="sp_title">${obj[i].goods_name}</p>
							</a>
							
							<p class="price">
								<span class="persale">10%</span>
								<span class="new_price">$ ${obj[i].price}</span>
								<span class="old_price">$345</span>
							</p>
						</div>
						
					</div>`;

	}

	element.append(html);
}

//倒计时
function daojishi() {
	var box = document.getElementsByClassName("timer")[0];

	var mytime = new Date();
	var tian = 18 - mytime.getDate();
	var shi = 23 - mytime.getHours();
	var fen = 59 - mytime.getMinutes();
	var miao = 59 - mytime.getSeconds();
	box.innerHTML = tian + "天" + shi + "时" + fen + "分" + miao + "秒";

}
setInterval(daojishi, 1000);