// 用户名提示
$(".untxt").focus(function () {

  $(".un-tip").html("请使用字母、数字、下划线组合，3-20位字符");

});


$(".untxt").blur(function () {

  var username = $(".untxt").val();

  $.ajax({
    "url": "http://h6.duchengjiu.top/shop/api_user.php",
    "type": "POST",
    "datatype": "json",
    "data": {
      "status": "check",
      "username": username
    },
    "success": function (response) {
      $(".un-tip").html(response.message);
      if (response.code != 0) {
        $(".un-tip").addClass("wrong");
        $(".untxt").addClass("error");
      } else {
        $(".un-tip").removeClass("wrong");
        $(".untxt").removeClass("error");
      }
    }
  });
});


// 密码提示
$(".pwtxt").focus(function () {

  $(".upw_tip").html("建议使用字母、数字、下划线等两种或两种以上组合，6-20位字符");

});

$(".pwtxt").blur(function () {

  var password = $(".pwtxt").val();

  if (password.length < 6 || password.length > 20) {
    $(".upw_tip").html("请输入6-20位密码");
    $(".upw_tip").addClass("wrong");
    $(".pwtxt").addClass("error");
  } else {
    $(".upw_tip").html("");
    $(".upw_tip").removeClass("wrong");
    $(".pwtxt").removeClass("error");
  }

});



// 确认密码提示
$(".rpwtxt").focus(function () {

  $(".rupw_tip").html("请再次输入密码");

});


$(".rpwtxt").blur(function () {

  var password = $(".pwtxt").val();
  var repassword = $(".rpwtxt").val();

  if (password === repassword) {
    $(".rupw_tip").html("");
    $(".rupw_tip").removeClass("wrong");
    $(".rpwtxt").removeClass("error");

  } else {
    $(".rupw_tip").html("两次密码不一致，请重新输入");
    $(".rupw_tip").addClass("wrong");
    $(".rpwtxt").addClass("error");
  }

});


// 注册提交
$(".btn-submit").click(function () {

  var username = $(".untxt").val();
  var password = $(".pwtxt").val();
  var repassword = $(".rpwtxt").val();

  if (password === repassword) {

    $(".rupw_tip").removeClass("wrong");
    $(".rpwtxt").removeClass("error");

    $.ajax({

      "url": "http://h6.duchengjiu.top/shop/api_user.php",
      "type": "POST",
      "data": {
        "status": "register",
        "username": username,
        "password": password
      },
      "dataType": "json",
      "success": function (response) {

        console.log(response);
        if (response.code == 0) {
          $(".submit-tip").html("注册成功,3s后跳转登录页");
          $(".submit-tip").removeClass("wrong");

          setTimeout(function () {
            window.location.href = "login.html";
          }, 3000);


        } else if (response.code == 2001) {
          $(".un-tip").html(response.message);
          $(".un-tip").addClass("wrong");
          $(".untxt").addClass("error");
        } else {
          $(".submit-tip").show();
          $(".submit-tip").html(response.message);
          $(".submit-tip").delay(3000).hide(2000);

        }
      }

    });

  } else {

    $(".rupw_tip").html("两次密码不一致，请重新输入");
    $(".rupw_tip").addClass("wrong");
    $(".rpwtxt").addClass("error");

  }



});