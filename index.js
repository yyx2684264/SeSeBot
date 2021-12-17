var WebSocket = require("ws");
var ws = new WebSocket("ws://localhost:61001");

// 主函数
function main() {
    ws.onopen = function (e) {
        console.log('Connection to server opened');
    }

    ws.onerror = function (error) {
        console.log("Err:" + error);
    }

    ws.onclose = function () {
        console.log("Websocket Closed");
    }

    switch (process.argv[2]) {
        case "LoliconSetu":
            var LoliconSetu = require("./lib/LoliconSetu/LoliconSetu");
            ws.onmessage = function (msg) {
                let MsgJSON = JSON.parse(msg.data);
                // 色图监听
                LoliconSetu.Listen(ws, MsgJSON);
            }
            break;
        case "JavBus":
            var JavBus = require("./lib/JavBus/JavBus");
            ws.onmessage = function (msg) {
                let MsgJSON = JSON.parse(msg.data);
                // JavBus机器人
                JavBus.Listen(ws, MsgJSON);
            }
            break;
        case "BTSow":
            var BTSow = require("./lib/BTSow/BTSow");
            ws.onmessage = function (msg) {
                let MsgJSON = JSON.parse(msg.data);
                // BTSow机器人
                BTSow.Listen(ws, MsgJSON);
            }
            break;
        default:
            console.log("请输入正确的模式喵!例如:\nnode index.js LoliconSetu");
            console.log("目前有的模式如下:")
            console.log({
                "色图模式": "LoliconSetu",
                "AV搜索工具模式": "JavBus",
                "种子搜索工具模式": "BTSow",
            })
            process.exit();
            break;
    }
}

main();


