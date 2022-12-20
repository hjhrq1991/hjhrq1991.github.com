function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

<!--    以下JS桥部分     -->
//钉钉临时授权码
function setDingTalkAuth(auth) {
    try {
        bridge.callNative("setDingTalkAuth", auth);
    } catch (ex) {
    }
}

var requestData = {
    nativeConfig: {},
    nativeRequest: {}
};

var nativeConfig = {
    nativeCallName: "",
    requestId: "",
    timeStamp: 0,
    nativeCallType: "request"
};

/* 注册JS桥，默认桥名：WebViewJavascriptBridge */
var kkGroupJSBridge = function (callback) {
    try {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener("WebViewJavascriptBridgeReady", function () {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    } catch (ex) {
    }
};

/*
 * JS 调用app native方法
 *
 * @param nativeCallName 请求nativeCallName
 * @param data 数据实体
 */
var bridge = {
    callNative: function (nativeCallName, data) {
        nativeConfig.nativeCallName = nativeCallName;
        nativeConfig.requestId = "请求Id";
        nativeConfig.timeStamp = new Date().getTime();

        requestData.nativeConfig = nativeConfig;

        if (!data) {
            //设置一个空实体
            requestData.nativeRequest = {};
        } else {
            requestData.nativeRequest = data;
        }

        kkGroupJSBridge(function (bridge) {
            if (typeof bridge === "undefined") {
                return;
            }
            bridge.callHandler("nativeRequest", JSON.stringify(requestData));
        });
    },
};

/* app native调用 JS 方法 */
kkGroupJSBridge(function (bridge) {
    bridge.init(function (message, responseCallback) {
});

/* 注册nativeResponse，app native 通过nativeResponse调用 JS */
bridge.registerHandler("nativeResponse", function (data, responseCallback) {
    /* 这里执行相关处理 */
    var request = JSON.parse(data);
    var nativeConfig =  request.nativeConfig;

    if ("chooseMedia" == nativeConfig.nativeCallName){
        //示例
<!--        responseCallback("这里可以返回数据：" + data);-->
    }
});

bridge.registerHandler("nativeCall", function (data, responseCallback) {
<!--    showToast(data, 2000);-->
<!--    responseCallback("这里可以返回数据");-->
    });
});

/* 显示一个toast */
function showToast(msg, duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;max-height:60%;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 30px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}