var Quorra = { callback: {} };
Quorra.setCallback = function (name, f) {
  Quorra.callback[name] = f;
}


if (window.location.href.indexOf('127.0.0.1') >= 0 || window.location.href.indexOf('localhost') >= 0) {
  Quorra.atLocal = true;
} else {
  Quorra.atLocal = false;
}

Quorra.doDropCargo = function (cargoRoadNo) {
  if (Quorra.atLocal) {
    setTimeout(function () {
      Quorra.callback.dropCargoCallback()
    }, 1000)
    setTimeout(function () {
      Quorra.callback.finishCallback()
    }, 3000)
    return
  }
  window.WebViewJavascriptBridge.callHandler(
    'doDropCargo',
    JSON.stringify({
      cargoRoadNo: cargoRoadNo,
      extendObj: "subkey"
    })
    , function (responseData) { });
}
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady'
      , function () {
        callback(WebViewJavascriptBridge)
      },
      false
    );
  }
}
connectWebViewJavascriptBridge(function (bridge) {
  bridge.init(function (message, responseCallback) {
    console.log('JS got a message ' + message);
    var data = {
      'Javascript Responds': 'setBridge'
    };
    if (responseCallback) {
      console.log('JS responding with', data);
      responseCallback(data);
    }
  });

  bridge.registerHandler("dropCargoCallback", function (data, responseCallback) {
    if (responseCallback) {
      var responseData = "Javascript Says Right back aka!";
      responseCallback(responseData);
    }
    if (Quorra.callback["dropCargoCallback"]) {
      Quorra.callback["dropCargoCallback"](data)
    }
  });


  bridge.registerHandler("finishCallback", function (data, responseCallback) {
    if (responseCallback) {
      var responseData = "Javascript Says Right back aka!";
      responseCallback(responseData);
    }
    if (Quorra.callback["finishCallback"]) {
      Quorra.callback["finishCallback"]()
    }
  });


})
Quorra.playAudio = function (type) {//bg,scan,sorry,surprise
  if (Quorra.atLocal) {
    return
  }
  window.WebViewJavascriptBridge.callHandler(
    'playAudio',
    type
    , function (responseData) { });
}