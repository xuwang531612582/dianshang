(function ($) {
  "use strict";


  jQuery('nav#mobile-menu').meanmenu({
    meanScreenWidth: "991",
    meanMenuContainer: '.mobile-menu-area',
  });


  new WOW().init();


  $('.product-extra-link a').tooltip({
    container: 'body'
  });


  $('.item-left').last().find('.item-news').addClass('item-last-child');
  $('.item-right').last().find('.item-news').addClass('item-last-child');
  if ($('.content-news-scroll').length > 0) {
    $(".content-news-scroll").mCustomScrollbar({
      scrollButtons: {
        enable: true
      }
    });
  }


  $(".wrap-item").owlCarousel({
    autoPlay: false,
    slideSpeed: 2000,
    pagination: false,
    navigation: true,
    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    items: 4,
    itemsCustom: [
      [0, 1],
      [450, 1],
      [480, 2],
      [600, 2],
      [700, 3],
      [768, 3],
      [992, 3],
      [1199, 4]
    ],
  });

  $(".related-item").owlCarousel({
    autoPlay: false,
    slideSpeed: 2000,
    pagination: false,
    navigation: true,
    items: 3,
    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [980, 3],
    itemsTablet: [768, 2],
    itemsMobile: [479, 1],
  });

  $(".wrap-item-single").owlCarousel({
    autoPlay: false,
    slideSpeed: 2000,
    pagination: false,
    navigation: true,
    items: 1,
    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    itemsDesktop: [1199, 1],
    itemsDesktopSmall: [980, 1],
    itemsTablet: [768, 1],
    itemsMobile: [479, 1],
  });

  $(".upcoming-curosel").owlCarousel({
    autoPlay: false,
    slideSpeed: 3000,
    pagination: true,
    navigation: false,
    items: 1,
    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    itemsDesktop: [1199, 1],
    itemsDesktopSmall: [980, 1],
    itemsTablet: [768, 1],
    itemsMobile: [479, 1],
  });



  $(".client-active").owlCarousel({
    autoPlay: false,
    slideSpeed: 3000,
    pagination: false,
    navigation: false,
    items: 6,
    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    itemsDesktop: [1199, 5],
    itemsDesktopSmall: [980, 5],
    itemsTablet: [768, 3],
    itemsMobile: [479, 2],
  });

  $(".aside-hotsell").owlCarousel({
    autoPlay: false,
    slideSpeed: 3000,
    pagination: false,
    navigation: false,
    items: 1,
    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    singleItem: true,
  });



  $(".n-menu > li > a").on("click", function (e) {
    if ($(this).parent('li').hasClass('active')) {
      $(this).parent('li').removeClass('active');
      $(this).siblings('ul').slideUp();
    } else {
      $('.n-menu > li > a').parent('li').removeClass('active');
      $(this).parent('li').addClass('active');
      $(".n-menu > li ul").slideUp();
      $(this).siblings('ul').slideDown();
    }
  });

  $(".cart-plus-minus")
  $(".qtybutton").on("click", function () {
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    if ($button.text() == "+") {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    $button.parent().find("input").val(newVal);
  });

  $("#zoom_03").elevateZoom({
    constrainType: "height",
    zoomType: "lens",
    containLensZoom: true,
    gallery: 'gallery_01',
    cursor: 'pointer',
    galleryActiveClass: "active"
  });


  $("#zoom_03").on("click", function (e) {
    var ez = $('#zoom_03').data('elevateZoom');
    $.fancybox(ez.getGalleryList());
    return false;
  });

  $.scrollUp({
    scrollText: '<i class="fa fa-angle-up"></i>',
    easingType: 'linear',
    scrollSpeed: 900,
    animation: 'fade'
  });


})(jQuery);