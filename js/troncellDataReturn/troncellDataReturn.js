//生成二维码时SnsType选择AliPay_WeChat,
//进入before-transfer页面并根据环境拼接from跳转到transfer-action页面,
//最终query带上openid/salesId进入实际页面并回传数据
//示例引入: <script id="troncellDataReturn" src="https://m.sensingstore.com/js/troncellDataReturn/troncellDataReturn.js" data-securitykey="7a0e41cedcc14ee292c21869a57aaa9f" data-appkey="13b45cc576434ebd9b6048f6ecf3dc0e"></script>
//注意,引入前需要先引入jquery

(function () {
  var scriptDom = document.getElementById("troncellDataReturn");

  if (kindId("salesId")) {
    localStorage.troncellData_salesId = kindId("salesId");
  }

  if (kindId("openid")) {
    localStorage.troncellData_openId = kindId("openid");
  }

  var openId = localStorage.troncellData_openId,
    from = "",
    ua = navigator.userAgent,
    salesId = localStorage.troncellData_salesId,
    securityKey = scriptDom.dataset.securitykey,
    appKey = scriptDom.dataset.appkey,
    collectionMarketDataId,
    lastURL;

  if (/MicroMessenger/i.test(ua)) {
    from = "weixin";
  } else if (/AlipayClient/i.test(ua)) {
    from = "alipay";
  } else if (/WeiBo/i.test(ua)) {
    from = "weibo";
  } else if (/aweme/i.test(ua)) {
    from = "douyin";
  } else {
    from = "other";
  }

  if (from != "other" && !openId && securityKey) {
    //在抖音 微信 支付宝中时如没有openId则走transfer流程
    $.post(
      "https://g.api.troncell.com/api/UserAction/PostPlayerData4ActionQrcode",
      {
        QrType: "AfterGame",
        SecurityKey: securityKey,
        IsSendWeChatMsg: false,
        SnsType: "AliPay_WeChat",
        FromType: "mobile",
        TargetUrl: window.location.href,
      },
      function (result) {
        window.location.href = result.result.qrCodeUrl;
      }
    );
    return;
  }

  function kindId(name) {
    var reg = new RegExp("(^|&|/?)" + name + "=([^&]*)(&|$)");
    var r = null;
    if (window.location.search) {
      r = window.location.search.substr(1).match(reg);
    } else if (window.location.hash) {
      r = window.location.hash.substr(3).match(reg);
    }
    if (r != null) {
      return decodeURI(r[2]);
    } else {
      return undefined;
    }
  }

  function AddMarketData() {
    $.ajax({
      type: "POST",
      url:
        "https://u.api.troncell.com/api/services/app/UserData/AddMarketData?appKey=" +
        appKey,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        openId: openId,
        // "comment": "string",
        action: "browser",
        from: from,
        salesId: salesId,
        url: window.location.href,
      }),
      success: function (message) {
        collectionMarketDataId = message.result;
      },
    });
  }
  function UpdateMarketData() {
    if (collectionMarketDataId) {
      var URL =
        "https://u.api.troncell.com/api/services/app/UserData/UpdateMarketData?appKey=" +
        appKey +
        "&id=" +
        collectionMarketDataId;
      navigator.sendBeacon(URL);
    }
  }
  window.addEventListener("pagehide", UpdateMarketData);

  //每秒检验一次url是否发生变化
  function checkUrlPerSecond() {
    if (lastURL != window.location.href.split("?")[0]) {
      UpdateMarketData();
      AddMarketData();
      lastURL = window.location.href.split("?")[0];
    }
    setTimeout(checkUrlPerSecond, 1000);
  }
  checkUrlPerSecond();
})();
