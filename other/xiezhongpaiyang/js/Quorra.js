// 大屏端获取二维码,获取货道列表,开始轮询1
// 手机端扫码,大屏端轮询1获得userInfo,大屏端判断是否允许抽奖,手机端判断是否允许抽奖
// 若允许,大屏端开始轮询2,手机端抽奖,大屏端轮询2获得奖品,否则告知已经抽过
// 若为奖品,大屏端校对奖品和货道并判断是否还有,大屏端调用原生接口发奖品,大屏端调用dropCargo接口和confirm接口确认发放
// 否则为谢谢

if (
  window.location.href.indexOf("127.0.0.1") >= 0 ||
  window.location.href.indexOf("localhost") >= 0
) {
  var atLocal = true;
} else {
  var atLocal = false;
}
function doDropCargo(cargoRoadNo) {
  // console.log("doDropCargo 1");
  if (atLocal) {
    // console.log("doDropCargo 2");
    if (htmlCallback) {
      htmlCallback();
    }
    return;
  }

  //call native method
  window.WebViewJavascriptBridge.callHandler(
    "doDropCargo",
    // , "{\"cargoRoadNo\": \"0A\",\"extendObj\":\"subkey\"}"
    JSON.stringify({
      cargoRoadNo: cargoRoadNo,
      extendObj: "subkey",
    }),
    function (responseData) {
      // document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
    }
  );
}

function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function () {
        callback(WebViewJavascriptBridge);
      },
      false
    );
  }
}

connectWebViewJavascriptBridge(function (bridge) {
  //架起桥梁
  bridge.init(function (message, responseCallback) {
    // console.log("JS got a message " + message);
    var data = {
      "Javascript Responds": "测试中文!!!!",
    };

    if (responseCallback) {
      // console.log("JS responding with", data);
      responseCallback(data);
    }
  });

  bridge.registerHandler("dropCargoCallback", function (
    data,
    responseCallback
  ) {
    // document.getElementById("show").innerHTML = ("callback data from Java: = " + data);
    // console.log("mycallback", data);

    if (responseCallback) {
      var responseData = "Javascript Says Right back aka!";
      responseCallback(responseData);
    }

    if (htmlCallback) {
      htmlCallback(data);
    }
  });
});

// function playAudio(type) {
//   //bg,scan,sorry,surprise
//   if (atLocal) {
//     return;
//   }
//   // return
//   window.WebViewJavascriptBridge.callHandler("playAudio", type, function (
//     responseData
//   ) {
//     // document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
//   });
// }
