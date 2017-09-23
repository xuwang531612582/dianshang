// 判断客户是否已登录，若登录返回首页
if (localStorage.getItem("token")) {
  $(".account-area .container").html("<p class='suclogin'>尊敬的 " + localStorage.username + " 您好,您已登录成功，请勿重复登录。5秒后将跳转至首页。</p>");

  setTimeout(function () {
    location.href = "index.html"
  }, 5000);
}



$(function () {

  $(".btn-submit").click(function () {

    var username = $(".untxt").val();
    var password = $(".pwtxt").val();


    $.ajax({

      "url": "http://h6.duchengjiu.top/shop/api_user.php",
      "type": "POST",
      "data": {
        "status": "login",
        "username": username,
        "password": password
      },
      "dataType": "json",
      "success": function (response) {
        console.log(response);

        // 当登录成功后，将客户信息存储在localStorage中
        if (response.code === 0) {

          $(".submit-tip").html("");
          $(".submit-tip").removeClass("wrong");

          var data = response.data;

          // 遍历登录成功后，服务器返回的数据json的每一项，将每一项存储于localStorage
          for (prop in data) {

            if (data.hasOwnProperty(prop)) {
              localStorage.setItem(prop, data[prop]);
            }
          }




          // 登录成功跳转首页


          var callbackURL = location.hash.substr(10);

          if (callbackURL) {
            location.href = callbackURL;
          } else {
            location.href = "index.html";
          }


        } else {
          $(".submit-tip").html(response.message);
        }

      }
    });
  });

});