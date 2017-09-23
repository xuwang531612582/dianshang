//搜索框
var $sBtn = $("#searchbtn");
var $sBox = $("#search");

$sBtn.click(function () {

  if ($sBox.val() == "") {
    alert("请输入你想要搜索的商品");
  } else {
    location.href = "shoplist.html?keyWord=" + $sBox.val();
  }

});


//显示用户名
if (localStorage.getItem("token")) {
  $(".top-bar li.first").html("<a href='#'>" + "<i class='fa fa-user'></i>" + localStorage.getItem("username") + "</a>");

  $(".top-bar .tp-right li:last-child").addClass("last").html("<a href='javascript:;'>退出</a>").css("cursor", "pointer");

} else {
  $(".top-bar .account li:nth-child(2)").removeClass("last").html("<a href='register.html'>注册</a>");
}


//退出
$(".top-bar .n-menu li.last").click(function () {
  localStorage.clear();
  sessionStorage.clear();
  location.href = "index.html";
});




//购物车跳转
$(".cart-icon").click(cart);
$(".btn-viewcart").click(cart);

function cart() {
  if (localStorage.getItem("token")) {
    location.href = "cart.html";
  } else if (sessionStorage.getItem("token")) {
    location.href = "cart.html";
  } else {
    var str = confirm("您还没有登录！是否现在登录");

    if (str) {
      location.href = "login.html#callback=" + location.href;
      return;
    } else {
      return;
    }
  }
}



if ($(window).scrollTop() > 0) {
  $(window).scrollTop(0);
  document.documentElement.scrollTop = 0;
}
$(document).scroll(function (event) {

  ceiling();
})


function ceiling() {

  if ($(document).scrollTop() > 132) {

    $(".main-menu-area").addClass("navbar-fixed-top");

  } else {

    $("header .navbar-fixed-top").removeClass("navbar-fixed-top");

  }
}



function payment() {
  
  $(".btn-checkout").click(function () {
    if (localStorage.getItem("token")) {
      location.href = "payment.html";
    } else if (sessionStorage.getItem("token")) {
      location.href = "payment.html";
    } else {
      var str = confirm("您还没有登录！是否现在登录");

      if (str) {
        location.href = "login.html#callback=" + location.href;
        return;
      } else {
        return;
      }
    }
  })

}
payment();

//console.log($(".wishlist"))
//头部收藏
$(".wishlist").click(wishlist);

function wishlist() {

  if (localStorage.getItem("token")) {
    location.href = "collection.html";
  } else if (sessionStorage.getItem("token")) {
    location.href = "collection.html";
  } else {
    var str = confirm("您还没有登录！是否现在登录");

    if (str) {
      location.href = "login.html#callback=" + location.href;
      return;
    } else {
      return;
    }
  }



}