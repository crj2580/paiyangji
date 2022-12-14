// 该插件需配合接口"ActionDataById"返回值使用
// #setWX 方法
// - 进行wx.config操作,并统计用户的分享数据
// @result : {}
// - 传入"ActionDataById"的返回值即可
// @permissionList : []
// - wx.config中的jsApiList 默认为["onMenuShareTimeline", "onMenuShareAppMessage"]
// @params : {} 
// - 用于传入一些自定义参数调整分享,如不传则由V3上的游戏分享配置决定
// - link 分享的页面地址
// - description 分享时的描述
// - title 分享时的标题
// - imageLink 分享时的图片地址
// @openTagList : []
// - wx.config的openTagList属性
// 
// #changeWX 方法
// - 当已经执行过wx.config,但需要修改配置时调用,入参同setWX
//
// # WXISREADY 变量
// - 用于监听wx.ready是否执行成功,默认为false,执行完成后变为true
// 


var WXISREADY = false;
function setWX(result, permissionList, params, openTagList) {
  try {
    var securityKey = result.result.deviceActivityGame.securityKey;
    var actionShare = result.result.deviceActivityGame.actionShare;
    var actionId = result.result.id;
    var openId = result.result.snsUserInfo.openid;

    if (!actionShare.title) {
      //游戏没有actionShare就用活动的
      actionShare = result.result.deviceActivityGame.activity.activityShare;
    }

    var wxInput = {
      tenantId: result.result.deviceActivityGame.tenantId,
      openId: result.result.snsUserInfo.openid,
      appid: result.result.deviceActivityGame.activity.weChatAppID,
      url: encodeURI(location.href.split("#")[0]),
    };

    if (!permissionList) {
      permissionList = ["onMenuShareTimeline", "onMenuShareAppMessage"];
    }

    //wx.ready内的permissionList会被改变
    var myPermissionList = [];
    for (var i = 0; i < permissionList.length; i++) {
      myPermissionList.push(permissionList[i]);
    }

    if (!actionShare) {
      actionShare = {
        title: "",
        link: "",
        imageLink: "",
        description: "",
      };
    }

    console.log(actionShare);
    if (!actionShare.link) {
      actionShare.link = `https://m.sensingstore.com/transfer-action.html?securityKey=${securityKey}`;
    }

    if (params) {
      if (params.autoLink) {
        actionShare.link = `https://m.sensingstore.com/transfer-action.html?securityKey=${securityKey}`;
      }
      if (params.link) {
        actionShare.link = params.link;
      }
      if (params.extraLink) {
        actionShare.link += params.extraLink;
      }
      if (params.sameLink) {
        actionShare.link = location.href;
      }
      if (params.imageLink) {
        actionShare.imageLink = params.imageLink;
      }
      if (params.description) {
        actionShare.description = params.description;
      }
      if (params.title) {
        actionShare.title = params.title;
      }
      if (params.messageDescription) {
        actionShare.messageDescription = params.messageDescription;
      }
      if (params.timelineDescription) {
        actionShare.timelineDescription = params.timelineDescription;
      }
    }
    console.log("actionShare", actionShare);

    $.get(
      "https://g.api.troncell.com/WeixinJSSDK/GetWeChatJsViewModel",
      wxInput,
      function (result, status) {
        if (result.success) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.result.appId, // 必填，公众号的唯一标识
            timestamp: result.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.result.nonceStr, // 必填，生成签名的随机串
            signature: result.result.signature, // 必填，签名
            jsApiList: permissionList, // 必填，需要使用的JS接口列表
            openTagList: openTagList ? openTagList : [],
          });
          wx.ready(function () {
            WXISREADY = true;
            console.log("wx ready");
            if (myPermissionList.indexOf("onMenuShareAppMessage") > -1) {
              wx.onMenuShareAppMessage({
                title: actionShare.title,
                desc: actionShare.messageDescription
                  ? actionShare.messageDescription
                  : actionShare.description,
                link: actionShare.link,
                imgUrl: actionShare.imageLink,
                success: function () {
                  // 用户点击了分享后执行的回调函数
                  $.post(
                    "https://g.api.troncell.com/api/UserAction/ShareAction",
                    {
                      ActionId: actionId,
                      OpenId: openId,
                      SnsType: "WeChat",
                      ShareType: "ShareAppMessage",
                    },
                    function (result) {}
                  );
                },
              });
            }

            if (myPermissionList.indexOf("onMenuShareTimeline") > -1) {
              wx.onMenuShareTimeline({
                // title: actionShare.title,
                title: actionShare.timelineDescription
                  ? actionShare.timelineDescription
                  : actionShare.description,
                link: actionShare.link,
                imgUrl: actionShare.imageLink,
                success: function () {
                  // 用户点击了分享后执行的回调函数
                  $.post(
                    "https://g.api.troncell.com/api/UserAction/ShareAction",
                    {
                      ActionId: actionId,
                      OpenId: openId,
                      SnsType: "WeChat",
                      ShareType: "ShareTimeline",
                    },
                    function (result) {}
                  );
                },
              });
            }

            if (myPermissionList.indexOf("hideOptionMenu") > -1) {
              wx.hideOptionMenu();
            }
          });
        }
      }
    );
  } catch (err) {
    // alert(err.message)
  }
}

function setFlow(result) {
  var obj = {};
  var activityFlows = result.result.activityFlows;
  for (var i = 0; i < activityFlows.length; i++) {
    if (activityFlows[i].flowType == 0 && activityFlows[i].outsideLink) {
      obj.activityCenter = activityFlows[i].outsideLink;
    }
    if (activityFlows[i].flowType == 4 && activityFlows[i].outsideLink) {
      obj.awardRanking = activityFlows[i].outsideLink;
    }
    if (activityFlows[i].flowType == 1 && activityFlows[i].outsideLink) {
      obj.register = activityFlows[i].outsideLink;
    }
    if (activityFlows[i].flowType == 2 && activityFlows[i].outsideLink) {
      obj.share = activityFlows[i].outsideLink;
    }
  }
  return obj;
}

function changeWX(result, permissionList, params) {
  try {
    var securityKey = result.result.deviceActivityGame.securityKey;
    var actionShare = result.result.deviceActivityGame.actionShare;
    var actionId = result.result.id;
    var openId = result.result.snsUserInfo.openid;

    if (!actionShare.title) {
      //游戏没有actionShare就用活动的
      actionShare = result.result.deviceActivityGame.activity.activityShare;
    }

    if (!permissionList) {
      permissionList = ["onMenuShareTimeline", "onMenuShareAppMessage"];
    }

    //wx.ready内的permissionList会被改变
    var myPermissionList = [];
    for (var i = 0; i < permissionList.length; i++) {
      myPermissionList.push(permissionList[i]);
    }

    if (!actionShare) {
      actionShare = {
        title: "",
        link: "",
        imageLink: "",
        description: "",
      };
    }

    if (params) {
      if (params.autoLink) {
        actionShare.link = `https://m.sensingstore.com/transfer-action.html?securityKey=${securityKey}`;
      }
      if (params.link) {
        actionShare.link += params.link;
      }
      if (params.imageLink) {
        actionShare.imageLink = params.imageLink;
      }
      if (params.description) {
        actionShare.description = params.description;
      }

      if (params.title) {
        actionShare.title = params.title;
      }
      if (params.messageDescription) {
        actionShare.messageDescription = params.messageDescription;
      }
      if (params.timelineDescription) {
        actionShare.timelineDescription = params.timelineDescription;
      }
    }

    if (myPermissionList.indexOf("onMenuShareAppMessage") > -1) {
      wx.onMenuShareAppMessage({
        title: actionShare.title,
        desc: actionShare.messageDescription
          ? actionShare.messageDescription
          : actionShare.description,
        link: actionShare.link,
        imgUrl: actionShare.imageLink,
        success: function () {
          // 用户点击了分享后执行的回调函数
          $.post(
            "https://g.api.troncell.com/api/UserAction/ShareAction",
            {
              ActionId: actionId,
              OpenId: openId,
              SnsType: "WeChat",
              ShareType: "ShareAppMessage",
            },
            function (result) {}
          );
        },
      });
    }

    if (myPermissionList.indexOf("onMenuShareTimeline") > -1) {
      wx.onMenuShareTimeline({
        title: actionShare.timelineDescription
          ? actionShare.timelineDescription
          : actionShare.description,
        link: actionShare.link,
        imgUrl: actionShare.imageLink,
        success: function () {
          // 用户点击了分享后执行的回调函数
          $.post(
            "https://g.api.troncell.com/api/UserAction/ShareAction",
            {
              ActionId: actionId,
              OpenId: openId,
              SnsType: "WeChat",
              ShareType: "ShareTimeline",
            },
            function (result) {}
          );
        },
      });
    }

    if (myPermissionList.indexOf("hideOptionMenu") > -1) {
      wx.hideOptionMenu();
    }
  } catch (err) {
    // alert(err.message)
  }
}
