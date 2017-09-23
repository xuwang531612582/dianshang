$(function() {
	$(".hd_top_wrap .top_nav li span.blue").attr("id", "end");

	$(".addBtn").click(function() {

	});
})

function fly() {
	var offset = $("#end").offset();
	var x = $(".small").offset().left;
	var y = $(".small").offset().top;
	var addcar = $(this);
	var img = $(".small").attr('src');
	var flyer = $('<img class="u-flyer" src="' + img + '" width="350" height="350">');

	flyer.fly({
		start: {
			left: x,
			top: y
		},
		end: {
			left: offset.left + 10,
			top: offset.top + 10,
			width: 0,
			height: 0
		},
		onEnd: function() {
			$("#msg").slideDown(500).fadeOut(1000);
			addcar.css({
				"cursor": "default",
				"borderColor": "red",
				"color": "red"
			}).unbind('click').text("商品已加入购物车");

		}
	});
}