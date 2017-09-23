var token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');

var dataId = location.search.slice(1).split("=");
var page = 1;
var maxPage = 1;

$(function () {
  addTopCart();

  changeGridPage(1);

  changeListPage(1);
  changePro();


  // 动态获取页码总数
  $.get("http://h6.duchengjiu.top/shop/api_goods.php?pagesize=9", function (response) {
    maxPage = response.page.page_count;

    for (var i = 0; i < maxPage; i++) {
      $("#grid .page-area ul").append("<li><a href='#grid'>" + (i + 1) + "</a></li>");
    }
    $(".grid-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");
  });

  $.get("http://h6.duchengjiu.top/shop/api_goods.php?pagesize=4", function (response) {
    maxPage = response.page.page_count;

    for (var i = 0; i < maxPage; i++) {
      $("#list .page-area ul").append("<li><a href='#list'>" + (i + 1) + "</a></li>");
    }
    $(".list-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");
  });
});







// 点击页码改变相应ajax数据
function changePro() {

  // grid页面
  $(".grid-page").click(function (event) {

    if (event.target.nodeName === "A") {

      page = event.target.innerText;

      $(".grid").html("");

      $(".grid-page").css("marginLeft", (page - 1) * -49);
      changeGridPage(page);

      $(".grid-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");
    }
  });


  $(".grid-prev").click(function () {
    page--;
    if (page < 1) page = 1;
    $(".grid").html("");
    changeGridPage(page);
    $(".grid-page").css("marginLeft", (page - 1) * -49);
    $(".grid-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");
  });


  $(".grid-next").click(function () {
    page++;
    if (page > maxPage) page = maxPage;
    $(".grid").html("");
    changeGridPage(page);
    $(".grid-page").css("marginLeft", (page - 1) * -49);
    $(".grid-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");

  });

  // list页面
  $(".list-page").click(function (event) {

    if (event.target.nodeName === "A") {

      page = event.target.innerText;

      $(".list").html("");

      $(".list-page").css("marginLeft", (page - 1) * -49);
      changeListPage(page);
      $(".list-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");

    }
  });

  $(".list-prev").click(function () {
    page--;
    if (page < 1) page = 1;
    $(".list").html("");
    changeListPage(page);
    $(".list-page").css("marginLeft", (page - 1) * -49);
    $(".list-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");

  });


  $(".list-next").click(function () {
    page++;
    if (page > maxPage) page = maxPage;
    $(".list").html("");
    changeListPage(page);
    $(".list-page").css("marginLeft", (page - 1) * -49);
    $(".list-page li a").eq(page - 1).addClass("active").parent().siblings().children().removeClass("active");

  });



}




// 调用grid页面商品数据。
function changeGridPage(page) {
	var data;
	console.log(dataId);
	if(dataId[0]==''){
		//console.log(dataId[0]);
		data={
	    "page": page,
	    "pagesize": 9
		}
	}else{
		data = (dataId[0] == "cartId") ? {
	    "cat_id": parseInt(dataId[1]),
	    "page": page,
	    "pagesize": 9
	  } : {
	    "search_text": decodeURI(dataId[1]),
	    "page": page,
	    "pagesize": 9
	  };
	}
  

  //获取商品列表
  $.ajax({
    "url": "http://h6.duchengjiu.top/shop/api_goods.php",
    "type": "GET",
    "data": data,
    "success": function (response) {
    	console.log(response)
      adInsertGrid(response);


      $('[data-toggle="popover"]').popover();
      $(".grid .addCart").click(function () {
        var $img = $(this).parents(".sp_img").find("img");
        goodsId = $(this).attr("goodId");
        
        addCartFun($img, goodsId);
      });
    }
  });
  uiDrag();
}
//changeGridPage(page);

// 改变grid页面DOM元素
function adInsertGrid(response) {
  var obj = response.data;
  var html = '';
  for (var i = 0; i < obj.length; i++) {
    html += `<div class="col col-md-4 col-sm-6">
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
  $(".grid").append(html);
}


// 调用list页面商品数据。
function changeListPage(page) {
	var data;
	
	if(dataId[0]==''){
		//console.log(dataId[0]);
		data={
	    "page": page,
	    "pagesize": 9
		}
	}else{
		data = (dataId[0] == "cartId") ? {
	    "cart_id": dataId[1],
	    "page": page,
	    "pagesize": 4
	  } : {
	    "search_text": decodeURI(dataId[1]),
	    "page": page,
	    "pagesize": 4
	  };
	}
  

  
  //获取商品列表
  $.ajax({
    "url": "http://h6.duchengjiu.top/shop/api_goods.php",
    "type": "GET",
    "data": data,
    "success": function (response) {
      
      adInsertList(response);


      $('[data-toggle="popover"]').popover();
      $(".list .addCart").click(function () {
        var $img = $(this).parents(".item-product").find("img");
        goodsId = $(this).attr("goodId");
        console.log($img)
        addCartFun($img, goodsId);
      });
    }
  });
  uiDrag();
}
//changeListPage(page);
// 改变list页面DOM元素
function adInsertList(response) {
  var obj = response.data;
  var html = '';
  for (var i = 0; i < obj.length; i++) {
    html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="item-product item-product-list">
						<div class="item-product-thumb">
							<a href="details.html?goodId=${obj[i].goods_id}">
								<img src="${obj[i].goods_thumb}" />
							</a>
						</div>
						<div class="item-product-info2">
							<h3>
								<a href="details.html?goodId=${obj[i].goods_id}">${obj[i].goods_name}</a>
							</h3>
							<div class="ratting-review">
								<div class="info-rating">
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
								</div>
								<div class="order-number">
									<span>（5颗星）</span>
								</div>
								<div class="review-add">
									<a href="#">添加您的评论</a>
								</div>
							</div>
							<div class="info-product-price">
								<label class="persale">10％</label>
								<span>$ ${obj[i].price}</span>
								<del>$ ${obj[i].price}</del>
							</div>
							<div class="list-item-des">
								<span>${obj[i].goods_desc}</span>
							</div>
							<div class="product-extra-link">
								<span class="collection btn" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="收藏">
									<i class="glyphicon glyphicon-heart"></i>
								</span>
								<span class="addCart btn" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="添加到购物车">
									<i class="glyphicon glyphicon-shopping-cart"></i>
								</span>
								<span class="qSearch btn" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="快速浏览">
									<i class="glyphicon glyphicon-search"></i>
								</span>
							</div>
							<div class="item-bought">
								<span class="btn">11买了</span>
							</div>
						</div>
					</div>
				</div>`;

  }

  $(".list").append(html);
}








//40~100

function uiDrag() {
  var $range = $("#range");
  var $handleLeft = $("#handle_left");
  var $handleRight = $("#handle_right");
  var $pText = $("#p_text");

  var rWidth = $range[0].clientWidth;

  $handleLeft.css("left", 0 + "%");
  $handleRight.css("left", 100 + "%");

  var rate = 0.5

  var deltaLX;
  var deltaRX;

  var newLX = 0;
  var newRX = 0;


  var marginLeft = parseFloat(window.getComputedStyle($handleRight[0]).marginLeft);

  var pLX = parseFloat(window.getComputedStyle($handleLeft[0]).left) / rWidth * 100;
  var pRX = (parseFloat(window.getComputedStyle($handleRight[0]).left)) / rWidth * 100;


  var maxPrice = 600;
  var minPrice = 40;




  $handleLeft[0].onmousedown = function (event) {
    event.preventDefault();
    deltaLX = event.clientX - newLX;


    document.onmousemove = function (event) {
      event.preventDefault();
      newLX = event.clientX - deltaLX;

      $pText.attr("value", newLX);

      pLX = 100 * newLX / rWidth;


      if (pLX < 0) {
        pLX = 0;

      }
      if (pLX > pRX + marginLeft / rWidth * 100) {
        pLX = pRX + marginLeft / rWidth * 100;
      }


      minPrice = 40 + parseInt(560 * pLX / 100);
      maxPrice = parseInt(600 * pRX / 100);
      $pText.attr("value", "$" + minPrice + "~" + "$" + maxPrice);
      $range[0].style.left = pLX + "%";
      $range[0].style.width = pRX - pLX + "%";

      $handleLeft[0].style.left = pLX + "%";
    }
    document.onmouseup = function () {
      //清空事件
      document.onmousemove = null;
      document.onmouseup = null;
    }
    return false;

  }

  $handleRight[0].onmousedown = function (event) {
    event.preventDefault();
    deltaRX = event.clientX - newRX;

    document.onmousemove = function (event) {
      event.preventDefault();
      newRX = (event.clientX - deltaRX);



      pRX = 100 * (rWidth + newRX) / rWidth;


      if (pRX < pLX - marginLeft / rWidth * 100) {
        pRX = pLX - marginLeft / rWidth * 100;

      }
      if (pRX > 100) {
        pRX = 100;
      }



      minPrice = 40 + parseInt(560 * pLX / 100);
      maxPrice = parseInt(600 * pRX / 100);

      $pText.attr("value", "$" + minPrice + "~" + "$" + maxPrice);
      $range[0].style.width = pRX - pLX + "%";

      $handleRight[0].style.left = pRX + "%";
    }
    document.onmouseup = function () {
      //清空事件
      document.onmousemove = null;
      document.onmouseup = null;
    }
    return false;

  }


}