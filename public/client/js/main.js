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

    //set form index
    const index = input.attr("data-cart-detail-index");
    const el = document.getElementById(`cartDetails[${index}]`);
    $(el).val(newVal);

    //set quantity for detail page
    const elDetail = document.getElementById(`quantityDetail`);
    if (elDetail) {
      $(elDetail).val(newVal);
    }

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

  //add active cho client
  const navElement = $("#navbarCollapse");
  const currentUrl = window.location.pathname;
  navElement.find("a.nav-link").each(function () {
    const link = $(this); // Get the current link in the loop
    const href = link.attr("href"); // Get the href attribute of the link

    if (href === currentUrl) {
      link.addClass("active"); // Add 'active' class if the href matches the current URL
    } else {
      link.removeClass("active"); // Remove 'active' class if the href does not match
    }
  });

  //handle filter products
  $("#btnFilter").click(function (event) {
    event.preventDefault();

    let factoryArr = [];
    let targetArr = [];
    let priceArr = [];
    //factory filter
    $("#factoryFilter .form-check-input:checked").each(function () {
      factoryArr.push($(this).val());
    });

    //target filter
    $("#targetFilter .form-check-input:checked").each(function () {
      targetArr.push($(this).val());
    });

    //price filter
    $("#priceFilter .form-check-input:checked").each(function () {
      priceArr.push($(this).val());
    });

    //sort order
    let sortValue = $('input[name="radio-sort"]:checked').val();

    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    const currentPage = searchParams?.get("page") ?? "1";
    // Add or update query parameters
    searchParams.set("page", currentPage);
    searchParams.set("sort", sortValue);

    //reset
    searchParams.delete("factory");
    searchParams.delete("target");
    searchParams.delete("price");

    if (factoryArr.length > 0) {
      searchParams.set("factory", factoryArr.join(","));
    }

    if (targetArr.length > 0) {
      searchParams.set("target", targetArr.join(","));
    }

    if (priceArr.length > 0) {
      searchParams.set("price", priceArr.join(","));
    }

    // Update the URL and reload the page
    window.location.href = currentUrl.toString();
  });

  //handle auto checkbox after page loading
  // Parse the URL parameters
  const params = new URLSearchParams(window.location.search);

  // Set checkboxes for 'factory'
  if (params.has("factory")) {
    const factories = params.get("factory").split(",");
    factories.forEach((factory) => {
      $(`#factoryFilter .form-check-input[value="${factory}"]`).prop(
        "checked",
        true
      );
    });
  }

  // Set checkboxes for 'target'
  if (params.has("target")) {
    const targets = params.get("target").split(",");
    targets.forEach((target) => {
      $(`#targetFilter .form-check-input[value="${target}"]`).prop(
        "checked",
        true
      );
    });
  }

  // Set checkboxes for 'price'
  if (params.has("price")) {
    const prices = params.get("price").split(",");
    prices.forEach((price) => {
      $(`#priceFilter .form-check-input[value="${price}"]`).prop(
        "checked",
        true
      );
    });
  }

  // Set radio buttons for 'sort'
  if (params.has("sort")) {
    const sort = params.get("sort");
    $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop(
      "checked",
      true
    );
  }

  /////////////////////
  //handle add to cart with ajax
  $(".btnAddToCartHomepage").click(function (event) {
    event.preventDefault();

    if (!isLogin()) {
      $.toast({
        heading: "Lỗi thao tác",
        text: "Bạn cần đăng nhập tài khoản",
        position: "top-right",
        icon: "error",
      });
      return;
    }

    const productId = $(this).attr("data-product-id");

    $.ajax({
      url: `${window.location.origin}/api/add-product-to-cart`,
      type: "POST",
      data: JSON.stringify({ quantity: 1, productId: productId }),
      contentType: "application/json",

      success: function (response) {
        const sum = +response.data;
        $("#sumCart").text(sum);
        $.toast({
          heading: "Giỏ hàng",
          text: "Thêm sản phẩm vào giỏ hàng thành công",
          position: "top-right",
          icon: "success",
        });
      },
      error: function (response) {
        alert("Có lỗi xảy ra, vui lòng check lại code.");
        console.log("error: ", response);
      },
    });
  });

  $(".btnAddToCartDetail").click(function (event) {
    event.preventDefault();

    if (!isLogin()) {
      $.toast({
        heading: "Lỗi thao tác",
        text: "Bạn cần đăng nhập tài khoản",
        posotion: "top-right",
        icon: "error",
      });
      return;
    }

    const productId = $(this).attr("data-product-id");
    const quantity = $("#quantityDetail").val();

    $.ajax({
      url: `${window.location.origin}/api/add-product-to-cart`,
      type: "POST",
      data: JSON.stringify({ quantity: quantity, productId: productId }),
      contentType: "application/json",

      success: function (response) {
        const sum = +response.data;
        $("#sumCart").text(sum);
        $.toast({
          heading: "Giỏ hàng",
          text: "Thêm sản phẩm vào giỏ hàng thành công",
          position: "top-right",
          icon: "success",
        });
      },
      error: function (response) {
        alert("Có lỗi xảy ra, vui lòng check lại code.");
        console.log("error: ", response);
      },
    });
  });

  function isLogin() {
    const navElement = $("#navbarCollapse");
    const childLogin = navElement.find("a.a-login");
    if (childLogin.length > 0) {
      return false;
    }
    return true;
  }
})(jQuery);
