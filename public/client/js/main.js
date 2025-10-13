(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner(0);

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow");
      } else {
        $(".fixed-top").removeClass("shadow");
      }
    } else {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow").css("top", -55);
      } else {
        $(".fixed-top").removeClass("shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonial carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 2,
      },
    },
  });

  // vegetable carousel
  $(".vegetable-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Product Quantity
  // $('.quantity button').on('click', function () {
  //     var button = $(this);
  //     var oldValue = button.parent().parent().find('input').val();
  //     if (button.hasClass('btn-plus')) {
  //         var newVal = parseFloat(oldValue) + 1;
  //     } else {
  //         if (oldValue > 0) {
  //             var newVal = parseFloat(oldValue) - 1;
  //         } else {
  //             newVal = 0;
  //         }
  //     }
  //     button.parent().parent().find('input').val(newVal);
  // });
  // Bắt sự kiện click cho các nút (+) và (-) trong giỏ hàng
  $(".quantity button").on("click", function () {
    // Biến 'change' để theo dõi sự thay đổi (+1 hoặc -1 sản phẩm)
    let change = 0;

    // Lấy đối tượng button đang được click
    var button = $(this);

    // Lấy giá trị số lượng cũ từ thẻ input gần nhất
    var oldValue = button.parent().parent().find("input").val();
    var newVal;

    // KIỂM TRA: NÚT (+) HAY NÚT (-) ĐƯỢC NHẤN
    if (button.hasClass("btn-plus")) {
      // Nếu là nút (+), tăng số lượng lên 1
      newVal = parseFloat(oldValue) + 1;
      change = 1; // Ghi nhận sự thay đổi là +1
    } else {
      // Nếu là nút (-), giảm số lượng
      if (oldValue > 1) {
        newVal = parseFloat(oldValue) - 1;
        change = -1; // Ghi nhận sự thay đổi là -1
      } else {
        // Giữ nguyên số lượng là 1 nếu đang là 1
        newVal = 1;
        // không có sự thay đổi về tổng tiền
        change = 0;
      }
    }

    // CẬP NHẬT SỐ LƯỢNG MỚI VÀO Ô INPUT
    const input = button.parent().parent().find("input");
    input.val(newVal);

    // LẤY THÔNG TIN SẢN PHẨM VÀ CẬP NHẬT THÀNH TIỀN
    // Lấy giá và ID của sản phẩm từ data-attribute của thẻ input
    const price = input.attr("data-cart-detail-price");
    const id = input.attr("data-cart-detail-id");

    // Tìm đến thẻ <p> chứa thành tiền của sản phẩm này dựa vào ID
    const priceElement = $(`p[data-cart-detail-id='${id}']`);
    if (priceElement) {
      // Tính toán thành tiền mới (giá * số lượng mới)
      const newPrice = +price * newVal;
      // Cập nhật lại giao diện, định dạng lại tiền tệ
      priceElement.text(formatCurrency(newPrice));
    }

    // CẬP NHẬT TỔNG TIỀN CỦA TOÀN BỘ GIỎ HÀNG
    // Tìm tất cả các phần tử hiển thị tổng tiền
    const totalPriceElement = $("p[data-cart-total-price]");
    if (totalPriceElement && totalPriceElement.length) {
      // Lấy tổng tiền hiện tại từ data-attribute
      const currentTotal = totalPriceElement
        .first()
        .attr("data-cart-total-price");
      let newTotal;

      // Tính toán tổng tiền mới một cách hiệu quả
      // Chỉ cần lấy tổng cũ cộng/trừ đi giá của 1 sản phẩm
      newTotal = +currentTotal + change * +price;

      // Reset biến 'change' về 0
      change = 0;

      // Cập nhật lại tất cả các nơi hiển thị tổng tiền
      totalPriceElement.each(function (index, element) {
        // Cập nhật lại nội dung text
        $(totalPriceElement[index]).text(formatCurrency(newTotal));

        // Cập nhật lại giá trị trong data-attribute
        $(totalPriceElement[index]).attr("data-cart-total-price", newTotal);
      });
    }
  });

  /**
   * Hàm hỗ trợ định dạng một số thành chuỗi tiền tệ Việt Nam (VND)
   * @param {number} value - Số tiền cần định dạng
   * @returns {string} - Chuỗi tiền tệ đã được định dạng (ví dụ: 100.000 ₫)
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
})(jQuery);
