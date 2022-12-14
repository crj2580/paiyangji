// 解决弹出软键盘问题
var judgeDeviceType = function () {
  var ua = window.navigator.userAgent.toLocaleLowerCase();
  var isIOS = /iphone|ipad|ipod/.test(ua);
  var isAndroid = /android/.test(ua);
  return {
    isIOS: isIOS,
    isAndroid: isAndroid
  }
}()

function listenKeybord($input) {
  if (judgeDeviceType.isIOS) {
    $input.addEventListener('focus', function () {
      activeElementScrollIntoView($input, 1000);
    }, false)
    $input.addEventListener('blur', () => {
      var wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
      if (!wechatInfo) return;
      var wechatVersion = wechatInfo[1];
      var version = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      if (+wechatVersion.replace(/\./g, '') >= 674 && +version[1] >= 12) {
        setTimeout(function () {
          window.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight));
        })
      }
    })
  }
  if (judgeDeviceType.isAndroid) {
    var originHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.addEventListener('resize', function () {
      var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (originHeight < resizeHeight) {
        activeElementScrollIntoView($input, 1000);
      } else {
        activeElementScrollIntoView($input, 1000);
      }
      originHeight = resizeHeight;
    }, false)
  }
}
function activeElementScrollIntoView(activeElement, delay) {
  var editable = activeElement.getAttribute('contenteditable')
  if (activeElement.tagName == 'INPUT' || activeElement.tagName == 'TEXTAREA' || editable === '' || editable) {
    setTimeout(function () {
      activeElement.scrollIntoView();
    }, delay)
  }
}

var $inputs = document.querySelectorAll('.input');

for (var i = 0; i < $inputs.length; i++) {
  listenKeybord($inputs[i]);
}